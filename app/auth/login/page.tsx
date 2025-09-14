'use client';

import { useState, useTransition, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { loginAction } from './actions';

function LoginForm() {
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registration successful! You can now sign in.');

      setTimeout(() => {
        window.history.replaceState({}, '', '/auth/login');
      }, 5000);
    }
  }, [searchParams]);

  function handleInputChange() {
    if (error) {
      setError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  }

  async function handleSubmit(formData: FormData) {
    setError('');

    startTransition(async () => {
      const result = await loginAction(formData);

      if (result && !result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Log In
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

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
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don&apos;t have an account? <a href="/auth/signup">Sign up</a>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth="sm">
          <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
