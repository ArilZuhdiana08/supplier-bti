const express = require('express');
const router = express.Router();
const db = require('./db');
const config = require('./config');

// Import utility functions
const gpsValidation = require('./utils/gps-validation');
const qrGenerator = require('./utils/qr-generator');
const auditLogger = require('./utils/audit-logger');

// =====================================================
// ENDPOINT: GET /api/suppliers
// Mendapatkan daftar supplier aktif
// =====================================================
router.get('/suppliers', (req, res) => {
  const sql = `
    SELECT 
      supplier_id, 
      supplier_code,
      supplier_name, 
      contact_person,
      phone_number,
      status
    FROM suppliers 
    WHERE status = 'ACTIVE'
    ORDER BY supplier_name ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message 
      });
    }
    res.json({ 
      success: true, 
      data: result 
    });
  });
});

// =====================================================
// ENDPOINT: POST /api/generate-qr
// Generate QR Code untuk supplier
// =====================================================
router.post('/generate-qr', (req, res) => {
  const { supplier_id } = req.body;

  // Validasi input
  if (!supplier_id) {
    return res.status(400).json({
      success: false,
      message: 'Supplier ID diperlukan'
    });
  }

  // Generate QR Token
  const { qrToken, qrCode, expiryTime } = qrGenerator.generateQRToken(supplier_id);

  // Simpan ke database
  const sql = `
    INSERT INTO qr_codes (supplier_id, qr_token, qr_code, expires_at)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [supplier_id, qrToken, qrCode, expiryTime], (err, result) => {
    if (err) {
      auditLogger.logAuditTrail({
        supplierId: supplier_id,
        action: 'GENERATE_QR',
        status: 'FAILED',
        details: { error: err.message },
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        deviceInfo: req.headers['user-agent']
      });

      return res.status(500).json({
        success: false,
        message: 'Gagal generate QR Code',
        error: err.message
      });
    }

    // Generate QR Code URL
    const qrUrl = qrGenerator.generateQRCodeUrl(qrCode, supplier_id);

    auditLogger.logAuditTrail({
      supplierId: supplier_id,
      action: 'GENERATE_QR',
      status: 'SUCCESS',
      details: { qrCode, expiryTime },
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      deviceInfo: req.headers['user-agent']
    });

    res.json({
      success: true,
      message: 'QR Code berhasil dibuat',
      data: {
        qr_id: result.insertId,
        qr_code: qrCode,
        qr_url: qrUrl,
        expires_at: expiryTime,
        message: 'Scan QR Code atau buka URL di atas untuk check-in'
      }
    });
  });
});

