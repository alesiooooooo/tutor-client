'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface CreateBookingResult {
  success: boolean;
  error?: string;
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

    // Validate required fields
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

    return { success: true };
  } catch (error) {
    console.error('Create booking error:', error);
    return {
      success: false,
      error: 'Failed to create booking. Please try again.',
    };
  }
}
