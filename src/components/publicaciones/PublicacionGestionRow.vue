<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PhPencilSimple,
  PhTrash,
  PhPlay,
  PhPause,
} from '@phosphor-icons/vue'
import type { PublicacionLista } from '@/utils/mockStore'
import { EstadoPublicacion } from '@/utils/mockStore'
import { getCloudinaryUrl } from '@/utils/cloudinary'
import { CONDICION_LABELS } from '@/utils/useCondicionLabels'
import { formatPrecio, formatFechaCorta } from '@/utils/useFormatters'

interface Props {
  publicacion: PublicacionLista
}

const props = defineProps<Props>()

const imgError = ref(false)

function onImgError(): void {
  imgError.value = true
}

const emit = defineEmits<{
  (e: 'editar', id: number): void
  (e: 'cambiar-estado', id: number, estado: EstadoPublicacion): void
  (e: 'eliminar', id: number): void
  (e: 'ver-detalle', id: number): void
}>()

const ESTADO_CONFIG: Record<EstadoPublicacion, { label: string; clases: string }> = {
  [EstadoPublicacion.ACTIVA]: {
    label: 'Activa',
    clases: 'bg-emerald-100 text-emerald-700',
  },
  [EstadoPublicacion.EN_PAUSA]: {
    label: 'En pausa',
    clases: 'bg-amber-100 text-amber-700',
  },
  [EstadoPublicacion.DESHABILITADA]: {
    label: 'Deshabilitada',
    clases: 'bg-red-100 text-red-700',
  },
  [EstadoPublicacion.ELIMINADA]: {
    label: 'Eliminada',
    clases: 'bg-gray-100 text-gray-500',
  },
}

const estaActiva = computed(
  () => props.publicacion.estadoPublicacion === EstadoPublicacion.ACTIVA,
)

const estadoToggle = computed(() =>
  estaActiva.value ? EstadoPublicacion.EN_PAUSA : EstadoPublicacion.ACTIVA,
)
</script>

<template>
  <div
    class="flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-gray-50"
  >
    <!-- Miniatura -->
    <button
      type="button"
      class="group relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-gray-100 transition-all duration-200 hover:border-[var(--primary)] hover:shadow-md hover:ring-2 hover:ring-[var(--primary)]/20"
      title="Ver detalles"
      @click.stop="emit('ver-detalle', publicacion.id)"
    >
      <img
        v-if="publicacion.imagenPrincipalUrl && !imgError"
        :src="getCloudinaryUrl(publicacion.imagenPrincipalUrl)"
        :alt="publicacion.titulo"
        loading="lazy"
        class="h-full w-full object-cover"
        @error="onImgError"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
          />
        </svg>
      </div>
    </button>

    <!-- Informacion -->
    <div class="flex min-w-0 flex-1 flex-col">
      <button
        type="button"
        class="truncate text-left text-sm font-medium text-gray-900 transition-colors duration-150 hover:text-[var(--primary)]"
        @click.prevent="emit('ver-detalle', publicacion.id)"
      >
        {{ publicacion.titulo }}
      </button>
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-[var(--primary)]">
          {{ formatPrecio(publicacion.precio) }}
        </span>
        <span class="text-xs text-gray-400">
          • {{ CONDICION_LABELS[publicacion.condicion] }}
        </span>
      </div>
    </div>

    <!-- Metadatos de la publicacion (Figma) -->
    <div class="hidden flex-col items-end gap-1 md:flex md:w-32 lg:w-40 mr-2 text-right">
      <span class="text-xs text-gray-500">
        Stock: <strong class="font-medium text-gray-700">{{ publicacion.stock }} disponibles</strong>
      </span>
      <span class="text-xs text-gray-400">
        Publicado el {{ formatFechaCorta(publicacion.fechaCreacion) }}
      </span>
    </div>

    <!-- Estado -->
    <div class="w-24 sm:w-28 flex-shrink-0 text-center">
      <span
        :class="[
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
          ESTADO_CONFIG[publicacion.estadoPublicacion].clases,
        ]"
      >
        {{ ESTADO_CONFIG[publicacion.estadoPublicacion].label }}
      </span>
    </div>

    <!-- Acciones -->
    <div class="flex w-24 flex-shrink-0 items-center justify-center gap-1">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors duration-150 hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
        aria-label="Editar publicación"
        @click="emit('editar', publicacion.id)"
      >
        <PhPencilSimple :size="18" weight="regular" />
      </button>

      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors duration-150 hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
        :aria-label="estaActiva ? 'Pausar publicación' : 'Activar publicación'"
        @click="emit('cambiar-estado', publicacion.id, estadoToggle)"
      >
        <PhPause v-if="estaActiva" :size="20" weight="regular" />
        <PhPlay v-else :size="20" weight="regular" />
      </button>

      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
        aria-label="Eliminar publicación"
        @click="emit('eliminar', publicacion.id)"
      >
        <PhTrash :size="18" weight="regular" />
      </button>
    </div>
  </div>
</template>
