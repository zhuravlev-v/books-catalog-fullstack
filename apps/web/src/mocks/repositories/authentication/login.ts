import { mockDatabase, type MockDatabase } from '@/mocks/db/database';
import type { UserRecord } from '@/mocks/db/types';

export interface UsersRepository {
  findByUsername(username: string): Promise<UserRecord | undefined>;
}

export class DexieUsersRepository implements UsersRepository {
  constructor(private readonly database: MockDatabase = mockDatabase) {}

  findByUsername(username: string): Promise<UserRecord | undefined> {
    return this.database.users.where('username').equals(username).first();
  }
}

export const usersRepository = new DexieUsersRepository();
