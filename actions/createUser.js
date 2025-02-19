'use server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { rolePermissions } from '@/lib/permissions';
import { revalidatePath } from "next/cache";


// Validation Schema
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

  // Validate using Zod
  const validation = FormSchema.safeParse(data);
  if (!validation.success) {
    console.error('Validation Failed:', validation.error.format());
    return { error: validation.error.format() };
  }

  try {
    // Get Permissions based on Role
    const permissions = rolePermissions[validation.data.role] || [];

    // Create User in Database with Permissions
    await prisma.user.create({
      data: {
        ...validation.data,
        permissions,
      },
    });
    revalidatePath('/')
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Failed to create user.' };
  }
}
