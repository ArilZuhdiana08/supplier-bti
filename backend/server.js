const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./config');
const routes = require('./routes');

const app = express();
const PORT = config.server.port;

// =====================================================
// MIDDLEWARE
// =====================================================

// Logging
app.use(morgan('combined'));

// CORS Configuration
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// =====================================================
// API ROUTES
// =====================================================
app.use('/api', routes);

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.server.environment
  });
});

// =====================================================
// ERROR HANDLING
// =====================================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
    path: req.path,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal Server Error',
    error: config.server.environment === 'development' ? err.message : 'Server error'
  });
});

// =====================================================
// START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   Sistem Absensi Supplier - Backend API         ║
║   Status: RUNNING                               ║
║   Port: ${PORT}                                   ║
║   Environment: ${config.server.environment}      ║
║   Geofencing: ${config.geofencing.radiusMeters}m radius                  ║
╚══════════════════════════════════════════════════╝
  `);
  console.log('API Endpoints:');
  console.log('  GET    /api/suppliers         - List supplier aktif');
  console.log('  POST   /api/generate-qr       - Generate QR Code');
  console.log('  POST   /api/checkin           - Check-in dengan QR + GPS');
  console.log('  GET    /api/checkins/today    - Checkin hari ini');
  console.log('  GET    /api/audit-logs/:id    - Audit trail supplier');
  console.log('  GET    /health                - Health check');
});

module.exports = app;
