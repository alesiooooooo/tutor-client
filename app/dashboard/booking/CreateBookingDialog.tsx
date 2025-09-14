'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { createBookingAction } from './actions';

interface CreateBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateBookingDialog({
  open,
  onClose,
  onSuccess,
}: CreateBookingDialogProps) {
  const [error, setError] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('60');
  const [selectedTutor, setSelectedTutor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Available tutors list
  const tutors = [
    { id: '1', name: 'Math teacher' },
    { id: '2', name: 'English teacher' },
    { id: '3', name: 'Physics teacher' },
  ];

  // Generate time slots with 30-minute intervals from 8:00 AM to 9:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;

        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }
        );
        slots.push({ value: time, label: displayTime });
      }
    }
    return slots;
  };

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' },
  ];

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  function handleInputChange() {
    if (error) {
      setError('');
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const tutorId = formData.get('tutorId');
    const date = formData.get('date');
    const startTime = formData.get('startTime');
    const duration = formData.get('duration');

    if (!tutorId || !date || !startTime || !duration) {
      setError('Please fill in all required fields');
      return;
    }

    const endTime = calculateEndTime(startTime as string, Number(duration));

    const localStartDateTime = new Date(`${date}T${startTime}`);
    const localEndDateTime = new Date(`${date}T${endTime}`);

    const utcDate = localStartDateTime.toISOString().split('T')[0];
    const utcStartTime = localStartDateTime
      .toISOString()
      .split('T')[1]
      .substring(0, 5);
    const utcEndTime = localEndDateTime
      .toISOString()
      .split('T')[1]
      .substring(0, 5);

    // Create new FormData with UTC time
    const bookingFormData = new FormData();
    bookingFormData.append('tutorId', tutorId as string);
    bookingFormData.append('date', utcDate);
    bookingFormData.append('startTime', utcStartTime);
    bookingFormData.append('endTime', utcEndTime);

    startTransition(async () => {
      const result = await createBookingAction(bookingFormData);

      if (!result.success) {
        setError(result.error || 'Failed to book lesson');
      } else {
        // Reset form
        setSelectedTutor('');
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setSelectedTime('');
        setSelectedDuration('60');
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  }

  const handleClose = () => {
    if (!isPending) {
      setError('');
      setSelectedTutor('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSelectedTime('');
      setSelectedDuration('60');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>Book a Lesson</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} id="booking-form">
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Select Tutor</InputLabel>
            <Select
              name="tutorId"
              label="Select Tutor *"
              value={selectedTutor}
              onChange={(e) => {
                setSelectedTutor(e.target.value);
                handleInputChange();
              }}
              disabled={isPending}
            >
              <MenuItem value="" disabled>
                Choose a teacher
              </MenuItem>
              {tutors.map((tutor) => (
                <MenuItem key={tutor.id} value={tutor.id}>
                  {tutor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="date"
            label="Date *"
            type="date"
            fullWidth
            required
            margin="normal"
            disabled={isPending}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              handleInputChange();
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Start Time</InputLabel>
              <Select
                name="startTime"
                label="Start Time *"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  handleInputChange();
                }}
                disabled={isPending}
              >
                {generateTimeSlots().map((slot) => (
                  <MenuItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Duration</InputLabel>
              <Select
                name="duration"
                label="Duration *"
                value={selectedDuration}
                onChange={(e) => {
                  setSelectedDuration(e.target.value);
                  handleInputChange();
                }}
                disabled={isPending}
              >
                {durationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {selectedTime && selectedDuration && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Lesson time:{' '}
                {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString(
                  'en-US',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }
                )}{' '}
                -{' '}
                {new Date(
                  `2000-01-01T${calculateEndTime(
                    selectedTime,
                    Number(selectedDuration)
                  )}`
                ).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}{' '}
                ({Intl.DateTimeFormat().resolvedOptions().timeZone}, UTC
                {new Date().getTimezoneOffset() > 0 ? '-' : '+'}
                {Math.abs(new Date().getTimezoneOffset() / 60)})
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                Note: Time will be automatically converted to UTC for server
                storage
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={isPending} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          form="booking-form"
          variant="contained"
          disabled={
            isPending || !selectedTutor || !selectedTime || !selectedDuration
          }
          startIcon={
            isPending ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isPending ? 'Booking...' : 'Book Lesson'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
