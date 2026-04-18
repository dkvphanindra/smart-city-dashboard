# 🚀 Complete Backend Setup Guide - India Smart City Dashboard

## 📋 **Full-Stack Architecture**

```
Frontend (React + Vite)
  ↓
Backend (Node.js + Express)
  ↓
Database (MongoDB Atlas)
  ↓
APIs (AQICN, OpenWeather, OSRM)
```

---

## 🔧 **Step 1: Backend Setup**

### **1.1 Create Backend Directory**

```bash
cd "c:\Users\D LAHARI\OneDrive\Desktop\Hackathon"
mkdir smart-city-backend
cd smart-city-backend
npm init -y
```

### **1.2 Install Backend Dependencies**

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv axios
npm install --save-dev nodemon
```

### **1.3 Create Backend Structure**

```
smart-city-backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   └── User.js               # User model
├── routes/
│   └── auth.js               # Authentication routes
├── controllers/
│   └── authController.js     # Auth logic
├── middleware/
│   └── auth.js               # JWT verification
├── .env                      # Environment variables
└── server.js                 # Entry point
```

### **1.4 Create `.env` File**

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartcity?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### **1.5 MongoDB Atlas Setup (FREE)**

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a new cluster (M0 Free tier)
4. Get connection string
5. Replace `<password>` with your database password
6. Whitelist IP: `0.0.0.0/0` (allow all IPs for demo)

---

## 💻 **Step 2: Backend Code Implementation**

### **File: `config/db.js`**

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### **File: `models/User.js`**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### **File: `controllers/authController.js`**

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/auth/stats
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      success: true,
      data: { totalUsers, activeUsers },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### **File: `routes/auth.js`**

```javascript
const express = require('express');
const router = express.Router();
const { register, login, getUserStats } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/stats', getUserStats);

module.exports = router;
```

### **File: `server.js`**

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart City Backend is running',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### **File: `package.json` (scripts section)**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🔐 **Step 3: Frontend Authentication Integration**

### **Create `src/components/AuthPages.jsx`**

```javascript
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';

const AuthPages = ({ onAuthSuccess }) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api/auth';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = tab === 0 ? '/register' : '/login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        onAuthSuccess(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0e27, #1a1f3a)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            width: 450,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: 'white', fontWeight: 800 }}>
              🇮🇳 Smart City Dashboard
            </Typography>

            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
              <Tab label="Register" sx={{ color: 'white' }} />
              <Tab label="Login" sx={{ color: 'white' }} />
            </Tabs>

            <form onSubmit={handleSubmit}>
              {tab === 0 && (
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ mb: 2, input: { color: 'white' } }}
                  required
                />
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{ mb: 2, input: { color: 'white' } }}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                sx={{ mb: 2, input: { color: 'white' } }}
                required
              />

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
                  fontWeight: 700,
                }}
              >
                {loading ? 'Please wait...' : tab === 0 ? 'Create Account' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AuthPages;
```

---

## 🚀 **Step 4: Run Full Stack**

### **Terminal 1 - Backend:**
```bash
cd "c:\Users\D LAHARI\OneDrive\Desktop\Hackathon\smart-city-backend"
npm run dev
```

### **Terminal 2 - Frontend:**
```bash
cd "c:\Users\D LAHARI\OneDrive\Desktop\Hackathon\smart-city-dashboard"
npm run dev
```

---

## 📊 **Step 5: API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/stats` | Get user statistics |
| GET | `/api/health` | Health check |

---

## 🎯 **Step 6: Production Deployment**

### **Frontend (Vercel - FREE):**

```bash
npm install -g vercel
cd "c:\Users\D LAHARI\OneDrive\Desktop\Hackathon\smart-city-dashboard"
vercel --prod
```

### **Backend (Render - FREE):**

1. Push backend to GitHub
2. Visit: https://render.com
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy!

### **Database (MongoDB Atlas - FREE):**

Already set up in Step 1.5

---

## ✅ **Checklist**

- [x] Route planner fixed with map integration
- [x] Silent background updates (5 min)
- [x] Professional landing page
- [ ] Backend setup (follow guide above)
- [ ] Authentication pages (use code above)
- [ ] Real-time AQI API (add API key to `apiService.js`)
- [ ] Deploy to production

---

## 🔑 **Get Free AQI API Key**

1. Visit: https://aqicn.org/data-platform/token/
2. Register (free)
3. Copy API token
4. Update in `src/services/apiService.js`:
```javascript
const AQICN_API_KEY = 'your_actual_api_key_here';
```

---

## 📞 **Need Help?**

All code is provided above. Just:
1. Set up MongoDB Atlas (5 min)
2. Copy backend code
3. Run both servers
4. Test registration/login
5. Deploy to Vercel + Render

**Your full-stack app will be production-ready! 🚀**
