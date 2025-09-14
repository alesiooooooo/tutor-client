import Link from 'next/link';
import { Container, Box, Typography, Button } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 600 }}>
          Lessons Booking Service
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Manage your tutoring sessions
        </Typography>

        <Link href="/dashboard" passHref legacyBehavior>
          <Button variant="contained" size="large">
            Go to Dashboard
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
