import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().min(1, 'Введите имя пользователя'),
  password: z.string().min(1, 'Введите пароль'),
});

export const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Имя пользователя должно содержать не менее 3 символов')
    .max(30, 'Имя пользователя должно содержать не более 30 символов'),
  email: z.email('Введите корректный email').min(1, 'Введите email'),
  password: z
    .string()
    .min(8, 'Пароль должен содержать не менее 8 символов')
    .max(100, 'Пароль должен содержать не более 100 символов'),
});

export const loginValidationSchema = toTypedSchema(loginFormSchema);
export const registerValidationSchema = toTypedSchema(registerFormSchema);

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
