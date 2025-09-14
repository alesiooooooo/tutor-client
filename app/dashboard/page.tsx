'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { logoutAction } from '../auth/logout/actions';
import CreateBookingDialog from './booking/CreateBookingDialog';

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleCreateBooking = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleBookingSuccess = () => {
    setSuccessMessage('Lesson booked successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateBooking}
              sx={{ borderRadius: 2 }}
            >
              Book a Lesson
            </Button>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          <Typography variant="body1" sx={{ mb: 3 }}>
            Welcome! You are successfully logged in.
          </Typography>

          <form action={logoutAction}>
            <Button type="submit" variant="outlined" color="secondary">
              Logout
            </Button>
          </form>
        </Paper>
      </Box>

      <CreateBookingDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleBookingSuccess}
      />
    </Container>
  );
}
