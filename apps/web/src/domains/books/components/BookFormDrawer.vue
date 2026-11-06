<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCreateBook, useUpdateBook } from '@/api/generated/endpoints';
import type {
  Book,
  BookCreateForm,
  BookPatchForm,
} from '@books/api-contract/models';
import { FormDrawer } from '@/shared/components';
import { notify } from '@/shared/lib/notifications';
import BookForm from './BookForm.vue';
import { useBookQuerySync } from '../composables/use-book-query-sync';
import type { BookFormValues } from '../model/book-form.schema';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  book?: Book | null;
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const form = ref<InstanceType<typeof BookForm> | null>(null);
const dirty = ref(false);
const synchronizing = ref(false);
const createMutation = useCreateBook();
const updateMutation = useUpdateBook();
const querySync = useBookQuerySync();

const submitting = computed(
  () =>
    createMutation.isPending.value ||
    updateMutation.isPending.value ||
    synchronizing.value
);
const title = computed(() =>
  props.mode === 'create' ? 'Добавить книгу' : 'Редактировать книгу'
);
const description = computed(() =>
  props.mode === 'create'
    ? 'Заполните данные новой книги.'
    : 'Измените данные книги и при необходимости замените обложку.'
);

function toBookPatchForm(values: BookFormValues): BookPatchForm {
  return {
    title: values.title.trim(),
    year: values.year,
    description: values.description.trim(),
    isbn: values.isbn.trim(),
    author_ids: values.author_ids,
    cover: values.cover ?? undefined,
  };
}

function toBookCreateForm(values: BookFormValues): BookCreateForm {
  if (!values.cover) {
    throw new Error('Book cover is required');
  }

  return {
    ...toBookPatchForm(values),
    title: values.title.trim(),
    year: values.year,
    author_ids: values.author_ids,
    cover: values.cover,
  };
}

async function handleSubmit(values: BookFormValues) {
  if (submitting.value) {
    return;
  }

  try {
    let id: number | undefined;

    if (props.mode === 'create') {
      const response = await createMutation.mutateAsync({
        data: toBookCreateForm(values),
      });
      id = response.data.data?.id;

      if (!response.data.data) {
        throw new Error('Book mutation returned no data');
      }
    } else {
      id = props.book?.id;

      if (id === undefined) {
        throw new Error('Book id is required');
      }

      const response = await updateMutation.mutateAsync({
        id,
        data: toBookPatchForm(values),
      });

      if (!response.data.data) {
        throw new Error('Book mutation returned no data');
      }
    }

    synchronizing.value = true;
    if (props.mode === 'create') {
      await querySync.afterCreate();
    } else if (id !== undefined) {
      await querySync.afterUpdate(id);
    }
    notify.success(
      props.mode === 'create' ? 'Книга добавлена' : 'Изменения сохранены'
    );
    dirty.value = false;
    emit('update:open', false);
  } catch (error) {
    form.value?.setSubmissionError(error);
  } finally {
    synchronizing.value = false;
  }
}

function handleClosed() {
  dirty.value = false;
  createMutation.reset();
  updateMutation.reset();
  form.value?.reset();
}
</script>

<template>
  <FormDrawer
    :open="open"
    :mode="mode"
    :title="title"
    :description="description"
    :dirty="dirty"
    :submitting="submitting"
    :save-label="submitting ? 'Сохранение…' : 'Сохранить'"
    @update:open="emit('update:open', $event)"
    @submit="form?.submit()"
    @closed="handleClosed"
  >
    <BookForm
      ref="form"
      :mode="mode"
      :book="book"
      :submitting="submitting"
      @submit="handleSubmit"
      @dirty-change="dirty = $event"
    />
  </FormDrawer>
</template>
