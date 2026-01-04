-- =====================================================
-- DATABASE: absensi_supplier
-- Sistem Check-in Supplier dengan QR Code & GPS
-- =====================================================

CREATE DATABASE IF NOT EXISTS absensi_supplier;
USE absensi_supplier;

-- =====================================================
-- TABLE: suppliers
-- Daftar supplier/vendor
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_name VARCHAR(100) NOT NULL,
  supplier_code VARCHAR(20) UNIQUE NOT NULL,
  contact_person VARCHAR(100),
  phone_number VARCHAR(20),
  email VARCHAR(100),
  company_address TEXT,
  city VARCHAR(50),
  status ENUM('ACTIVE', 'INACTIVE', 'BLOCKED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  notes TEXT,
  INDEX idx_status (status),
  INDEX idx_code (supplier_code)
);

-- =====================================================
-- TABLE: attendance
-- Log check-in supplier
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance (
  checkin_id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  qr_token VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accuracy DECIMAL(6, 2),
  distance DECIMAL(8, 2),
  ip_address VARCHAR(45),
  device_info VARCHAR(255),
  checkout_time DATETIME,
  status ENUM('CHECK_IN', 'CHECK_OUT', 'INCOMPLETE') DEFAULT 'CHECK_IN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  INDEX idx_supplier (supplier_id),
  INDEX idx_date (DATE(created_at)),
  INDEX idx_status (status)
);

-- =====================================================
-- TABLE: qr_codes
-- QR Code yang aktif (untuk validasi)
-- =====================================================
CREATE TABLE IF NOT EXISTS qr_codes (
  qr_id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  qr_token VARCHAR(255) UNIQUE NOT NULL,
  qr_code VARCHAR(50) NOT NULL,
  status ENUM('ACTIVE', 'USED', 'EXPIRED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  INDEX idx_qr_token (qr_token),
  INDEX idx_supplier (supplier_id),
  INDEX idx_expires (expires_at)
);

-- =====================================================
-- TABLE: geofencing_config
-- Konfigurasi geofencing area
-- =====================================================
CREATE TABLE IF NOT EXISTS geofencing_config (
  config_id INT PRIMARY KEY AUTO_INCREMENT,
  location_name VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INT DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  notes TEXT,
  INDEX idx_active (is_active)
);

-- =====================================================
-- TABLE: audit_logs
-- Log semua aktivitas untuk keamanan
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT,
  action VARCHAR(50),
  status VARCHAR(50),
  details JSON,
  ip_address VARCHAR(45),
  device_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  INDEX idx_supplier (supplier_id),
  INDEX idx_action (action),
  INDEX idx_date (DATE(created_at))
);

-- =====================================================
-- TABLE: device_logs
-- Log device yang melakukan check-in
-- =====================================================
CREATE TABLE IF NOT EXISTS device_logs (
  device_id INT PRIMARY KEY AUTO_INCREMENT,
  device_info VARCHAR(255) NOT NULL,
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  total_checkins INT DEFAULT 0,
  is_flagged BOOLEAN DEFAULT FALSE,
  notes TEXT,
  INDEX idx_device (device_info),
  INDEX idx_flagged (is_flagged)
);

-- =====================================================
-- Sample Data
-- =====================================================

-- Insert Geofencing Config (Gate Receiving)
INSERT INTO geofencing_config (location_name, latitude, longitude, radius_meters, is_active)
VALUES ('Gate Receiving Area', -6.2088, 106.8456, 100, TRUE);

-- Insert Sample Suppliers
INSERT IGNORE INTO suppliers (supplier_code, supplier_name, contact_person, phone_number, email, city, status)
VALUES 
('SUP001', 'PT. Mitra Supplier A', 'Budi Santoso', '08123456789', 'budi@supplier-a.com', 'Jakarta', 'ACTIVE'),
('SUP002', 'PT. Mitra Supplier B', 'Rina Wijaya', '08987654321', 'rina@supplier-b.com', 'Tangerang', 'ACTIVE'),
('SUP003', 'CV. Logistik Express', 'Ahmad Ridho', '08567890123', 'ahmad@logistik.com', 'Bekasi', 'ACTIVE');

-- =====================================================
-- Create Views untuk Dashboard
-- =====================================================

-- View: Today's Check-ins
CREATE OR REPLACE VIEW v_today_checkins AS
SELECT 
  a.checkin_id,
  s.supplier_id,
  s.supplier_code,
  s.supplier_name,
  a.created_at AS checkin_time,
  a.latitude,
  a.longitude,
  a.distance,
  a.accuracy,
  a.ip_address,
  TIME(a.created_at) AS time_only
FROM attendance a
JOIN suppliers s ON a.supplier_id = s.supplier_id
WHERE DATE(a.created_at) = CURDATE()
ORDER BY a.created_at DESC;

-- View: Daily Summary
CREATE OR REPLACE VIEW v_daily_summary AS
SELECT 
  DATE(created_at) AS checkin_date,
  COUNT(DISTINCT supplier_id) AS total_suppliers,
  COUNT(*) AS total_checkins,
  MIN(created_at) AS first_checkin,
  MAX(created_at) AS last_checkin
FROM attendance
GROUP BY DATE(created_at)
ORDER BY checkin_date DESC;
