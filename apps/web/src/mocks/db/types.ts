export interface UserRecord {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user';
  createdAt: string;
}

export interface AuthorRecord {
  id: number;
  fullName: string;
}

export interface BookRecord {
  id: number;
  title: string;
  year: number;
  description: string;
  isbn: string;
  cover: Blob;
}

export interface BookAuthorRecord {
  bookId: number;
  authorId: number;
}
