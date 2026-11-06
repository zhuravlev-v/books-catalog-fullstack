import type { DirectoryS3 } from './s3-directories.ts';

export interface UploadObjectInput {
  body: Uint8Array;
  contentType: string;
  directory: DirectoryS3;
}

export interface UploadedObject {
  key: string;
  etag: string | null;
}

export interface ObjectStorage {
  uploadObject(input: UploadObjectInput): Promise<UploadedObject>;
  deleteObject(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}
