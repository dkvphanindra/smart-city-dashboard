import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Avatar,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { indiaStates } from '../data/indiaData';
import { motion } from 'framer-motion';

const StateSelector = ({ selectedState, onStateChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: '16px',
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.2)',
        }}
      >
        <LocationOnIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Select State / UT
          </Typography>
          <FormControl sx={{ minWidth: 250 }} size="small">
            <Select
              value={selectedState.id}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              onChange={(e) => {
                const state = indiaStates.find((s) => s.id === e.target.value);
                onStateChange(state);
              }}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '16px',
              }}
            >
              {indiaStates.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: 'primary.main',
                        fontSize: '12px',
                        fontWeight: 700,
                      }}
                    >
                      {state.id}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {state.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {state.capital} • Pop: {state.population}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`🏙️ ${selectedState.capital}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`👥 ${selectedState.population}`}
            size="small"
            color="secondary"
            variant="outlined"
          />
          <Chip
            label={`📍 ${selectedState.area}`}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </motion.div>
  );
};

export default StateSelector;
