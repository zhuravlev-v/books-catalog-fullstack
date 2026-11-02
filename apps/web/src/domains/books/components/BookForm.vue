<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { useGetAuthors } from '@/api/generated/endpoints';
import type { Book } from '@/api/generated/models';
import { AppImage, FormError } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { applyBookFormError } from '../lib/book-form-error';
import {
  type BookFormValues,
  createBookValidationSchema,
} from '../model/book-form.schema';

interface Props {
  mode: 'create' | 'edit';
  book?: Book | null;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
  submitting: false,
});

const emit = defineEmits<{
  submit: [values: BookFormValues];
  'dirty-change': [dirty: boolean];
}>();

const formError = ref<string | null>(null);
const previewUrl = ref<string | null>(null);
const authorsQuery = useGetAuthors({ page: 1, 'per-page': 100 });
const authors = computed(() => authorsQuery.data.value?.data.data?.items ?? []);

function getInitialValues(): BookFormValues {
  return {
    title: props.book?.title ?? '',
    year: props.book?.year ?? new Date().getFullYear(),
    description: props.book?.description ?? '',
    isbn: props.book?.isbn ?? '',
    author_ids: props.book?.authors
      ?.map((author) => author.id)
      .filter((id): id is number => id !== undefined && Number.isSafeInteger(id) && id > 0) ?? [],
    cover: null,
  };
}

const {
  errors,
  handleSubmit,
  meta,
  resetForm,
  setFieldError,
  setFieldValue,
  values,
} = useForm<BookFormValues>({
  validationSchema: computed(() => createBookValidationSchema(props.mode)),
  initialValues: getInitialValues(),
});

const submit = handleSubmit((formValues) => {
  formError.value = null;
  emit('submit', formValues);
});

function releasePreview() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
}

function handleCoverChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  releasePreview();
  setFieldValue('cover', file);
  previewUrl.value = file ? URL.createObjectURL(file) : null;
}

function toggleAuthor(id: number, checked: boolean) {
  const nextIds = checked
    ? [...new Set([...values.author_ids, id])]
    : values.author_ids.filter((authorId) => authorId !== id);

  setFieldValue('author_ids', nextIds);
}

function reset() {
  releasePreview();
  formError.value = null;
  resetForm({ values: getInitialValues() });
}

function setSubmissionError(error: unknown) {
  formError.value = null;
  applyBookFormError(error, {
    setFieldError,
    setFormError: (message) => {
      formError.value = message;
    },
  });
}

watch(
  () => [props.book?.id, props.mode],
  () => reset(),
);

watch(
  () => meta.value.dirty,
  (dirty) => emit('dirty-change', dirty),
  { immediate: true },
);

onBeforeUnmount(releasePreview);

defineExpose({ reset, setSubmissionError, submit });
</script>

<template>
  <form class="space-y-5" @submit.prevent="submit">
    <FormError v-if="formError" :message="formError" />

    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>Название</FormLabel>
        <FormControl><Input v-bind="componentField" :disabled="submitting" /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="year">
      <FormItem>
        <FormLabel>Год издания</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="number" min="1" step="1" :disabled="submitting" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Описание</FormLabel>
        <FormControl><Textarea v-bind="componentField" :disabled="submitting" /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="isbn">
      <FormItem>
        <FormLabel>ISBN</FormLabel>
        <FormControl><Input v-bind="componentField" :disabled="submitting" /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <fieldset class="space-y-2" :disabled="submitting || authorsQuery.isPending.value">
      <legend class="text-sm font-medium">Авторы</legend>
      <p v-if="authorsQuery.isError.value" class="text-sm text-destructive">
        Не удалось загрузить список авторов.
      </p>
      <div v-else class="max-h-44 space-y-2 overflow-y-auto rounded-md border p-3">
        <label
          v-for="(author, index) in authors"
          :key="author.id ?? index"
          class="flex items-start gap-2 text-sm"
        >
          <input
            v-if="author.id !== undefined"
            type="checkbox"
            class="mt-0.5 size-4 accent-primary"
            :checked="values.author_ids.includes(author.id)"
            @change="toggleAuthor(author.id, ($event.target as HTMLInputElement).checked)"
          />
          <span class="break-words">{{ author.full_name?.trim() || 'Имя автора не указано' }}</span>
        </label>
      </div>
      <p v-if="errors.author_ids" class="text-sm text-destructive">{{ errors.author_ids }}</p>
    </fieldset>

    <div class="space-y-2">
      <label for="book-cover" class="text-sm font-medium">
        Обложка{{ mode === 'edit' ? ' (необязательно)' : '' }}
      </label>
      <Input
        id="book-cover"
        type="file"
        accept="image/*"
        :disabled="submitting"
        @change="handleCoverChange"
      />
      <p v-if="errors.cover" class="text-sm text-destructive">{{ errors.cover }}</p>
      <AppImage
        v-if="previewUrl || book?.cover_url"
        :src="previewUrl || book?.cover_url"
        alt="Предпросмотр обложки"
        size="md"
        class="aspect-[2/3] rounded-md border"
      />
      <Button
        v-if="previewUrl"
        type="button"
        variant="outline"
        size="sm"
        :disabled="submitting"
        @click="releasePreview(); setFieldValue('cover', null)"
      >
        Сбросить новую обложку
      </Button>
    </div>
  </form>
</template>
