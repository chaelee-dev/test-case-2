import type { User } from '@prisma/client';

import { getPrisma } from '../config/prisma.js';

export type AuthUser = Omit<User, 'passwordHash' | 'createdAt' | 'updatedAt'>;

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    image: user.image,
  };
}

export async function findByUsername(username: string): Promise<User | null> {
  return getPrisma().user.findUnique({ where: { username } });
}

export async function findByEmail(email: string): Promise<User | null> {
  return getPrisma().user.findUnique({ where: { email } });
}

export async function findById(id: number): Promise<User | null> {
  return getPrisma().user.findUnique({ where: { id } });
}

export async function create(input: {
  username: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  return getPrisma().user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash: input.passwordHash,
      bio: '',
      image: null,
    },
  });
}

export async function update(
  id: number,
  patch: {
    username?: string;
    email?: string;
    passwordHash?: string;
    bio?: string;
    image?: string | null;
  },
): Promise<User> {
  return getPrisma().user.update({ where: { id }, data: patch });
}
