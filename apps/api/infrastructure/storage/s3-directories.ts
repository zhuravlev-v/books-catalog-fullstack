export const S3_DIRECTORIES = {
  BOOK_COVERS: '/book-covers',
  USER_AVATARS: '/avatars',
  AUTHOR_PHOTOS: '/author-photos',
} as const;

export type DirectoryS3 = (typeof S3_DIRECTORIES)[keyof typeof S3_DIRECTORIES];
