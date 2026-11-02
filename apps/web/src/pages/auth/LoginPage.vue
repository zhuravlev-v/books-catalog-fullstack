<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { isApiError } from '@/api/client/api-error';
import {
  applyServerValidationErrors,
  type LoginFormValues,
  loginValidationSchema,
  useAuth,
} from '@/domains/auth';
import { getSafeRedirect } from '@/app/router';
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

const route = useRoute();
const router = useRouter();
const { login } = useAuth();
const formError = ref<string | null>(null);
const { handleSubmit, isSubmitting, setFieldError } = useForm<LoginFormValues>({
  validationSchema: loginValidationSchema,
});

const onSubmit = handleSubmit(async (values) => {
  formError.value = null;

  try {
    await login(values);
    await router.replace(getSafeRedirect(route.query.redirect));
  } catch (error) {
    const validationResult = applyServerValidationErrors(
      error,
      ['username', 'password'] as const,
      setFieldError,
    );

    if (validationResult.handled) {
      if (validationResult.hasFormError) {
        formError.value = 'Проверьте введённые данные и попробуйте ещё раз.';
      }

      return;
    }

    formError.value =
      isApiError(error) && error.status === 401
        ? 'Неверное имя пользователя или пароль'
        : 'Не удалось войти. Попробуйте ещё раз.';
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl">Вход</CardTitle>
      <CardDescription>Войдите, чтобы управлять каталогом</CardDescription>
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

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Пароль</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="password"
                autocomplete="current-password"
                :disabled="isSubmitting"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'Входим…' : 'Войти' }}
        </Button>
      </form>
    </CardContent>

    <CardFooter class="justify-center text-sm text-muted-foreground">
      Нет учётной записи?
      <RouterLink
        class="ml-1 font-medium text-foreground underline-offset-4 hover:underline"
        to="/register"
      >
        Зарегистрироваться
      </RouterLink>
    </CardFooter>
  </Card>
</template>
