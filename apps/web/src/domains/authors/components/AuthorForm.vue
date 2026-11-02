<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import type { Author } from '@/api/generated/models';
import { FormError } from '@/shared/components';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { applyAuthorFormError } from '../lib/author-form-error';
import {
  type AuthorFormValues,
  authorValidationSchema,
} from '../model/author-form.schema';

interface Props {
  author?: Pick<Author, 'full_name'> | null;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  author: null,
  submitting: false,
});

const emit = defineEmits<{
  submit: [values: AuthorFormValues];
  'dirty-change': [dirty: boolean];
}>();

const formError = ref<string | null>(null);

function getInitialValues(): AuthorFormValues {
  return {
    full_name: props.author?.full_name ?? '',
  };
}

const { handleSubmit, meta, resetForm, setFieldError } = useForm<AuthorFormValues>({
  validationSchema: authorValidationSchema,
  initialValues: getInitialValues(),
});

const submit = handleSubmit((values) => {
  formError.value = null;
  emit('submit', values);
});

function reset() {
  formError.value = null;
  resetForm({ values: getInitialValues() });
}

function setSubmissionError(error: unknown) {
  formError.value = null;
  applyAuthorFormError(error, {
    setFieldError,
    setFormError: (message) => {
      formError.value = message;
    },
  });
}

watch(
  () => props.author?.full_name,
  () => reset(),
);

watch(
  () => meta.value.dirty,
  (dirty) => emit('dirty-change', dirty),
  { immediate: true },
);

defineExpose({
  reset,
  setSubmissionError,
  submit,
});
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <FormError v-if="formError" :message="formError" />

    <FormField v-slot="{ componentField }" name="full_name">
      <FormItem>
        <FormLabel>Полное имя</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            type="text"
            autocomplete="name"
            :disabled="submitting"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>
