'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { AccessTime, CalendarToday, Person, Delete } from '@mui/icons-material';
import { deleteBookingAction, type Booking } from './actions';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const utcDate = new Date(dateString + 'T00:00:00Z');
    return utcDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string, timeString: string) => {
    const utcDateTime = new Date(`${dateString}T${timeString}Z`);
    return utcDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isUpcoming = (date: string, startTime: string) => {
    const bookingDateTime = new Date(`${date}T${startTime}Z`);
    return bookingDateTime > new Date();
  };

  const isOngoing = (date: string, startTime: string, endTime: string) => {
    const now = new Date();
    const startDateTime = new Date(`${date}T${startTime}Z`);
    const endDateTime = new Date(`${date}T${endTime}Z`);
    return startDateTime <= now && now <= endDateTime;
  };

  const getTimezoneInfo = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = new Date().getTimezoneOffset();
    const offsetHours = Math.abs(offset / 60);
    const offsetSign = offset > 0 ? '-' : '+';
    return `${timezone}, UTC${offsetSign}${offsetHours}`;
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBookingAction(booking.id);
      if (result.success) {
        setDeleteDialogOpen(false);
      } else {
        alert(result.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Delete booking error:', error);
      alert('Failed to delete booking');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const canDelete = isUpcoming(booking.date, booking.startTime) || isOngoing(booking.date, booking.startTime, booking.endTime);

  return (
    <>
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 400,
          flex: '1 1 300px',
          border: isOngoing(booking.date, booking.startTime, booking.endTime)
            ? '3px solid #4caf50'
            : isUpcoming(booking.date, booking.startTime)
            ? '2px solid #1976d2'
            : '1px solid #e0e0e0'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3">
              Lesson #{booking.id}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={
                  isOngoing(booking.date, booking.startTime, booking.endTime)
                    ? 'In Progress'
                    : isUpcoming(booking.date, booking.startTime)
                    ? 'Upcoming'
                    : 'Past'
                }
                color={
                  isOngoing(booking.date, booking.startTime, booking.endTime)
                    ? 'success'
                    : isUpcoming(booking.date, booking.startTime)
                    ? 'primary'
                    : 'default'
                }
                size="small"
              />
              {canDelete && (
                <IconButton
                  onClick={handleDeleteClick}
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Person sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {booking.tutor.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(booking.date)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {formatTime(booking.date, booking.startTime)} - {formatTime(booking.date, booking.endTime)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                ({getTimezoneInfo()})
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this booking?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Lesson #{booking.id} with {booking.tutor.name} on {formatDate(booking.date)} at{' '}
            {formatTime(booking.date, booking.startTime)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : undefined}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
