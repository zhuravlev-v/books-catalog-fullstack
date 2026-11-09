import { hash, verify, argon2id } from 'argon2';

const passwordHashOptions = {
  type: argon2id,
  memoryCost: 65_536,
  timeCost: 3,
  parallelism: 1,
} as const;

export const hashPassword = (password: string) =>
  hash(password, passwordHashOptions);

export const verifyPassword = async (
  passwordHash: string,
  password: string
) => {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
};
