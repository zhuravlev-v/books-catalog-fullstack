export function parsePositiveIntegerPathParam(
  value: string | readonly string[] | undefined
): number | undefined {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isSafeInteger(parsedValue) ? parsedValue : undefined;
}
