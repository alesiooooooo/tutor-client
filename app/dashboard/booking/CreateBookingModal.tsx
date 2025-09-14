'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import CreateBookingForm from './CreateBookingForm';
import { type Tutor } from './actions';

interface CreateBookingModalProps {
  tutors: Tutor[];
  tutorsError?: string;
}

export default function CreateBookingModal({
  tutors,
  tutorsError,
}: CreateBookingModalProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        size="large"
      >
        Book a New Lesson
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Book a New Lesson
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{ color: 'grey.500' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <CreateBookingForm
            tutors={tutors}
            tutorsError={tutorsError}
            onSuccess={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
