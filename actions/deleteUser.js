'use server';

import { prisma } from '@/lib/prisma';

export async function deleteUser(id) {
    try {
      await prisma.user.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      console.error('Delete Error:', error);
      return { error: 'Failed to delete user.' };
    }
  }