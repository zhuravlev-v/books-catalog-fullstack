<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Author } from '@/api/generated/models';
import { usePostAuthors, usePutAuthorsId } from '@/api/generated/endpoints';
import { FormDrawer } from '@/shared/components';
import { notify } from '@/shared/lib/notifications';
import AuthorForm from './AuthorForm.vue';
import { useAuthorQuerySync } from '../composables/use-author-query-sync';
import type { AuthorFormValues } from '../model/author-form.schema';

interface Props {
  open: boolean;
  mode: 'create' | 'edit';
  author?: Author | null;
}

const props = withDefaults(defineProps<Props>(), {
  author: null,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const form = ref<InstanceType<typeof AuthorForm> | null>(null);
const dirty = ref(false);
const synchronizing = ref(false);
const createMutation = usePostAuthors();
const updateMutation = usePutAuthorsId();
const querySync = useAuthorQuerySync();

const submitting = computed(
  () => createMutation.isPending.value || updateMutation.isPending.value || synchronizing.value
);
const title = computed(() =>
  props.mode === 'create' ? 'Добавить автора' : 'Редактировать автора'
);
const description = computed(() =>
  props.mode === 'create' ? 'Укажите полное имя нового автора.' : 'Измените полное имя автора.'
);

async function handleSubmit(values: AuthorFormValues) {
  if (submitting.value) {
    return;
  }

  try {
    if (props.mode === 'create') {
      const response = await createMutation.mutateAsync({ data: values });

      if (!response.data.data) {
        throw new Error('Author mutation returned no data');
      }

      synchronizing.value = true;
      await querySync.afterCreate();
    } else {
      const id = props.author?.id;

      if (id == null) {
        throw new Error('Author id is required');
      }

      const response = await updateMutation.mutateAsync({ id, data: values });

      if (!response.data.data) {
        throw new Error('Author mutation returned no data');
      }

      synchronizing.value = true;
      await querySync.afterUpdate(id);
    }

    notify.success(props.mode === 'create' ? 'Автор добавлен' : 'Изменения сохранены');
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
    <AuthorForm
      ref="form"
      :author="author"
      :submitting="submitting"
      @submit="handleSubmit"
      @dirty-change="dirty = $event"
    />
  </FormDrawer>
</template>
