
'use server';
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache';;


// Update User
export async function updateUser({ id, name, email, role, permissions }) {
  try {
    await prisma.user.update({
      where: { id },
      data: { name, email, role, permissions },
    });
    await revalidatePath('/')
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user.');
  }
}




