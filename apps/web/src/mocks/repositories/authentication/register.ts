import { mockDatabase, type MockDatabase } from '@/mocks/db/database';
import type { UserRecord } from '@/mocks/db/types';
import type { RegisterInput } from '@/mocks/http/authentication/register';

export type RegistrationConflictField = 'username' | 'email';

export type CreateUserResult =
  | { user: UserRecord; conflicts?: never }
  | { user?: never; conflicts: RegistrationConflictField[] };

export interface RegisterUsersRepository {
  create(input: RegisterInput): Promise<CreateUserResult>;
}

export class DexieRegisterUsersRepository implements RegisterUsersRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  create(input: RegisterInput): Promise<CreateUserResult> {
    return this.database.transaction('rw', this.database.users, async () => {
      const [userWithUsername, userWithEmail] = await Promise.all([
        this.database.users.where('username').equals(input.username).first(),
        this.database.users.where('email').equals(input.email).first(),
      ]);
      const conflicts: RegistrationConflictField[] = [];

      if (userWithUsername !== undefined) {
        conflicts.push('username');
      }

      if (userWithEmail !== undefined) {
        conflicts.push('email');
      }

      if (conflicts.length > 0) {
        return { conflicts };
      }

      const user: UserRecord = {
        id: crypto.randomUUID(),
        username: input.username,
        email: input.email,
        password: input.password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      await this.database.users.add(user);

      return { user };
    });
  }
}

export const registerUsersRepository = new DexieRegisterUsersRepository();
