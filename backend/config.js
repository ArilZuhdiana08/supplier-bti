// Konfigurasi Aplikasi
module.exports = {
  // Database Configuration (Supabase)
  database: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/absensi_supplier',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },

  // Geofencing Configuration (Gate Receiving Area)
  geofencing: {
    centerLatitude: -6.2088,      // Ganti dengan koordinat perusahaan Anda
    centerLongitude: 106.8456,    // Ganti dengan koordinat perusahaan Anda
    radiusMeters: 100             // Area radius 100 meter dari gate
  },

  // QR Code Configuration
  qrCode: {
    baseUrl: 'http://localhost:3000',
    expiryMinutes: 1440           // QR code berlaku 24 jam
  },

  // Server Configuration
  server: {
    port: 3000,
    environment: 'development'    // 'development' atau 'production'
  },

  // API Security
  security: {
    maxCheckinPerDay: 4,           // Max check-in per supplier per hari
    minIntervalMinutes: 15         // Minimal interval antar check-in
  },

  // Admin Configuration
  admin: {
    password: 'admin123'            // Password untuk akses admin
  }
};
