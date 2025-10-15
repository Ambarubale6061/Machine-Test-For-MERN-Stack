import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import api from '../services/api';
import { Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface Agent {
  _id: string;
  name: string;
}

interface Task {
  firstName: string;
  phone: string;
  notes: string;
  assignedTo?: Agent;
}

const UploadCSV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage('Only CSV, XLS, XLSX files are allowed');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUpload = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post<{ message: string }>('/tasks/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setFile(null);
      fetchTasks();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response?.data?.message === 'string'
      ) {
        setMessage((err as any).response.data.message);
      } else {
        setMessage('Upload failed');
      }
    }
  };

  const fetchTasks = async (): Promise<void> => {
    try {
      const res = await api.get<Task[]>('/tasks');
      setTasks(res.data);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>Upload CSV/XLS/XLSX</Typography>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".csv,.xls,.xlsx" onChange={handleFileChange} />
        <Button type="submit" variant="contained" sx={{ ml: 2 }}>Upload</Button>
      </form>
      {message && <Typography mt={2}>{message}</Typography>}

      {tasks.length > 0 && (
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Assigned Agent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, idx) => (
              <TableRow key={idx}>
                <TableCell>{task.firstName}</TableCell>
                <TableCell>{task.phone}</TableCell>
                <TableCell>{task.notes}</TableCell>
                <TableCell>{task.assignedTo?.name || 'Not assigned'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default UploadCSV;
