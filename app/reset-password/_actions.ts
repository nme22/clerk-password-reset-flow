'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

export const updatePasswordReqFlag = async (status: boolean | null) => {
  const { userId } = await auth();

  if (!userId) {
    return { message: 'No Logged In User' };
  }

  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        requirePassReset: status,
      },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' };
  }
};
