'use server';

import { prisma } from '@/lib/prisma';

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log(users)
    return users
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}
