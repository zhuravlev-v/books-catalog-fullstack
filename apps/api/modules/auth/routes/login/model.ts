import type { LoginRequest } from '@books/api-contract/schemas';

import { prisma } from '../../../../prisma/prisma-client.ts';
import { invalidCredentialsError } from '../../shared/errors.ts';
import { verifyPassword } from '../../shared/password.ts';
import { createSession } from '../../shared/session.ts';

const login = async (input: LoginRequest) => {
  const user = await prisma.users.findUnique({
    where: { username: input.username },
  });

  if (user === null || !(await verifyPassword(user.password, input.password))) {
    throw invalidCredentialsError();
  }

  return prisma.$transaction((transaction) => createSession(transaction, user));
};

export default login;
