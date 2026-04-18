import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AirIcon from '@mui/icons-material/Air';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PeopleIcon from '@mui/icons-material/People';
import RecyclingIcon from '@mui/icons-material/Recycling';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import EmergencyIcon from '@mui/icons-material/Emergency';
import WifiIcon from '@mui/icons-material/Wifi';

const KPICards = ({ data }) => {
  const kpiConfig = [
    {
      title: 'Population',
      value: data.totalPopulation,
      icon: PeopleIcon,
      color: '#00d4ff',
      trend: '+2.3%',
      trendUp: true,
    },
    {
      title: 'Active Vehicles',
      value: data.activeVehicles?.toLocaleString(),
      icon: DirectionsCarIcon,
      color: '#ff6b6b',
      trend: '+5.1%',
      trendUp: true,
    },
    {
      title: 'Air Quality Index',
      value: data.airQualityIndex,
      icon: AirIcon,
      color: data.airQualityIndex > 100 ? '#ff4757' : '#2ed573',
      trend: data.airQualityIndex > 100 ? '+12%' : '-8%',
      trendUp: data.airQualityIndex > 100,
    },
    {
      title: 'Energy Consumption',
      value: data.energyConsumption,
      icon: ElectricBoltIcon,
      color: '#ffa502',
      trend: '-3.2%',
      trendUp: false,
    },
    {
      title: 'Waste Collected',
      value: data.wasteCollected,
      icon: RecyclingIcon,
      color: '#7bed9f',
      trend: '+4.5%',
      trendUp: true,
    },
    {
      title: 'Public Transport',
      value: data.publicTransportUsage,
      icon: DirectionsBusIcon,
      color: '#70a1ff',
      trend: '+6.8%',
      trendUp: true,
    },
    {
      title: 'Emergency Response',
      value: data.emergencyResponse,
      icon: EmergencyIcon,
      color: '#ff6348',
      trend: '-1.2 min',
      trendUp: false,
    },
    {
      title: 'Network Coverage',
      value: data.networkCoverage,
      icon: WifiIcon,
      color: '#5352ed',
      trend: '+0.5%',
      trendUp: true,
    },
  ];

  return (
    <Grid container spacing={3}>
      {kpiConfig.map((kpi, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              sx={{
                background: `linear-gradient(135deg, ${kpi.color}20, ${kpi.color}10)`,
                border: `1px solid ${kpi.color}40`,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 10px 30px ${kpi.color}40`,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: `${kpi.color}20`,
                      borderRadius: '12px',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    <kpi.icon sx={{ color: kpi.color, fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    {kpi.title}
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: kpi.color,
                    mb: 1,
                  }}
                >
                  {kpi.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {kpi.trendUp ? (
                    <TrendingUpIcon sx={{ color: kpi.trendUp && kpi.color === '#ff4757' ? '#ff4757' : '#2ed573', mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: '#2ed573', mr: 0.5 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: kpi.trendUp && kpi.color === '#ff4757' ? '#ff4757' : '#2ed573',
                      fontWeight: 600,
                    }}
                  >
                    {kpi.trend}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                    vs last hour
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default KPICards;
