<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDeleteAuthorsId } from '@/api/generated/endpoints';
import type { AuthorShort } from '@/api/generated/models';
import { notify } from '@/shared/lib/notifications';
import { useAuthorQuerySync } from '../composables/use-author-query-sync';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';

interface Props {
  open: boolean;
  author?: AuthorShort | null;
}

const props = withDefaults(defineProps<Props>(), {
  author: null,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  deleted: [id: number];
}>();

const mutation = useDeleteAuthorsId();
const querySync = useAuthorQuerySync();
const synchronizing = ref(false);
const deleting = computed(() => mutation.isPending.value || synchronizing.value);
const authorId = computed(() => {
  const id = props.author?.id;

  return id !== undefined && Number.isSafeInteger(id) && id > 0 ? id : undefined;
});
const authorName = computed(
  () => props.author?.full_name?.trim() || 'этого автора',
);

watch(() => props.open, (open) => {
  if (!open) {
    mutation.reset();
  }
});

function handleOpenChange(open: boolean) {
  if (!open && deleting.value) {
    return;
  }

  emit('update:open', open);
}

function preventClose(event: Event) {
  if (deleting.value) {
    event.preventDefault();
  }
}

async function handleDelete() {
  const id = authorId.value;

  if (deleting.value || id == null) {
    return;
  }

  try {
    await mutation.mutateAsync({ id });
    synchronizing.value = true;
    await querySync.afterDelete(id);
    notify.success('Автор удалён');
    emit('deleted', id);
    emit('update:open', false);
  } catch {
    notify.error('Не удалось удалить автора. Попробуйте ещё раз.');
  } finally {
    synchronizing.value = false;
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="handleOpenChange">
    <AlertDialogContent @escape-key-down="preventClose">
      <AlertDialogHeader>
        <AlertDialogTitle>Удалить автора?</AlertDialogTitle>
        <AlertDialogDescription>
          Вы действительно хотите удалить {{ authorName }}? Это действие нельзя отменить.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button
          type="button"
          variant="outline"
          :disabled="deleting"
          @click="handleOpenChange(false)"
        >
          Отмена
        </Button>
        <Button
          type="button"
          variant="destructive"
          :disabled="deleting || authorId == null"
          @click="handleDelete"
        >
          {{ deleting ? 'Удаление…' : 'Удалить' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
