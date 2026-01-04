# Sistem Absensi Supplier - Backend API

> Backend API untuk Sistem Check-in Supplier dengan QR Code, GPS Geofencing, dan Server Timestamp

## 🚀 Fitur Utama

✅ **QR Code Validation** - Generate dan validasi QR Code unik  
✅ **GPS Geofencing** - Validasi lokasi dalam radius 100m dari gate  
✅ **Server Timestamp** - Timestamp dari server (anti-manipulasi)  
✅ **Audit Trail** - Log lengkap semua aktivitas  
✅ **Duplicate Prevention** - Cegah double check-in  
✅ **Device Tracking** - Identifikasi device yang curang  
✅ **Real-time Data** - Database realtime (MySQL)  
✅ **API Documentation** - Dokumentasi lengkap

---

## 📋 Prerequisites

- Node.js v14+ 
- MySQL 5.7+
- npm atau yarn

---

## 🔧 Installation

### 1. Setup Database

```bash
# Import database schema
mysql -u root -p < database.sql

# Atau gunakan MySQL Client untuk import database.sql
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Konfigurasi

```bash
# Copy file konfigurasi
cp .env.example .env

# Edit .env dengan kredensial database Anda
nano .env
```

### 4. Update Koordinat Geofencing

Edit [config.js](config.js) dan update koordinat gate perusahaan:

```javascript
geofencing: {
  centerLatitude: -6.2088,      // 👈 Update dengan latitude gate Anda
  centerLongitude: 106.8456,    // 👈 Update dengan longitude gate Anda
  radiusMeters: 100
}
```

**Cara mendapat koordinat:**
- Buka Google Maps
- Klik pada gate receiving area
- Copy latitude & longitude

---

## ▶️ Menjalankan Server

### Development Mode (dengan auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server akan berjalan di: **http://localhost:3000**

---

## 📚 API Documentation

Lengkap API documentation ada di [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

### Quick Start:

**1. Generate QR Code:**
```bash
curl -X POST http://localhost:3000/api/generate-qr \
  -H "Content-Type: application/json" \
  -d '{"supplier_id": 1}'
```

**2. Check-in:**
```bash
curl -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "qr_token": "a1b2c3d4...",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "accuracy": 8.5,
    "device_info": "Mozilla/5.0..."
  }'
```

**3. Get Today's Check-ins:**
```bash
curl http://localhost:3000/api/checkins/today
```

---

## 📁 Project Structure

```
backend/
├── server.js                 # Express server setup
├── routes.js                 # API endpoints
├── db.js                     # Database connection
├── config.js                 # Konfigurasi aplikasi
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── API_DOCUMENTATION.md      # Dokumentasi API lengkap
├── README.md                 # File ini
└── utils/
    ├── gps-validation.js     # GPS & Geofencing logic
    ├── qr-generator.js       # QR Code generation
    └── audit-logger.js       # Audit trail logging
```

---

## 🔒 Security Features

| Fitur | Deskripsi |
|-------|-----------|
| **Server Timestamp** | Waktu dicatat di server, tidak bisa direkayasa client |
| **QR Validation** | QR Code unique token, berlaku 24 jam |
| **Geofencing** | Validasi GPS dalam radius 100m |
| **GPS Accuracy** | Minimum accuracy 50 meter |
| **Audit Trail** | Log semua aktivitas check-in & QR |
| **Duplicate Check** | Max 1 check-in per 15 menit per supplier |
| **Device Tracking** | Catat info device untuk deteksi fraud |
| **IP Logging** | Log IP address setiap request |

---

## 📊 Database Schema

### Tabel Utama:

**suppliers** - Daftar supplier aktif
```sql
- supplier_id (PK)
- supplier_code (UNIQUE)
- supplier_name
- status (ACTIVE/INACTIVE/BLOCKED)
```

**attendance** - Log check-in
```sql
- checkin_id (PK)
- supplier_id (FK)
- qr_token
- latitude, longitude, accuracy
- distance (jarak dari gate)
- ip_address, device_info
- created_at (SERVER TIMESTAMP)
```

**qr_codes** - QR Code tracking
```sql
- qr_id (PK)
- qr_token (UNIQUE)
- status (ACTIVE/USED/EXPIRED)
- expires_at
- used_at
```

**audit_logs** - Audit trail
```sql
- log_id (PK)
- supplier_id (FK)
- action (CHECK_IN, GENERATE_QR, etc)
- status (SUCCESS, FAILED, INVALID_GPS, etc)
- details (JSON)
- created_at
```

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
✓ Pastikan MySQL service sedang berjalan  
✓ Check kredensial di .env atau config.js  
✓ Pastikan database `absensi_supplier` sudah dibuat

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
✓ Ubah PORT di config.js atau .env  
✓ Atau kill proses yang menggunakan port 3000

### CORS Error
✓ CORS sudah di-enable di server.js  
✓ Update origin di CORS config jika diperlukan

---

## 📈 Monitoring

### Check Server Health
```bash
curl http://localhost:3000/health
```

### View Database Logs
```bash
# Last 50 check-ins
SELECT * FROM attendance ORDER BY created_at DESC LIMIT 50;

# Audit trail
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100;

# Device logs
SELECT * FROM device_logs ORDER BY total_checkins DESC;
```

---

## 🚀 Next Steps

1. **Frontend/Mobile Development** - Buat form check-in di frontend
2. **QR Code Generation** - Integrate qrcode.js untuk generate QR image
3. **Dashboard** - Buat monitoring dashboard real-time
4. **Notification** - Setup notifikasi check-in
5. **Export Report** - Generate laporan harian/bulanan

---

## 📝 License

ISC

---

## 👨‍💻 Support

Untuk pertanyaan atau issue, silakan buat issue di project repository.

---

**Last Updated:** December 21, 2025
