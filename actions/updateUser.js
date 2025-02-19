
'use server';
import { prisma } from '@/lib/prisma';


// Update User
export async function updateUser({ id, name, email, role, permissions }) {
  try {
    await prisma.user.update({
      where: { id },
      data: { name, email, role, permissions },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user.');
  }
}




