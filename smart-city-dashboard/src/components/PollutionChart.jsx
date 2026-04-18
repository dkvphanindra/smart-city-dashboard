import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { motion } from 'framer-motion';

const PollutionChart = ({ data }) => {
  const barData = data.map((item) => ({
    name: item.name,
    value: item.value,
    fill:
      item.status === 'High'
        ? '#ff4757'
        : item.status === 'Moderate'
        ? '#ffa502'
        : '#2ed573',
  }));

  const radarData = data.map((item) => ({
    subject: item.name,
    value: item.value,
    status: item.status,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #2ed57320, #2ed57310)',
          border: '1px solid #2ed57340',
          height: '100%',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#2ed57320',
                borderRadius: '12px',
                p: 1,
                mr: 2,
              }}
            >
              <Typography sx={{ fontSize: 24 }}>🌬️</Typography>
            </Box>
            <div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Air Quality Monitor
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Pollutant levels & environmental health
              </Typography>
            </div>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                Pollutant Levels
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="name" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2ed57340',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" fill="#2ed573" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                Quality Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" stroke="#ffffff80" />
                  <PolarRadiusAxis stroke="#ffffff80" />
                  <Radar
                    name="Pollutants"
                    dataKey="value"
                    stroke="#2ed573"
                    fill="#2ed573"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
              Status Overview
            </Typography>
            {data.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        item.status === 'High'
                          ? '#ff4757'
                          : item.status === 'Moderate'
                          ? '#ffa502'
                          : '#2ed573',
                      fontWeight: 700,
                    }}
                  >
                    {item.status}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(item.value / 200) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#ffffff20',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        item.status === 'High'
                          ? '#ff4757'
                          : item.status === 'Moderate'
                          ? '#ffa502'
                          : '#2ed573',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PollutionChart;
