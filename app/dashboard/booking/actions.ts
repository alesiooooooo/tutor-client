'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface CreateBookingResult {
  success: boolean;
  error?: string;
}

export interface Booking {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  user: {
    id: number;
    email: string;
  };
  tutor: {
    id: number;
    name: string;
  };
}

export interface Tutor {
  id: number;
  name: string;
}

export interface GetTutorsResult {
  success: boolean;
  tutors?: Tutor[];
  error?: string;
}

export interface GetBookingsResult {
  success: boolean;
  bookings?: Booking[];
  error?: string;
}

export async function getBookingsAction(): Promise<GetBookingsResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${apiBaseUrl}/booking`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Server error: ${response.status}`,
      };
    }

    const bookings = await response.json();
    return {
      success: true,
      bookings: bookings,
    };
  } catch (error) {
    console.error('Get bookings error:', error);
    return {
      success: false,
      error: 'Failed to load bookings. Please try again.',
    };
  }
}

export async function getTutorsAction(): Promise<GetTutorsResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${apiBaseUrl}/tutor`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const bookingsResult = await getBookingsAction();

      if (bookingsResult.success && bookingsResult.bookings) {
        const tutorMap = new Map<number, Tutor>();

        if (Array.isArray(bookingsResult.bookings)) {
          bookingsResult.bookings.forEach((booking: Booking) => {
            if (booking.tutor && booking.tutor.id && booking.tutor.name) {
              tutorMap.set(booking.tutor.id, {
                id: booking.tutor.id,
                name: booking.tutor.name,
              });
            }
          });
        }

        const tutorsFromBookings = Array.from(tutorMap.values());

        if (tutorsFromBookings.length > 0) {
          return {
            success: true,
            tutors: tutorsFromBookings,
          };
        }
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Server error: ${response.status}`,
      };
    }

    const tutors = await response.json();
    return {
      success: true,
      tutors: Array.isArray(tutors) ? tutors : [tutors],
    };
  } catch (error) {
    console.error('Get tutors error:', error);
    return {
      success: false,
      error: 'Failed to load tutors. Please try again.',
    };
  }
}

export async function createBookingAction(
  formData: FormData
): Promise<CreateBookingResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  try {
    const tutorId = formData.get('tutorId');
    const date = formData.get('date');
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');

    if (!tutorId || !date || !startTime || !endTime) {
      return {
        success: false,
        error: 'Please fill in all required fields',
      };
    }

    const bookingData = {
      tutorId: Number(tutorId),
      date: date as string,
      startTime: startTime as string,
      endTime: endTime as string,
    };

    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${apiBaseUrl}/booking`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Server error: ${response.status}`,
      };
    }

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Create booking error:', error);
    return {
      success: false,
      error: 'Failed to create booking. Please try again.',
    };
  }
}

export interface DeleteBookingResult {
  success: boolean;
  error?: string;
}

export async function deleteBookingAction(
  bookingId: number
): Promise<DeleteBookingResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${apiBaseUrl}/booking/${bookingId}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Server error: ${response.status}`,
      };
    }

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Delete booking error:', error);
    return {
      success: false,
      error: 'Failed to delete booking. Please try again.',
    };
  }
}
