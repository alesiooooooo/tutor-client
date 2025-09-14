import { Box, Paper, Typography } from '@mui/material';
import { getBookingsAction, type Booking } from './actions';
import BookingCard from './BookingCard';

export default async function BookingListServer() {
  const result = await getBookingsAction();

  if (!result.success) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', mt: 2, bgcolor: 'error.light' }}>
        <Typography variant="h6" color="error">
          Failed to load bookings
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {result.error}
        </Typography>
      </Paper>
    );
  }

  const bookings = result.bookings || [];

  if (bookings.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
        <Typography variant="h6" color="text.secondary">
          No bookings found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          You haven&apos;t booked any lessons yet. Click &quot;Book a
          Lesson&quot; to get started!
        </Typography>
      </Paper>
    );
  }

  const sortBookings = (bookings: Booking[]) => {
    const now = new Date();

    const ongoingBookings = bookings.filter((booking) => {
      const startDateTime = new Date(`${booking.date}T${booking.startTime}Z`);
      const endDateTime = new Date(`${booking.date}T${booking.endTime}Z`);
      return startDateTime <= now && now <= endDateTime;
    });

    const upcomingBookings = bookings.filter((booking) => {
      const bookingDateTime = new Date(`${booking.date}T${booking.startTime}Z`);
      return bookingDateTime > now;
    });

    const pastBookings = bookings.filter((booking) => {
      const endDateTime = new Date(`${booking.date}T${booking.endTime}Z`);
      return endDateTime < now;
    });

    const sortedOngoing = ongoingBookings.sort((a, b) => {
      const endTimeA = new Date(`${a.date}T${a.endTime}Z`);
      const endTimeB = new Date(`${b.date}T${b.endTime}Z`);
      return endTimeA.getTime() - endTimeB.getTime();
    });

    const sortedUpcoming = upcomingBookings.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.startTime}Z`);
      const dateTimeB = new Date(`${b.date}T${b.startTime}Z`);
      return dateTimeA.getTime() - dateTimeB.getTime();
    });

    const sortedPast = pastBookings.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.startTime}Z`);
      const dateTimeB = new Date(`${b.date}T${b.startTime}Z`);
      return dateTimeB.getTime() - dateTimeA.getTime();
    });

    return [...sortedOngoing, ...sortedUpcoming, ...sortedPast];
  };

  const sortedBookings = sortBookings(bookings);

  return (
    <Box sx={{ mt: 3 }}>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {sortedBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </Box>
    </Box>
  );
}
