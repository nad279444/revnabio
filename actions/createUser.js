'use server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { rolePermissions } from '@/lib/permissions';

const FormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'USER'], 'Select a role'),
});

export async function createUser(formData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
  };

  const validation = FormSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.format() };
  }

  try {
    const permissions = rolePermissions[validation.data.role] || [];

    await prisma.user.create({
      data: { ...validation.data, permissions },
    });

    revalidatePath('/'); // ✅ This invalidates the cache for the users page

    return { success: true };
  } catch (error) {
    return { error: 'Failed to create user.' };
  }
}
