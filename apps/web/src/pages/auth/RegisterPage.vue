<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { isApiError } from '@/api/client/api-error';
import {
  applyServerValidationErrors,
  type RegisterFormValues,
  registerValidationSchema,
  useAuth,
  useAuthStore,
} from '@/domains/auth';
import { FormError } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

const router = useRouter();
const authStore = useAuthStore();
const { register } = useAuth();
const formError = ref<string | null>(null);
const { handleSubmit, isSubmitting, setFieldError } = useForm<RegisterFormValues>({
  validationSchema: registerValidationSchema,
  initialValues: {
    username: '',
    email: '',
    password: '',
  },
});

const conflictMessages: Record<'username' | 'email', string> = {
  username: 'Пользователь с таким именем уже зарегистрирован',
  email: 'Пользователь с таким email уже зарегистрирован',
};

const onSubmit = handleSubmit(async (values) => {
  formError.value = null;

  try {
    await register(values);

    if (authStore.isAuthenticated) {
      await router.replace('/');
    }
  } catch (error) {
    const validationResult = applyServerValidationErrors(
      error,
      ['username', 'email', 'password'] as const,
      setFieldError,
    );

    if (validationResult.handled) {
      if (validationResult.hasFormError) {
        formError.value = 'Проверьте введённые данные и попробуйте ещё раз.';
      }

      return;
    }

    if (isApiError(error) && error.status === 409) {
      let hasFieldError = false;

      for (const field of ['username', 'email'] as const) {
        const fieldError = error.getFieldErrors(field)[0];

        if (fieldError) {
          setFieldError(field, fieldError.message ?? conflictMessages[field]);
          hasFieldError = true;
        }
      }

      if (!hasFieldError) {
        formError.value = 'Не удалось зарегистрироваться: имя пользователя или email уже заняты.';
      }

      return;
    }

    formError.value = 'Не удалось зарегистрироваться. Попробуйте ещё раз.';
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl">Регистрация</CardTitle>
      <CardDescription>Создайте учётную запись для управления каталогом.</CardDescription>
    </CardHeader>

    <CardContent>
      <form class="space-y-4" @submit="onSubmit">
        <FormError v-if="formError" :message="formError" />

        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel>Имя пользователя</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="text"
                autocomplete="username"
                :disabled="isSubmitting"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="email"
                autocomplete="email"
                :disabled="isSubmitting"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Пароль</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="password"
                autocomplete="new-password"
                :disabled="isSubmitting"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'Регистрируем…' : 'Зарегистрироваться' }}
        </Button>
      </form>
    </CardContent>

    <CardFooter class="justify-center text-sm text-muted-foreground">
      Уже есть учётная запись?
      <RouterLink
        class="ml-1 font-medium text-foreground underline-offset-4 hover:underline"
        to="/login"
      >
        Войти
      </RouterLink>
    </CardFooter>
  </Card>
</template>