// =====================================================
// ENDPOINT: POST /api/checkin
// Check-in dengan validasi QR Code dan GPS
// =====================================================
router.post('/checkin', (req, res) => {
  const { supplier_id, qr_token, latitude, longitude, accuracy, device_info } = req.body;
  const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Validasi input required
  if (!supplier_id || !latitude || !longitude || !qr_token) {
    return res.status(400).json({
      success: false,
      message: 'Data tidak lengkap (supplier_id, latitude, longitude, qr_token)',
      code: 'INVALID_INPUT'
    });
  }

  // Step 1: Validasi QR Token
  const qrValidateSql = `
    SELECT qr_id, expires_at, status 
    FROM qr_codes 
    WHERE qr_token = ? AND supplier_id = ?
    LIMIT 1
  `;

  db.query(qrValidateSql, [qr_token, supplier_id], (err, qrResult) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error saat validasi QR',
        error: err.message
      });
    }

    if (qrResult.length === 0) {
      auditLogger.logAuditTrail({
        supplierId: supplier_id,
        action: 'CHECK_IN',
        status: 'INVALID_QR',
        details: { qr_token },
        ipAddress,
        deviceInfo: device_info
      });

      return res.status(401).json({
        success: false,
        message: 'QR Code tidak valid atau tidak ditemukan',
        code: 'QR_INVALID'
      });
    }

    const qrData = qrResult[0];

    // Validasi status dan expiry QR
    const qrValidation = qrGenerator.validateQRToken(qr_token, qrData.expires_at);
    if (!qrValidation.isValid) {
      auditLogger.logAuditTrail({
        supplierId: supplier_id,
        action: 'CHECK_IN',
        status: qrValidation.code,
        details: { expires_at: qrData.expires_at },
        ipAddress,
        deviceInfo: device_info
      });

      return res.status(401).json({
        success: false,
        message: qrValidation.message,
        code: qrValidation.code
      });
    }

    // Step 2: Validasi GPS Accuracy
    const gpsAccuracy = gpsValidation.validateGPSAccuracy(accuracy);
    if (!gpsAccuracy.isValid) {
      auditLogger.logAuditTrail({
        supplierId: supplier_id,
        action: 'CHECK_IN',
        status: 'INVALID_GPS_ACCURACY',
        details: { accuracy, message: gpsAccuracy.message },
        ipAddress,
        deviceInfo: device_info
      });

      return res.status(400).json({
        success: false,
        message: gpsAccuracy.message,
        code: 'INVALID_GPS_ACCURACY',
        accuracy_info: gpsAccuracy
      });
    }

    // Step 3: Validasi Geofencing
    const geofenceValidation = gpsValidation.validateGeofencing(
      latitude,
      longitude,
      accuracy
    );

    if (!geofenceValidation.isValid) {
      auditLogger.logAuditTrail({
        supplierId: supplier_id,
        action: 'CHECK_IN',
        status: 'OUTSIDE_GEOFENCE',
        details: { 
          latitude,
          longitude,
          accuracy,
          distance: geofenceValidation.distance,
          maxRadius: geofenceValidation.maxRadius
        },
        ipAddress,
        deviceInfo: device_info
      });

      return res.status(403).json({
        success: false,
        message: geofenceValidation.message,
        code: 'OUTSIDE_GEOFENCE',
        geofence_info: geofenceValidation
      });
    }

    // Step 4: Cek duplikasi check-in (max 1 check-in per 15 menit)
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - config.security.minIntervalMinutes * 60000);

    const duplikateSql = `
      SELECT COUNT(*) as count 
      FROM attendance 
      WHERE supplier_id = ? 
      AND created_at >= ?
      LIMIT 1
    `;

    db.query(duplikateSql, [supplier_id, fifteenMinutesAgo], (err, dupResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error saat cek duplikasi',
          error: err.message
        });
      }

      if (dupResult[0].count > 0) {
        auditLogger.logAuditTrail({
          supplierId: supplier_id,
          action: 'CHECK_IN',
          status: 'DUPLICATE_CHECKIN',
          details: { minIntervalMinutes: config.security.minIntervalMinutes },
          ipAddress,
          deviceInfo: device_info
        });

        return res.status(429).json({
          success: false,
          message: `Check-in hanya boleh 1x per ${config.security.minIntervalMinutes} menit`,
          code: 'DUPLICATE_CHECKIN',
          retry_after_minutes: config.security.minIntervalMinutes
        });
      }

      // Step 5: Insert check-in ke database
      const checkinSql = `
        INSERT INTO attendance 
        (supplier_id, qr_token, latitude, longitude, accuracy, distance, ip_address, device_info)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        checkinSql,
        [
          supplier_id,
          qr_token,
          latitude,
          longitude,
          accuracy,
          geofenceValidation.distance,
          ipAddress,
          device_info
        ],
        (err, checkinResult) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Gagal menyimpan check-in',
              error: err.message
            });
          }

          // Update QR code status menjadi USED
          const updateQrSql = `
            UPDATE qr_codes 
            SET status = 'USED', used_at = NOW()
            WHERE qr_id = ?
          `;

          db.query(updateQrSql, [qrData.qr_id], () => {
            // Update device logs
            const deviceSql = `
              INSERT INTO device_logs (device_info, total_checkins)
              VALUES (?, 1)
              ON DUPLICATE KEY UPDATE 
                total_checkins = total_checkins + 1,
                last_seen = NOW()
            `;

            db.query(deviceSql, [device_info]);
          });

          // Log success
          auditLogger.logAuditTrail({
            supplierId: supplier_id,
            action: 'CHECK_IN',
            status: 'SUCCESS',
            details: {
              latitude,
              longitude,
              accuracy,
              distance: geofenceValidation.distance,
              gpsLevel: gpsAccuracy.level,
              checkinId: checkinResult.insertId
            },
            ipAddress,
            deviceInfo: device_info
          });

          res.status(200).json({
            success: true,
            message: 'Check-in berhasil!',
            code: 'CHECK_IN_SUCCESS',
            data: {
              checkin_id: checkinResult.insertId,
              checkin_time: new Date().toISOString(),
              location_info: {
                distance_from_gate: geofenceValidation.distance + ' meter',
                gps_accuracy: gpsAccuracy.level,
                accuracy: accuracy + ' meter'
              }
            }
          });
        }
      );
    });
  });
});

// =====================================================
// ENDPOINT: GET /api/checkins/today
// Mendapatkan check-in hari ini
// =====================================================
router.get('/checkins/today', (req, res) => {
  const sql = `
    SELECT 
      a.checkin_id,
      a.created_at as checkin_time,
      s.supplier_id,
      s.supplier_code,
      s.supplier_name,
      a.latitude,
      a.longitude,
      a.accuracy,
      a.distance,
      TIME(a.created_at) as time_only
    FROM attendance a
    JOIN suppliers s ON a.supplier_id = s.supplier_id
    WHERE DATE(a.created_at) = CURDATE()
    ORDER BY a.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: result,
      summary: {
        total_checkins: result.length,
        unique_suppliers: [...new Set(result.map(r => r.supplier_id))].length
      }
    });
  });
});

// =====================================================
// ENDPOINT: GET /api/audit-logs/:supplier_id
// Mendapatkan audit log untuk supplier
// =====================================================
router.get('/audit-logs/:supplier_id', (req, res) => {
  const { supplier_id } = req.params;
  const limit = req.query.limit || 50;

  const sql = `
    SELECT 
      log_id,
      action,
      status,
      details,
      ip_address,
      created_at
    FROM audit_logs
    WHERE supplier_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `;

  db.query(sql, [supplier_id, parseInt(limit)], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: result,
      count: result.length
    });
  });
});

module.exports = router;
