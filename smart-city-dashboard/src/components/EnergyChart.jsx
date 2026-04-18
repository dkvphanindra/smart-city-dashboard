import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import { motion } from 'framer-motion';

const EnergyChart = ({ data }) => {
  const COLORS = ['#ffa502', '#00d4ff', '#7bed9f', '#ff6b6b'];

  const lineData = data.map((item, index) => ({
    time: `${index * 2}:00`,
    Solar: Math.floor(Math.random() * 500) + 300,
    Wind: Math.floor(Math.random() * 400) + 200,
    Grid: Math.floor(Math.random() * 600) + 400,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, #ffa50220, #ffa50210)',
          border: '1px solid #ffa50240',
          height: '100%',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#ffa50220',
                borderRadius: '12px',
                p: 1,
                mr: 2,
              }}
            >
              <Typography sx={{ fontSize: 24 }}>⚡</Typography>
            </Box>
            <div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Energy Consumption
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Power distribution & renewable sources
              </Typography>
            </div>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                Energy Sources
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #ffa50240',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
                Consumption Trend
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="time" stroke="#ffffff80" />
                  <YAxis stroke="#ffffff80" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #ffa50240',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Solar"
                    stroke="#ffa502"
                    strokeWidth={3}
                    dot={{ fill: '#ffa502' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Wind"
                    stroke="#00d4ff"
                    strokeWidth={3}
                    dot={{ fill: '#00d4ff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Grid"
                    stroke="#7bed9f"
                    strokeWidth={3}
                    dot={{ fill: '#7bed9f' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  bgcolor: `${COLORS[index]}20`,
                  borderRadius: '12px',
                  border: `1px solid ${COLORS[index]}40`,
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  {item.name}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: COLORS[index], fontWeight: 700 }}
                >
                  {item.consumption} kWh
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.percentage}% of total
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnergyChart;
