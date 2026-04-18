import { Card, CardContent, Typography, Box, Chip, Avatar, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const EventsList = ({ events }) => {
  const getEventEmoji = (type) => {
    switch (type) {
      case 'Concert':
        return '🎵';
      case 'Sports':
        return '⚽';
      case 'Festival':
        return '🎊';
      case 'Conference':
        return '🎤';
      case 'Exhibition':
        return '🎨';
      default:
        return '📅';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #70a1ff20, #70a1ff10)',
          border: '1px solid #70a1ff40',
          height: '100%',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  bgcolor: '#70a1ff20',
                  borderRadius: '12px',
                  p: 1,
                  mr: 2,
                }}
              >
                <EventIcon sx={{ color: '#70a1ff', fontSize: 28 }} />
              </Box>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  City Events
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Ongoing & upcoming events
                </Typography>
              </div>
            </Box>
          </Box>

          <Box sx={{ maxHeight: 450, overflowY: 'auto' }}>
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#70a1ff10',
                    border: '1px solid #70a1ff40',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(5px)',
                      bgcolor: '#70a1ff20',
                      boxShadow: '0 4px 12px #70a1ff40',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#70a1ff',
                          width: 40,
                          height: 40,
                          fontSize: 20,
                        }}
                      >
                        {getEventEmoji(event.type)}
                      </Avatar>
                      <div>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {event.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {event.location.name}
                        </Typography>
                      </div>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {event.source && (
                        <Chip
                          label={event.source}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            bgcolor: event.source === 'Ticketmaster' ? '#ff6b6b20' :
                                     event.source === 'NewsAPI' ? '#4ecdc420' :
                                     '#70a1ff20',
                            color: event.source === 'Ticketmaster' ? '#ff6b6b' :
                                   event.source === 'NewsAPI' ? '#4ecdc4' :
                                   '#70a1ff',
                          }}
                        />
                      )}
                      <Chip
                        label={event.status}
                        color={event.status === 'Ongoing' || event.status === 'On Sale' ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      {event.url && (
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => window.open(event.url, '_blank')}>
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  {/* Event Date */}
                  {event.date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <EventIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                        {event.date}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {event.attendees.toLocaleString()} attendees
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {event.startTime}
                      </Typography>
                    </Box>
                    {event.ticketPrice && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>
                          🎫 {event.ticketPrice}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventsList;
