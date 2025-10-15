import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button variant="contained" onClick={() => navigate('/add-agent')}>Add Agent</Button>
        <Button variant="contained" onClick={() => navigate('/upload')}>Upload CSV</Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
