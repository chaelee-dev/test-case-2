import bcrypt from 'bcrypt';

import { getEnv } from '../config/env.js';
import { ConflictError, ValidationError } from '../errors/index.js';
import * as userRepo from '../repos/userRepo.js';
import type { AuthUser } from '../repos/userRepo.js';
import { sign } from './jwtService.js';

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
