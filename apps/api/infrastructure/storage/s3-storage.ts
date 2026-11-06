import { randomUUID } from 'node:crypto';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  type S3Client,
} from '@aws-sdk/client-s3';

import type {
  ObjectStorage,
  UploadedObject,
  UploadObjectInput,
} from './object-storage.ts';
import { s3Client, s3Config } from './s3-client.ts';

const CACHE_CONTROL = 'public, max-age=31536000, immutable';

type S3StorageConfig = typeof s3Config;

export class S3ObjectStorage implements ObjectStorage {
  constructor(
    private readonly client: S3Client,
    private readonly config: S3StorageConfig
  ) {}

  async uploadObject(input: UploadObjectInput): Promise<UploadedObject> {
    const directory = input.directory.replace(/^\/+|\/+$/g, '');

    if (directory.length === 0) {
      throw new Error('Object directory must not be empty');
    }

    const key = `${directory}/${randomUUID()}`;
    const result = await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: input.body,
        ContentType: input.contentType,
        CacheControl: CACHE_CONTROL,
      })
    );

    return {
      key,
      etag: result.ETag?.replace(/^"|"$/g, '') ?? null,
    };
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      })
    );
  }

  getPublicUrl(key: string): string {
    const encodedKey = key.split('/').map(encodeURIComponent).join('/');

    return `${this.config.publicBaseUrl}/${encodedKey}`;
  }
}

export const objectStorage: ObjectStorage = new S3ObjectStorage(
  s3Client,
  s3Config
);
