import { prisma } from '../../../../prisma/prisma-client.ts';
import { unauthorizedError } from '../../shared/errors.ts';

const getSessionUser = async (userId: string) => {
  const user = await prisma.users.findUnique({ where: { id: userId } });

  if (user === null || user.role !== 'user') {
    throw unauthorizedError();
  }

  return user;
};

export default getSessionUser;
