'use client';

import {
  Typography,
  Box,
  Button,
} from '@mui/material';
import { logoutAction } from '../auth/logout/actions';

export default function DashboardClient() {
  return (
    <>
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
      </Box>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Welcome! You are successfully logged in.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <form action={logoutAction}>
          <Button type="submit" variant="outlined" color="secondary">
            Logout
          </Button>
        </form>
      </Box>
    </>
  );
}
