import bcrypt from 'bcrypt';

import { getEnv } from '../config/env.js';
import { ConflictError, NotFoundError, ValidationError } from '../errors/index.js';
import * as followRepo from '../repos/followRepo.js';
import * as userRepo from '../repos/userRepo.js';
import type { AuthUser } from '../repos/userRepo.js';
import { sign } from './jwtService.js';

export interface ProfileResponse {
  username: string;
  bio: string;
  image: string | null;
  following: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;

const DUMMY_HASH = '$2b$12$dummy_hash_for_timing_oracle_avoidance_in_login_failures..';

export interface AuthUserResponse {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string | null;
}

function toResponse(user: AuthUser, token: string): AuthUserResponse {
  return {
    email: user.email,
    token,
    username: user.username,
    bio: user.bio,
    image: user.image,
  };
}

export async function register(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthUserResponse> {
  if (!input.username || input.username.trim().length === 0) {
    throw new ValidationError('username', "can't be empty");
  }
  if (!input.email || !EMAIL_RE.test(input.email)) {
    throw new ValidationError('email', 'is invalid');
  }
  if (!input.password || input.password.length < PASSWORD_MIN) {
    throw new ValidationError('password', `is too short (minimum is ${PASSWORD_MIN} characters)`);
  }

  if (await userRepo.findByUsername(input.username)) {
    throw new ConflictError('username', 'has already been taken');
  }
  if (await userRepo.findByEmail(input.email)) {
    throw new ConflictError('email', 'has already been taken');
  }

  const env = getEnv();
  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_COST);

  const user = await userRepo.create({
    username: input.username,
    email: input.email,
    passwordHash,
  });

  const token = sign(user.id);
  return toResponse(userRepo.toAuthUser(user), token);
}

export async function getProfile(
  username: string,
  viewerId: number | null,
): Promise<ProfileResponse> {
  const target = await userRepo.findByUsername(username);
  if (!target) throw new NotFoundError('profile not found');
  const following = viewerId === null ? false : await followRepo.exists(viewerId, target.id);
  return { username: target.username, bio: target.bio, image: target.image, following };
}

export async function follow(viewerId: number, targetUsername: string): Promise<ProfileResponse> {
  const target = await userRepo.findByUsername(targetUsername);
  if (!target) throw new NotFoundError('profile not found');
  if (target.id === viewerId) {
    throw new ValidationError('body', 'cannot follow yourself');
  }
  await followRepo.create(viewerId, target.id);
  return { username: target.username, bio: target.bio, image: target.image, following: true };
}

export async function unfollow(viewerId: number, targetUsername: string): Promise<ProfileResponse> {
  const target = await userRepo.findByUsername(targetUsername);
  if (!target) throw new NotFoundError('profile not found');
  await followRepo.remove(viewerId, target.id);
  return { username: target.username, bio: target.bio, image: target.image, following: false };
}

export async function getCurrent(userId: number): Promise<AuthUserResponse> {
  const user = await userRepo.findById(userId);
  if (!user) throw new ValidationError('body', 'user not found');
  const token = sign(user.id);
  return toResponse(userRepo.toAuthUser(user), token);
}

export async function updateCurrent(
  userId: number,
  patch: {
    username?: string;
    email?: string;
    password?: string;
    bio?: string;
    image?: string | null;
  },
): Promise<AuthUserResponse> {
  const existing = await userRepo.findById(userId);
  if (!existing) throw new ValidationError('body', 'user not found');

  const data: Parameters<typeof userRepo.update>[1] = {};

  if (patch.username !== undefined && patch.username !== existing.username) {
    if (!patch.username || patch.username.trim().length === 0) {
      throw new ValidationError('username', "can't be empty");
    }
    if (await userRepo.findByUsername(patch.username)) {
      throw new ConflictError('username', 'has already been taken');
    }
    data.username = patch.username;
  }

  if (patch.email !== undefined && patch.email !== existing.email) {
    if (!EMAIL_RE.test(patch.email)) {
      throw new ValidationError('email', 'is invalid');
    }
    if (await userRepo.findByEmail(patch.email)) {
      throw new ConflictError('email', 'has already been taken');
    }
    data.email = patch.email;
  }

  if (patch.password !== undefined && patch.password.length > 0) {
    if (patch.password.length < PASSWORD_MIN) {
      throw new ValidationError('password', `is too short (minimum is ${PASSWORD_MIN} characters)`);
    }
    const env = getEnv();
    data.passwordHash = await bcrypt.hash(patch.password, env.BCRYPT_COST);
  }

  if (patch.bio !== undefined) data.bio = patch.bio;
  if (patch.image !== undefined) data.image = patch.image;

  const updated = Object.keys(data).length > 0 ? await userRepo.update(userId, data) : existing;
  const token = sign(updated.id);
  return toResponse(userRepo.toAuthUser(updated), token);
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthUserResponse> {
  if (!input.email || !EMAIL_RE.test(input.email)) {
    throw new ValidationError('email or password', 'is invalid');
  }
  if (!input.password) {
    throw new ValidationError('email or password', 'is invalid');
  }

  const user = await userRepo.findByEmail(input.email);

  // timing oracle 회피 — 미가입 email에도 dummy hash로 compare 실행
  const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
  const ok = await bcrypt.compare(input.password, hashToCompare);

  if (!user || !ok) {
    throw new ValidationError('email or password', 'is invalid');
  }

  const token = sign(user.id);
  return toResponse(userRepo.toAuthUser(user), token);
}
