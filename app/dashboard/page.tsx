import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { logoutAction } from '../auth/logout/actions';

export default function DashboardPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Welcome! You are successfully logged in.
          </Typography>

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
            >
              Logout
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
