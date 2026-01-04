# TODO: Deploy dengan Netlify dan Supabase

## 1. Update Dependencies
- [ ] Tambah `pg` (PostgreSQL client) ke package.json
- [ ] Update package.json untuk Netlify Functions

## 2. Update Database Configuration
- [ ] Update `backend/config.js` untuk Supabase (PostgreSQL)
- [ ] Update `backend/db.js` untuk menggunakan pg library

## 3. Convert Backend to Netlify Functions
- [ ] Buat direktori `netlify/functions`
- [ ] Pindah logika API ke `netlify/functions/api.js`
- [ ] Buat `netlify.toml` untuk konfigurasi

## 4. Update Frontend
- [ ] Update `frontend/checkin.html` untuk memanggil API backend
- [ ] Update `frontend/admin-monitor.html` untuk fetch data dari API

## 5. Testing dan Deploy
- [ ] Test lokal dengan Netlify CLI
- [ ] Deploy ke Netlify dan Supabase
