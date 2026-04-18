import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const OnboardingTour = () => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);

  const steps = [
    {
      title: '👋 Welcome to India Smart City Dashboard!',
      content: 'Your one-stop platform for real-time city monitoring, navigation, and event discovery across India.',
      icon: '🇮🇳',
    },
    {
      title: '📍 Select Your State',
      content: 'Use the dropdown at the top to select any Indian state. The dashboard will instantly update with real-time data for that state.',
      icon: '🗺️',
    },
    {
      title: '📊 Real-Time Metrics',
      content: 'View 8 key performance indicators including population, air quality, traffic, energy consumption, and more. Data updates every 30 seconds!',
      icon: '📈',
    },
    {
      title: '🚗 Smart Route Planner',
      content: 'Plan your route with traffic optimization. Compare the fastest route vs traffic-free route to make the best decision.',
      icon: '🛣️',
    },
    {
      title: '🗺️ Interactive Map',
      content: 'Explore traffic hotspots, pollution zones, and event locations. Click on markers for detailed information.',
      icon: '📍',
    },
    {
      title: '🎉 Discover Events',
      content: 'Find upcoming events, concerts, festivals, and conferences in your selected state with accurate dates and venues.',
      icon: '🎊',
    },
    {
      title: '🔔 Live Alerts',
      content: 'Stay informed with real-time alerts about traffic jams, air quality issues, weather updates, and more.',
      icon: '⚠️',
    },
    {
      title: '🎨 Theme & Settings',
      content: 'Toggle between dark and light mode using the theme button in the header. Your preference is automatically saved.',
      icon: '🌙',
    },
  ];

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleClose();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0a0e27, #1a1f3a)',
          border: '2px solid #00d4ff40',
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 16, top: 16, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <EmojiEventsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
            {steps[activeStep].title}
          </Typography>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                p: 4,
                bgcolor: 'background.paper',
                borderRadius: '16px',
                border: '1px solid #00d4ff40',
                mb: 3,
                textAlign: 'center',
              }}
            >
              <Typography variant="h2" sx={{ mb: 2 }}>
                {steps[activeStep].icon}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.primary', lineHeight: 1.8 }}>
                {steps[activeStep].content}
              </Typography>
            </Box>
          </motion.div>
        </AnimatePresence>

        <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    color: activeStep === index ? 'primary.main' : 'text.secondary',
                    fontWeight: activeStep === index ? 700 : 400,
                  },
                }}
              >
                {index + 1}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.secondary' }}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {activeStep + 1} of {steps.length}
          </Typography>
        </Box>

        <Button
          onClick={handleNext}
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            background: 'linear-gradient(135deg, #00d4ff, #5352ed)',
            fontWeight: 700,
          }}
        >
          {activeStep === steps.length - 1 ? "Let's Go! 🚀" : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OnboardingTour;
