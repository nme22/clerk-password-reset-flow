// Add to session claims requirePassReset in dashboard
// Go through onboarding guide and do the types portion, switch value to true so they go to this route, and then flip value once done.
'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { updatePasswordReqFlag } from './_actions';
import { useRouter } from 'next/navigation';
import { ClerkAPIError } from '@clerk/types';
import { isClerkAPIResponseError } from '@clerk/nextjs/errors';

export default function ResetPage() {
  const { isLoaded, user } = useUser();
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const [clerkErrors, setClerkErrors] = useState<ClerkAPIError[]>();

  if (!isLoaded || !user) {
    // Handle loading state
    return null;
  }

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });
      const res = await updatePasswordReqFlag(null);
      if (res?.message) {
        // Reloads the user's data from the Clerk API
        await user?.reload();
        router.push('/');
      }
      if (res?.error) {
        setError(res?.error);
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) setClerkErrors(err.errors);
    }
  };

  return (
    <form onSubmit={updatePassword}>
      <label htmlFor='currentpassword'>Current Password</label>
      <input
        id='currentpassword'
        type='password'
        value={currentPassword}
        onChange={(e) => {
          setCurrentPassword(e.target.value);
        }}
        placeholder='Enter your new password'
      />
      <label htmlFor='newpassword'>New Password</label>
      <input
        id='newpassword'
        type='password'
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
        placeholder='Enter your new password'
      />
      {error && <p className='text-red-600'>Error: {error}</p>}
      {clerkErrors && (
        <ul>
          {clerkErrors.map((el, index) => (
            <li key={index} className='text-red-600'>
              {el.longMessage}
            </li>
          ))}
        </ul>
      )}
      <button type='submit'>Confirm Password Change</button>
    </form>
  );
}
