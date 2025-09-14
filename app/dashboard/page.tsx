import { Suspense } from 'react';
import {
  Container,
  Paper,
  Box,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import BookingListServer from './booking/BookingListServer';
import DashboardClient from './DashboardClient';
import CreateBookingModal from './booking/CreateBookingModal';
import { getTutorsAction } from './booking/actions';

async function BookingSection() {
  const tutorsResult = await getTutorsAction();

  return (
    <CreateBookingModal
      tutors={tutorsResult.success ? tutorsResult.tutors || [] : []}
      tutorsError={tutorsResult.success ? undefined : tutorsResult.error}
    />
  );
}

export default function DashboardPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <DashboardClient />

          <Box
            sx={{
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5">My Bookings</Typography>
            <Suspense
              fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={24} />
                </Box>
              }
            >
              <BookingSection />
            </Suspense>
          </Box>

          <Box>
            <Suspense
              fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              }
            >
              <BookingListServer />
            </Suspense>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
