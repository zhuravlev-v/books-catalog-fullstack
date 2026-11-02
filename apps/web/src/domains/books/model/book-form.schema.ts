import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

export const bookFormSchema = z.object({
  title: z.string().trim().min(1, 'Введите название книги'),
  year: z.coerce
    .number({ error: 'Укажите год издания' })
    .int('Год должен быть целым числом')
    .positive('Год должен быть положительным числом'),
  description: z.string(),
  isbn: z.string(),
  author_ids: z.array(z.number().int().positive()).min(1, 'Выберите хотя бы одного автора'),
  cover: z.instanceof(File).nullable(),
});

export function createBookValidationSchema(mode: 'create' | 'edit') {
  return toTypedSchema(
    bookFormSchema.superRefine((values, context) => {
      if (mode === 'create' && values.cover === null) {
        context.addIssue({
          code: 'custom',
          path: ['cover'],
          message: 'Выберите файл обложки',
        });
      }
    }),
  );
}

export type BookFormValues = z.infer<typeof bookFormSchema>;
