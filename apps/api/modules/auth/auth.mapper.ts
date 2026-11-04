import {
  LoginResponse as LoginResponseSchema,
  RegisterResponse as RegisterResponseSchema,
  UserRole as UserRoleSchema,
} from '@books/api-contract/schemas';

import type { users } from '../../generated/prisma/client.ts';
import { defineMapper } from '../../http/mapper.ts';

const LoginUserSchema = LoginResponseSchema.shape.data.shape.user;
const RegisterUserSchema = RegisterResponseSchema.shape.data.shape.user;

export const toLoginUserDto = defineMapper(LoginUserSchema, (user: users) => {
  const role = UserRoleSchema.parse(user.role);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role,
  };
});

export const toRegisterUserDto = defineMapper(
  RegisterUserSchema,
  (user: users) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    created_at: user.created_at.toISOString(),
  })
);
