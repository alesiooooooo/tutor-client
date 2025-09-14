'use server';

import { redirect } from 'next/navigation';

export async function signupAction(formData: FormData) {
  const data = Object.fromEntries(formData);

  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

  const response = await fetch(`${apiBaseUrl}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();

    let errorMessage = 'Registration failed';

    if (errorData.message) {
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join(', ');
      } else {
        errorMessage = errorData.message;
      }
    } else if (errorData.error) {
      errorMessage = errorData.error;
    }

    throw new Error(errorMessage);
  }

  const result = await response.json();
  console.log('Registration successful:', result);

  redirect('/auth/login?registered=true');
}
