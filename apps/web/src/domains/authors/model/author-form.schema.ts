import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

export const authorFormSchema = z.object({
  full_name: z.string().trim().min(1, 'Введите полное имя автора'),
});

export const authorValidationSchema = toTypedSchema(authorFormSchema);

export type AuthorFormValues = z.infer<typeof authorFormSchema>;
