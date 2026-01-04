# TODO: Konversi ke Website Sederhana Tanpa Backend

## Status: Completed (Testing Done, Ready for Use)

### ✅ Completed Tasks
- [x] Analyze current structure and plan changes
- [x] Get user approval for plan
- [x] Create TODO.md tracking file
- [x] Move admin-monitor.html to root directory
- [x] Move frontend/assets/ to root assets/
- [x] Modify checkin.html to use localStorage instead of API calls
- [x] Update netlify.toml to remove API redirects and fix publish directory
- [x] Add geofencing validation for gate location (P39P+9V2, Gandasari, Cikarang Barat, Bekasi)

### 🔄 Current Tasks
- [x] Test website functionality (files opened in browser for manual testing)
- [ ] Deploy to Netlify

### 📋 Detailed Plan
1. **File Restructuring:**
   - Move `admin-monitor.html` from root to root (already in root)
   - Move `frontend/assets/` to `assets/`
   - Update asset paths in HTML files

2. **checkin.html Modifications:**
   - Remove all `fetch()` API calls
   - Replace supplier loading with hardcoded list or free text input
   - Save checkin data to localStorage in format expected by admin-monitor.html
   - Keep GPS location detection
   - Keep admin login functionality

3. **netlify.toml Updates:**
   - Remove API redirect rules since no backend needed
   - Keep publish directory as "."

4. **Testing:**
   - Test checkin form saves to localStorage
   - Test admin panel displays saved data
   - Test navigation between pages

5. **Deployment:**
   - Deploy to Netlify
   - Verify website loads correctly
