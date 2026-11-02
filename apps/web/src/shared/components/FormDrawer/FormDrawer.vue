<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import type { FormDrawerMode } from './types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'

interface Props {
  open: boolean
  mode: FormDrawerMode
  title: string
  description?: string
  dirty?: boolean
  submitting?: boolean
  saveLabel?: string
  cancelLabel?: string
  discardLabel?: string
  continueLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  dirty: false,
  submitting: false,
  saveLabel: 'Сохранить',
  cancelLabel: 'Отмена',
  discardLabel: 'Выйти без сохранения',
  continueLabel: 'Продолжить редактирование',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': []
  'closed': []
}>()

const isDesktop = useMediaQuery('(min-width: 768px)')
const showDiscardConfirmation = ref(false)
const forceClosing = ref(false)
const opener = ref<HTMLElement | null>(null)

const swipeDirection = computed(() => isDesktop.value ? 'right' : 'down')

watch(() => props.open, (open, wasOpen) => {
  if (open && !wasOpen) {
    opener.value = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
  }

  if (!open) {
    showDiscardConfirmation.value = false
  }
})

function requestClose() {
  if (props.submitting) {
    return
  }

  if (props.dirty && !forceClosing.value) {
    showDiscardConfirmation.value = true
    return
  }

  emit('update:open', false)
}

function handleOpenChange(open: boolean) {
  if (open) {
    emit('update:open', true)
    return
  }

  requestClose()
}

function discardChanges() {
  showDiscardConfirmation.value = false
  forceClosing.value = true
  emit('update:open', false)
}

function handleSubmit() {
  if (!props.submitting) {
    emit('submit')
  }
}

async function handleOpenComplete(open: boolean) {
  if (open) {
    return
  }

  forceClosing.value = false
  emit('closed')

  await nextTick()
  opener.value?.focus()
  opener.value = null
}
</script>

<template>
  <Drawer
    :open="open"
    :swipe-direction="swipeDirection"
    @update:open="handleOpenChange"
    @update:open-complete="handleOpenComplete"
  >
    <DrawerContent
      :data-mode="mode"
      class="max-md:!h-auto max-md:!max-h-[90dvh] max-md:rounded-t-xl md:!w-full md:!max-w-lg md:border-l [@media(max-width:767px)_and_(max-height:640px)]:!h-dvh [@media(max-width:767px)_and_(max-height:640px)]:!max-h-dvh [@media(max-width:767px)_and_(max-height:640px)]:rounded-none"
    >
      <DrawerHeader class="shrink-0 border-b px-6 py-5 text-left">
        <DrawerTitle>{{ title }}</DrawerTitle>
        <DrawerDescription v-if="description">
          {{ description }}
        </DrawerDescription>
      </DrawerHeader>

      <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <slot />
      </div>

      <DrawerFooter class="shrink-0 flex-row-reverse border-t px-6 py-4">
        <Button
          type="button"
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ saveLabel }}
        </Button>
        <Button
          type="button"
          variant="outline"
          :disabled="submitting"
          @click="requestClose"
        >
          {{ cancelLabel }}
        </Button>
        <slot name="footer" />
      </DrawerFooter>
    </DrawerContent>
  </Drawer>

  <AlertDialog v-model:open="showDiscardConfirmation">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Отменить изменения?</AlertDialogTitle>
        <AlertDialogDescription>
          Несохранённые изменения будут потеряны. Это действие нельзя отменить.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ continueLabel }}</AlertDialogCancel>
        <AlertDialogAction @click="discardChanges">
          {{ discardLabel }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
