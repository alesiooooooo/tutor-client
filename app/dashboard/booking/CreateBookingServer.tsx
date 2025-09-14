import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { getTutorsAction } from './actions';
import CreateBookingForm from './CreateBookingForm';

function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  );
}

async function BookingFormWithData() {
  // Загружаем преподавателей на сервере
  const tutorsResult = await getTutorsAction();

  return (
    <CreateBookingForm
      tutors={tutorsResult.success ? tutorsResult.tutors || [] : []}
      tutorsError={tutorsResult.success ? undefined : tutorsResult.error}
    />
  );
}

export default function CreateBookingServer() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingFormWithData />
    </Suspense>
  );
}
