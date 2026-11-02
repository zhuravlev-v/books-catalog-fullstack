<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDeleteBooksId } from '@/api/generated/endpoints';
import type { Book } from '@/api/generated/models';
import { notify } from '@/shared/lib/notifications';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import { useBookQuerySync } from '../composables/use-book-query-sync';

interface Props {
  open: boolean;
  book?: Book | null;
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  deleted: [id: number];
}>();

const mutation = useDeleteBooksId();
const querySync = useBookQuerySync();
const synchronizing = ref(false);
const deleting = computed(() => mutation.isPending.value || synchronizing.value);
const bookId = computed(() => {
  const id = props.book?.id;
  return id !== undefined && Number.isSafeInteger(id) && id > 0 ? id : undefined;
});
const bookTitle = computed(() => props.book?.title?.trim() || 'эту книгу');

watch(
  () => props.open,
  (open) => {
    if (!open) mutation.reset();
  },
);

function handleOpenChange(open: boolean) {
  if (!open && deleting.value) return;
  emit('update:open', open);
}

function preventClose(event: Event) {
  if (deleting.value) event.preventDefault();
}

async function handleDelete() {
  const id = bookId.value;

  if (deleting.value || id === undefined) return;

  try {
    await mutation.mutateAsync({ id });
    synchronizing.value = true;
    await querySync.afterDelete(id);
    notify.success('Книга удалена');
    emit('deleted', id);
    emit('update:open', false);
  } catch {
    notify.error('Не удалось удалить книгу. Попробуйте ещё раз.');
  } finally {
    synchronizing.value = false;
  }
}
</script>

<template>
  <AlertDialog :open="open" @update:open="handleOpenChange">
    <AlertDialogContent @escape-key-down="preventClose">
      <AlertDialogHeader>
        <AlertDialogTitle>Удалить книгу?</AlertDialogTitle>
        <AlertDialogDescription>
          Вы действительно хотите удалить «{{ bookTitle }}»? Это действие нельзя отменить.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button type="button" variant="outline" :disabled="deleting" @click="handleOpenChange(false)">
          Отмена
        </Button>
        <Button
          type="button"
          variant="destructive"
          :disabled="deleting || bookId === undefined"
          @click="handleDelete"
        >
          {{ deleting ? 'Удаление…' : 'Удалить' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
