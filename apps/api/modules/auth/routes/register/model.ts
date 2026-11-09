import { Prisma } from '../../../../generated/prisma/client.ts';
import type { RegisterRequest } from '@books/api-contract/schemas';
import { prisma } from '../../../../prisma/prisma-client.ts';
import { HttpError } from '../../../../http/errors.ts';
import { hashPassword } from '../../shared/password.ts';
import { createSession } from '../../shared/session.ts';

const registerUser = async (input: RegisterRequest) => {
  const passwordHash = await hashPassword(input.password);

  try {
    return await prisma.$transaction(async (transaction) => {
      const user = await transaction.users.create({
        data: {
          username: input.username,
          email: input.email.toLowerCase(),
          password: passwordHash,
          role: 'user',
        },
      });

      return createSession(transaction, user);
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new HttpError(409, [
        {
          message: 'Пользователь с таким именем или почтой уже зарегистрирован',
        },
      ]);
    }

    throw error;
  }
};

export default registerUser;
