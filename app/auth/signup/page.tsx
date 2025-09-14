'use client';

import { useState, useTransition } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { signupAction } from './actions';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleInputChange() {
    if (error) {
      setError('');
    }
  }

  async function handleSubmit(formData: FormData) {
    setError('');

    startTransition(async () => {
      const result = await signupAction(formData);

      if (result && !result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" action={handleSubmit}>
            <TextField
              name="email"
              type="email"
              label="Email"
              fullWidth
              required
              margin="normal"
              disabled={isPending}
              onChange={handleInputChange}
            />

            <TextField
              name="password"
              type="password"
              label="Password"
              fullWidth
              required
              margin="normal"
              helperText="Password must be at least 6 characters long"
              disabled={isPending}
              onChange={handleInputChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isPending ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already have an account? <a href="/auth/login">Sign in</a>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
