import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrafficIcon from '@mui/icons-material/Traffic';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SpeedIcon from '@mui/icons-material/Speed';
import PublicIcon from '@mui/icons-material/Public';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LoginIcon from '@mui/icons-material/Login';

const LandingPage = ({ onGetStarted }) => {

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const floatAnimation = {
  y: [0, -12, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

const buttonHover = {
  scale: 1.04,
  y: -2,
  transition: { duration: 0.2 },
};

  const features = [
    {
      icon: <LocationOnIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Real-Time State Data',
      description: 'Monitor air quality, traffic, and energy across all 28 Indian states with 90%+ accuracy',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Smart Navigation',
      description: 'AI-powered route planning with traffic avoidance and real-time congestion updates',
    },
    {
      icon: <EventIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Live Events',
      description: 'Discover festivals, concerts, and conferences happening in your city right now',
    },
    {
      icon: <NotificationsIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Instant Alerts',
      description: 'Get notified about traffic jams, air quality issues, and weather changes instantly',
    },
  ];

  const stats = [
    { value: '28+', label: 'States Covered' },
    { value: '90%', label: 'Data Accuracy' },
    { value: '5 min', label: 'Update Frequency' },
    { value: '24/7', label: 'Live Monitoring' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0e27' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontWeight: 800, flexGrow: 1, color: 'white' }}>
            Smart City Dashboard
          </Typography>
          <Button
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={() => onGetStarted('login')}
            sx={{ color: 'white', borderColor: 'white', mr: 2 }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            onClick={() => onGetStarted('login')}
            sx={{
              background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
              fontWeight: 700,
            }}
          >
            Launch Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '10%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(83,82,237,0.1) 0%, transparent 70%)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: 'white',
                    mb: 3,
                    lineHeight: 1.2,
                  }}
                >
                  Smartest
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'block',
                    }}
                  >
                    Smart City Dashboard
                  </Box>
                </Typography>

                <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.6 }}>
                  Real-time monitoring, intelligent navigation, and live event discovery
                  across all Indian states with 90%+ data accuracy.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => onGetStarted('login')}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '18px',
                      background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
                      fontWeight: 700,
                      borderRadius: '12px',
                    }}
                  >
                    Explore Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => onGetStarted('register')}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '18px',
                      color: 'white',
                      borderColor: 'white',
                      borderRadius: '12px',
                    }}
                  >
                    Create Account
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Stats Cards */}
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} key={index}>
                      <Card
                        sx={{
                          background: 'rgba(255,255,255,0.05)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '16px',
                          textAlign: 'center',
                          p: 2,
                        }}
                      >
                        <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          {stat.label}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#0a0e27' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 800,
                color: 'white',
                mb: 2,
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.7)',
                mb: 6,
                fontWeight: 400,
              }}
            >
              Everything you need to stay informed and navigate smartly
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(83,82,237,0.1))',
                      border: '1px solid rgba(0,212,255,0.2)',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,212,255,0.2)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #00d4ff20, #5352ed20)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 3 }}>
              Ready to Experience Smart City Living?
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
              Join thousands of users monitoring their cities in real-time
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => onGetStarted('login')}
              sx={{
                py: 2,
                px: 6,
                fontSize: '20px',
                background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
                fontWeight: 700,
                borderRadius: '12px',
              }}
            >
              Get Started Now - It's Free!
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#050814', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          © 2026 Smart City Dashboard | Built with ❤️ for Hackathon
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;