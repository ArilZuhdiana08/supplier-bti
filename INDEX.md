# 📑 PROJECT INDEX - Navigasi File

## 🎯 Quick Navigation

**Baru ke project ini?** Mulai dari sini:
1. [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) - Overview lengkap
2. [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Setup step-by-step
3. [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) - API reference

---

## 📚 Documentation Files

### Root Level
```
📄 README.md
   └─ Project overview, architecture, how it works
   └─ Start here untuk understand system

📄 SETUP_INSTRUCTIONS.md
   └─ Step-by-step setup guide
   └─ Troubleshooting tips
   └─ Configuration guide

📄 IMPLEMENTATION_COMPLETE.md
   └─ Summary of what's been done
   └─ Quick start (3 steps)
   └─ Checklist before production

📄 INDEX.md
   └─ File ini - navigasi project
```

---

## 🗄️ Database Files

```
📄 database.sql
   └─ Complete database schema
   └─ Tables: suppliers, attendance, qr_codes, geofencing_config, audit_logs, device_logs
   └─ Views: v_today_checkins, v_daily_summary
   └─ Sample data included
   └─ IMPORT: mysql -u root -p < database.sql
```

---

## 🖥️ Backend Files

### Main API Files
```
backend/
├─ 📄 server.js
│  └─ Express server setup
│  └─ Middleware configuration
│  └─ Error handling
│  └─ Port 3000 (configurable)

├─ 📄 routes.js
│  └─ 5 API endpoints
│  ├─ GET  /api/suppliers
│  ├─ POST /api/generate-qr
│  ├─ POST /api/checkin
│  ├─ GET  /api/checkins/today
│  └─ GET  /api/audit-logs/:id

├─ 📄 db.js
│  └─ MySQL connection setup
│  └─ Connection pooling
│  └─ Error handling

└─ 📄 config.js
   └─ Configuration center
   └─ Database credentials
   └─ ⭐ Geofencing coordinates (IMPORTANT!)
   └─ Security settings
```

### Utility/Helper Files
```
backend/utils/
├─ 📄 gps-validation.js
│  └─ GPS accuracy validation
│  └─ Geofencing calculation (Haversine)
│  └─ Location verification

├─ 📄 qr-generator.js
│  └─ QR token generation
│  └─ QR validation
│  └─ QR URL generation

└─ 📄 audit-logger.js
   └─ Audit trail logging
   └─ Activity tracking
   └─ Compliance logging
```

### Configuration & Package Files
```
backend/
├─ 📄 package.json
│  └─ npm dependencies
│  └─ Scripts: start, dev, test

├─ 📄 .env.example
│  └─ Environment variables template
│  └─ Copy to .env and fill values
```

### Documentation
```
backend/
├─ 📄 README.md
│  └─ Backend installation guide
│  └─ Quick start
│  └─ Troubleshooting

├─ 📄 API_DOCUMENTATION.md
│  └─ Complete API reference
│  └─ All 5 endpoints detailed
│  └─ Request/response examples
│  └─ Error codes
│  └─ Security features

└─ 📄 IMPLEMENTATION_SUMMARY.md
   └─ Features implemented
   └─ Architecture overview
   └─ Database schema summary
```

---

## 📱 Frontend Files

```
frontend/
└─ 📄 checkin.html
   └─ Placeholder for frontend
   └─ To be developed in Phase 2
```

---

## 🚀 How to Use This Project

### For Setup & Installation
```
START HERE ↓
SETUP_INSTRUCTIONS.md
    ↓
1. Database Setup → database.sql
2. Backend Setup → backend/package.json + npm install
3. Configuration → backend/config.js (UPDATE GEOFENCING!)
4. Run Server → npm run dev
5. Test APIs → Use curl or Postman
```

### For API Integration
```
START HERE ↓
backend/API_DOCUMENTATION.md
    ↓
1. Understand endpoints
2. See request/response examples
3. Test with curl/Postman
4. Integrate with frontend
```

### For Understanding System
```
START HERE ↓
README.md
    ↓
1. Read architecture
2. Understand alur kerja
3. See database diagram
4. Review security features
```

### For Development
```
Code location: ↓
backend/routes.js       - API endpoints
backend/utils/*.js      - Helper functions
backend/config.js       - Configuration
backend/server.js       - Server setup
```

---

## 📊 API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/suppliers` | List active suppliers |
| POST | `/api/generate-qr` | Generate QR code |
| POST | `/api/checkin` | Check-in with validation |
| GET | `/api/checkins/today` | Today's check-ins |
| GET | `/api/audit-logs/:id` | Supplier's audit trail |
| GET | `/health` | Health check |

Details: [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

---

## 🔧 Configuration Guide

### Most Important: Geofencing Coordinates

**File:** `backend/config.js`

```javascript
geofencing: {
  centerLatitude: -6.2088,      // ← UPDATE with your gate latitude
  centerLongitude: 106.8456,    // ← UPDATE with your gate longitude
  radiusMeters: 100             // ← Adjust radius if needed
}
```

**How to get coordinates:**
1. Open Google Maps
2. Click on your gate location
3. Copy latitude and longitude
4. Update in config.js

### Other Configurations

**Database:**
```javascript
database: {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'absensi_supplier'
}
```

**Server:**
```javascript
server: {
  port: 3000,
  environment: 'development'
}
```

**Security:**
```javascript
security: {
  minIntervalMinutes: 15,
  maxCheckinPerDay: 2
}
```

Details: [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

---

## 📋 Checklist - Before Go-Live

- [ ] Database imported: `mysql -u root -p < database.sql`
- [ ] Backend dependencies: `npm install`
- [ ] ⭐ Geofencing coordinates updated in config.js
- [ ] Database credentials verified
- [ ] Server running: `npm run dev`
- [ ] Health check works: `curl http://localhost:3000/health`
- [ ] All 5 endpoints tested
- [ ] GPS testing with real device
- [ ] Audit logs working
- [ ] Frontend ready for integration

---

## 🎓 Learning Path

**New to the project?** Follow this order:

1. **Understand the Problem**
   - Read [README.md](README.md) - Context & architecture

2. **Setup the System**
   - Follow [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
   - Import database.sql
   - Install backend
   - Run server

3. **Learn the API**
   - Read [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
   - Test endpoints with curl/Postman

4. **Understand the Code**
   - Review [backend/routes.js](backend/routes.js) - Endpoints
   - Review [backend/utils/](backend/utils/) - Helper functions
   - Review [backend/config.js](backend/config.js) - Configuration

5. **Next Phase: Frontend**
   - Develop frontend/mobile app
   - QR scanner UI
   - GPS capture
   - Check-in form
   - Dashboard

---

## 🆘 Common Questions

**Q: Where do I start?**
A: Start with [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

**Q: How do I test the API?**
A: Use [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

**Q: What should I modify?**
A: Mainly [backend/config.js](backend/config.js) for geofencing

**Q: How do I run the server?**
A: `cd backend && npm run dev`

**Q: Where is the database schema?**
A: [database.sql](database.sql)

---

## 📂 File Tree

```
supplier-bti/
├── 📄 INDEX.md                      ← You are here
├── 📄 README.md                     ← Project overview
├── 📄 SETUP_INSTRUCTIONS.md         ← Installation guide
├── 📄 IMPLEMENTATION_COMPLETE.md    ← What's done
├── 📄 database.sql                  ← Database schema
│
├── 📁 backend/
│   ├── 📄 server.js                 ← Express server
│   ├── 📄 routes.js                 ← API endpoints
│   ├── 📄 db.js                     ← Database connection
│   ├── 📄 config.js                 ← Configuration (EDIT THIS!)
│   ├── 📄 package.json              ← Dependencies
│   ├── 📄 .env.example              ← Environment template
│   ├── 📄 README.md                 ← Backend docs
│   ├── 📄 API_DOCUMENTATION.md      ← API reference
│   ├── 📄 IMPLEMENTATION_SUMMARY.md ← Features summary
│   │
│   └── 📁 utils/
│       ├── 📄 gps-validation.js
│       ├── 📄 qr-generator.js
│       └── 📄 audit-logger.js
│
└── 📁 frontend/
    └── 📄 checkin.html              ← Placeholder
```

---

## 🔗 External Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [GPS Geofencing](https://en.wikipedia.org/wiki/Geofencing)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

---

**Last Updated:** December 21, 2025

**Status:** ✅ Backend Complete | Ready for Frontend Development
