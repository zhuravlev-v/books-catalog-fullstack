const coverUrls = new Map<number, string>();

export function getBookCoverUrl(bookId: number, cover: Blob): string {
  const existingUrl = coverUrls.get(bookId);

  if (existingUrl !== undefined) {
    return existingUrl;
  }

  const url = URL.createObjectURL(cover);
  coverUrls.set(bookId, url);

  return url;
}

export function revokeBookCoverUrl(bookId: number): void {
  const url = coverUrls.get(bookId);

  if (url !== undefined) {
    URL.revokeObjectURL(url);
    coverUrls.delete(bookId);
  }
}

export function revokeAllBookCoverUrls(): void {
  for (const url of coverUrls.values()) {
    URL.revokeObjectURL(url);
  }

  coverUrls.clear();
}
