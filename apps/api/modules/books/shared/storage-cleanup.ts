import type { ObjectStorage } from '../../../infrastructure/storage/object-storage.ts';

export async function deleteObjectBestEffort(
  storage: ObjectStorage,
  key: string,
  operation: string
): Promise<void> {
  try {
    await storage.deleteObject(key);
  } catch (error) {
    console.error(`Failed to ${operation}`, { key, error });
  }
}
