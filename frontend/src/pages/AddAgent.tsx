import React, { useState } from 'react';
import api from '../services/api';
import { Box, TextField, Button, Typography } from '@mui/material';

interface AgentForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AddAgent: React.FC = () => {
  const [form, setForm] = useState<AgentForm>({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (): Promise<void> => {
    try {
      await api.post('/agents', form);
      setMessage('Agent added successfully');
      setForm({ name: '', email: '', phone: '', password: '' });
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response?.data?.message === 'string'
      ) {
        setMessage((err as any).response.data.message);
      } else {
        setMessage('Error adding agent');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>Add Agent</Typography>
      <TextField label="Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} />
      <TextField label="Email" name="email" fullWidth margin="normal" value={form.email} onChange={handleChange} />
      <TextField label="Phone" name="phone" fullWidth margin="normal" value={form.phone} onChange={handleChange} />
      <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={form.password} onChange={handleChange} />
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleAdd}>Add Agent</Button>
      {message && <Typography mt={2}>{message}</Typography>}
    </Box>
  );
};

export default AddAgent;
