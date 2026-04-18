import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const TrafficChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #ff6b6b20, #ff6b6b10)',
          border: '1px solid #ff6b6b40',
          height: '100%',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#ff6b6b20',
                borderRadius: '12px',
                p: 1,
                mr: 2,
              }}
            >
              <Typography sx={{ fontSize: 24 }}>🚗</Typography>
            </Box>
            <div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Traffic Flow Analysis
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Real-time vehicle movement & congestion
              </Typography>
            </div>
          </Box>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffa502" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffa502" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="time" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f3a',
                  border: '1px solid #ff6b6b40',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="vehicles"
                stroke="#ff6b6b"
                fillOpacity={1}
                fill="url(#colorVehicles)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="congestion"
                stroke="#ffa502"
                fillOpacity={1}
                fill="url(#colorCongestion)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 700 }}>
                {data[data.length - 1]?.vehicles.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Active Vehicles
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffa502', fontWeight: 700 }}>
                {data[data.length - 1]?.congestion}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Congestion Level
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#2ed573', fontWeight: 700 }}>
                {data[data.length - 1]?.avgSpeed} km/h
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Avg Speed
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrafficChart;
