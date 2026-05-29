<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'

interface Props {
  isOpen: boolean
  titulo: string
  mensaje: string
  textoConfirmar?: string
  textoCancelar?: string
  variante?: 'danger' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  textoConfirmar: 'Confirmar',
  textoCancelar: 'Cancelar',
  variante: 'primary',
})

const emit = defineEmits<{
  (e: 'confirmar'): void
  (e: 'cancelar'): void
}>()
</script>

<template>
  <BaseModal :is-open="isOpen" :title="titulo" size="sm" @close="emit('cancelar')">
    <template #body>
      <p class="text-sm leading-relaxed text-gray-600">
        {{ mensaje }}
      </p>
    </template>
    <template #footer>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
        @click="emit('cancelar')"
      >
        {{ textoCancelar }}
      </button>
      <button
        type="button"
        :class="[
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          variante === 'danger'
            ? 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-500'
            : 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] focus-visible:ring-[var(--primary)]',
        ]"
        @click="emit('confirmar')"
      >
        {{ textoConfirmar }}
      </button>
    </template>
  </BaseModal>
</template>
