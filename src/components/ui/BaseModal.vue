<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}
const props = withDefaults(defineProps<Props>(), { size: 'md' })
const emit = defineEmits<{ (e: 'close'): void }>()

const close = () => emit('close')

const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }

watch(() => props.isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKey)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleKey)
  }
})
onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" role="dialog" aria-modal="true" :aria-label="title" @click.self="close">
        <div :class="['modal', `modal--${size}`]">
          <div class="modal__header">
            <slot name="header">
              <h2 class="modal__title">{{ title }}</h2>
            </slot>
            <button class="modal__close" aria-label="Cerrar" @click="close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal__body">
            <slot name="body" />
          </div>
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
  backdrop-filter: blur(3px);
}
.modal {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex; flex-direction: column;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
}
.modal--sm { max-width: 400px; }
.modal--md { max-width: 560px; }
.modal--lg { max-width: 800px; }

.modal__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: var(--border);
  flex-shrink: 0;
}
.modal__title { font-size: var(--font-size-lg); font-weight: 600; color: var(--gray-900); }
.modal__close {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border: none; background: transparent;
  color: var(--gray-500); border-radius: var(--radius-sm);
  transition: background var(--transition-fast), color var(--transition-fast);
}
.modal__close:hover { background: var(--gray-100); color: var(--gray-900); }
.modal__body { padding: var(--space-6); overflow-y: auto; flex: 1; }
.modal__footer {
  display: flex; align-items: center; justify-content: flex-end; gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: var(--border);
  flex-shrink: 0;
}

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: opacity var(--transition-base); }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform var(--transition-base), opacity var(--transition-base); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: translateY(-16px) scale(0.97); opacity: 0; }
</style>