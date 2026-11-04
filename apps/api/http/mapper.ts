import type { ZodType, output } from 'zod';

export function defineMapper<Schema extends ZodType, Arguments extends unknown[]>(
  schema: Schema,
  map: (...args: Arguments) => output<Schema>,
): (...args: Arguments) => output<Schema> {
  return (...args) => schema.parse(map(...args));
}
