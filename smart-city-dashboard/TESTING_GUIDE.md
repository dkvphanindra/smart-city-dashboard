# 🧪 Testing Guide - Complete User Flow

## ✅ **What's Been Fixed**

### **Navigation Issues - RESOLVED:**
1. ✅ Landing page now properly navigates to Login/Register/Dashboard
2. ✅ Auth pages created with working forms
3. ✅ Backend integration for login/register
4. ✅ User session persistence (localStorage)
5. ✅ Logout functionality added to header
6. ✅ Auto-redirect if already logged in

---

## 🎯 **Complete Testing Steps**

### **Prerequisites:**

**Terminal 1 - Backend (MUST be running):**
```bash
cd "c:\Users\D LAHARI\OneDrive\Desktop\Hackathon\smart-city-backend"
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

**Terminal 2 - Frontend (Already running):**
```bash
cd "c:\Users\D LAHARI\OneDrive\Desktop\Hackathon\smart-city-dashboard"
npm run dev
```

**Expected Output:**
```
➜  Local:   http://localhost:5175/
```

---

## 📋 **Test 1: Landing Page Navigation**

### **Steps:**
1. Open browser: http://localhost:5175/
2. **Expected:** Beautiful landing page with:
   - Hero section with gradient background
   - Stats cards (28+ States, 90% Accuracy, etc.)
   - 4 Feature cards
   - "Explore Dashboard" button
   - "Create Account" button
   - "Login" button

### **Test Buttons:**
- ✅ Click "Explore Dashboard" → Should go to dashboard (no login required)
- ✅ Click "Create Account" → Should go to Register page
- ✅ Click "Login" → Should go to Login page

---

## 📋 **Test 2: User Registration**

### **Steps:**
1. Click "Create Account" on landing page
2. **Expected:** Registration form with:
   - Back button (←)
   - Full Name field
   - Email field
   - Password field
   - "Create Account" button
   - Link to switch to Login

3. **Fill Form:**
   ```
   Name: Test User
   Email: test@example.com
   Password: password123
   ```

4. Click "🚀 Create Account"

### **Expected Result:**
- ✅ Success message: "Registration successful!"
- ✅ Auto-redirect to dashboard after 1 second
- ✅ User info stored in localStorage
- ✅ Backend creates user in MongoDB

### **Verify in Backend Terminal:**
```
POST /api/auth/register 201
```

---

## 📋 **Test 3: User Login**

### **Steps:**
1. Logout (click logout icon in header)
2. Click "Login" on landing page
3. **Expected:** Login form with:
   - Email field
   - Password field
   - "🔐 Login" button
   - Link to switch to Register

4. **Fill Form:**
   ```
   Email: test@example.com
   Password: password123
   ```

5. Click "🔐 Login"

### **Expected Result:**
- ✅ Success message: "Login successful!"
- ✅ Auto-redirect to dashboard
- ✅ User name appears in header
- ✅ Token stored in localStorage

### **Verify in Backend Terminal:**
```
POST /api/auth/login 200
```

---

## 📋 **Test 4: Dashboard Features**

### **After Login, Verify:**
1. ✅ User name displayed in header (next to 👤 icon)
2. ✅ Logout button visible (🚪 icon)
3. ✅ State selector dropdown works
4. ✅ KPI cards show data
5. ✅ Route planner functional
6. ✅ Map displays correctly
7. ✅ Charts render properly
8. ✅ Events list shows events
9. ✅ Alerts display

### **Test State Selection:**
1. Change state from dropdown (e.g., Maharashtra → Delhi)
2. **Expected:**
   - All data updates
   - Map centers on new state
   - Events change to state-specific
   - Loading indicator shows briefly

---

## 📋 **Test 5: Logout Functionality**

### **Steps:**
1. Click logout icon (🚪) in header
2. **Expected:**
   - User data cleared from localStorage
   - Redirect to landing page
   - Header shows no user info

### **Verify:**
1. Open Browser DevTools (F12)
2. Go to Application tab
3. Check Local Storage
4. **Expected:** `token` and `user` keys removed

---

## 📋 **Test 6: Session Persistence**

### **Steps:**
1. Login with credentials
2. Close browser tab
3. Reopen: http://localhost:5175/
4. **Expected:** Auto-redirect to dashboard (stays logged in)

### **How It Works:**
- On app load, checks localStorage for user
- If found, skips landing page
- Goes directly to dashboard

---

## 📋 **Test 7: Route Planner**

### **Steps:**
1. Go to dashboard
2. Scroll to Route Planner
3. Select:
   - Starting Point: Mumbai
   - Destination: Pune
4. Click "🚀 Find Best Routes"

### **Expected Result:**
- ✅ Two route cards appear (Traffic vs Traffic-Free)
- ✅ Route lines show on map (Red & Green)
- ✅ Start/End markers on map
- ✅ Turn-by-turn directions
- ✅ Distance and time displayed

---

## 📋 **Test 8: Error Handling**

### **Test Invalid Login:**
1. Go to login page
2. Enter wrong credentials:
   ```
   Email: wrong@example.com
   Password: wrongpass
   ```
3. **Expected:** Error message "Invalid credentials"

### **Test Backend Not Running:**
1. Stop backend (Ctrl+C in backend terminal)
2. Try to login/register
3. **Expected:** Error message "Network error. Please check if backend is running."

---

## 🐛 **Troubleshooting**

### **Issue: "Network error" on login/register**

**Solution:**
```bash
# Check if backend is running
cd "c:\Users\D LAHARI\OneDrive\Desktop\Hackathon\smart-city-backend"
npm run dev

# Should show:
# 🚀 Server running on port 5000
# ✅ MongoDB Connected: ...
```

### **Issue: Page not navigating**

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check browser console for errors (F12)

### **Issue: MongoDB connection error**

**Solution:**
1. Check `.env` file in backend
2. Verify MONGODB_URI is correct
3. Check MongoDB Atlas IP whitelist (0.0.0.0/0)

### **Issue: User not persisting after refresh**

**Solution:**
1. Open DevTools (F12)
2. Check Application → Local Storage
3. Should have `user` and `token` keys
4. If missing, login again

---

## ✅ **Complete Feature Checklist**

### **Landing Page:**
- [x] Displays correctly
- [x] "Explore Dashboard" works
- [x] "Create Account" navigates to register
- [x] "Login" navigates to login page
- [x] Responsive on all devices

### **Authentication:**
- [x] Registration creates user in MongoDB
- [x] Login validates credentials
- [x] JWT token generated
- [x] User data stored in localStorage
- [x] Auto-redirect on success
- [x] Error messages display correctly
- [x] Password hashing works

### **Dashboard:**
- [x] Shows user name in header
- [x] Logout button works
- [x] Session persists on refresh
- [x] All features functional
- [x] Data updates every 5 min

### **Navigation Flow:**
```
Landing Page
  ├─→ Explore Dashboard → Dashboard (no login)
  ├─→ Create Account → Register → Dashboard
  └─→ Login → Login → Dashboard
                      ↓
                  Dashboard (with user info)
                      ↓
                  Logout → Landing Page
```

---

## 🎯 **Quick Test Commands**

### **Test Backend API:**
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## 🚀 **Ready for Demo!**

**Your complete flow:**
1. ✅ Landing page → Professional first impression
2. ✅ Register/Login → Secure authentication
3. ✅ Dashboard → Full features with user context
4. ✅ Logout → Clean session management
5. ✅ Session persistence → Remembers logged-in users

**Time to test: 10 minutes**

**If everything works → READY FOR HACKATHON! 🏆**
