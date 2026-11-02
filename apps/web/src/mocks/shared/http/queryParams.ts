export function parsePositiveIntegerQueryParam(value: string | null): number | undefined {
  if (value === null || value.trim() === '') {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : undefined;
}
