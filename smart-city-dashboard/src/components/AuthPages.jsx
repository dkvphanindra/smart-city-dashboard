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
  IconButton,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthPages = ({ onAuthSuccess, onBack }) => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = tab === 0 ? '/register' : '/login';
      const payload =
        tab === 0
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }
          : {
              email: formData.email,
              password: formData.password,
            };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Auth success, data:', data.data);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        setSuccess(tab === 0 ? 'Registration successful!' : 'Login successful!');

        setTimeout(() => {
          console.log('🚀 Calling onAuthSuccess...');
          onAuthSuccess(data.data);
        }, 1000);
      } else {
        console.error('❌ Auth failed:', data.message);
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Network error. Please check if backend is running.');
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
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            width: { xs: '100%', sm: 450 },
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <IconButton onClick={onBack} sx={{ mb: 2, color: 'white' }}>
              <ArrowBackIcon />
            </IconButton>

            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                mb: 1,
                color: 'white',
                fontWeight: 800,
              }}
            >
              Smart City Dashboard
            </Typography>

            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mb: 3,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {tab === 0 ? 'Create your account to continue' : 'Login to access your dashboard'}
            </Typography>

            <Tabs
              value={tab}
              onChange={(e, v) => {
                setTab(v);
                setError('');
                setSuccess('');
              }}
              centered
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                },
                '& .Mui-selected': {
                  color: '#00d4ff !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#00d4ff',
                },
              }}
            >
              <Tab label="Register" />
              <Tab label="Login" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {tab === 0 && (
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{
                    mb: 2,
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#00d4ff' },
                      '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                    },
                  }}
                  required
                />
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{
                  mb: 2,
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#00d4ff' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                  },
                }}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                sx={{
                  mb: 3,
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#00d4ff' },
                    '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                  },
                }}
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
                  fontWeight: 700,
                  fontSize: '16px',
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00b8e6, #4742d6)',
                  },
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