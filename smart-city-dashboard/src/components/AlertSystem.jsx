import { Card, CardContent, Typography, Box, Badge, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

const AlertSystem = ({ alerts }) => {
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ErrorIcon sx={{ color: '#ff4757' }} />;
      case 'medium':
        return <WarningIcon sx={{ color: '#ffa502' }} />;
      case 'low':
        return <InfoIcon sx={{ color: '#00d4ff' }} />;
      default:
        return <InfoIcon sx={{ color: '#00d4ff' }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#ff4757';
      case 'medium':
        return '#ffa502';
      case 'low':
        return '#00d4ff';
      default:
        return '#00d4ff';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #ff6b6b20, #ff6b6b10)',
          border: '1px solid #ff6b6b40',
          height: '100%',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  bgcolor: '#ff6b6b20',
                  borderRadius: '12px',
                  p: 1,
                  mr: 2,
                }}
              >
                <Badge badgeContent={alerts.length} color="error">
                  <NotificationsIcon sx={{ color: '#ff6b6b', fontSize: 28 }} />
                </Badge>
              </Box>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Live Alerts
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Real-time city notifications
                </Typography>
              </div>
            </Box>
          </Box>

          <Box sx={{ maxHeight: 450, overflowY: 'auto' }}>
            <AnimatePresence>
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: `${getSeverityColor(alert.severity)}10`,
                      border: `1px solid ${getSeverityColor(alert.severity)}40`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                        bgcolor: `${getSeverityColor(alert.severity)}20`,
                      },
                    }}
                  >
                    <Box sx={{ mt: 0.5 }}>
                      {getSeverityIcon(alert.severity)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            color: getSeverityColor(alert.severity),
                          }}
                        >
                          {alert.type}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {formatTime(alert.timestamp)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {alert.message}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1,
                            py: 0.5,
                            bgcolor: `${getSeverityColor(alert.severity)}20`,
                            color: getSeverityColor(alert.severity),
                            borderRadius: '8px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          {alert.severity}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlertSystem;
