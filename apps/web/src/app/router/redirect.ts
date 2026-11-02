export function getSafeRedirect(redirect: unknown): string {
  if (
    typeof redirect !== 'string' ||
    redirect.length === 0 ||
    !redirect.startsWith('/') ||
    redirect.startsWith('//')
  ) {
    return '/';
  }

  try {
    const url = new URL(redirect, window.location.origin);

    if (url.origin !== window.location.origin) {
      return '/';
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return '/';
  }
}
