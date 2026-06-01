<script setup lang="ts">
import { ref } from 'vue'
import type { PublicacionListaResponse } from '@/types/publicaciones'
import { EstadoCondicionPublicacion } from '@/types/publicaciones'
import { getCloudinaryUrl } from '@/utils/cloudinary'

interface Props {
  publicacion: PublicacionListaResponse
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

const imagenError = ref(false)

function onImageError(): void {
  imagenError.value = true
}

const CONDICION_LABELS: Record<EstadoCondicionPublicacion, string> = {
  [EstadoCondicionPublicacion.NUEVO]: 'Nuevo',
  [EstadoCondicionPublicacion.COMO_NUEVO]: 'Como nuevo',
  [EstadoCondicionPublicacion.BUEN_ESTADO]: 'Buen estado',
  [EstadoCondicionPublicacion.ACEPTABLE]: 'Aceptable',
}

const CONDICION_CLASES: Record<EstadoCondicionPublicacion, string> = {
  [EstadoCondicionPublicacion.NUEVO]: 'bg-emerald-100 text-emerald-700',
  [EstadoCondicionPublicacion.COMO_NUEVO]: 'bg-sky-100 text-sky-700',
  [EstadoCondicionPublicacion.BUEN_ESTADO]: 'bg-amber-100 text-amber-700',
  [EstadoCondicionPublicacion.ACEPTABLE]: 'bg-gray-100 text-gray-600',
}

function formatPrecio(valor: number): string {
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  })
}
</script>

<template>
  <article
    class="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    role="button"
    tabindex="0"
    :aria-label="`Ver detalle de ${publicacion.titulo}`"
    @click="emit('click', publicacion.id)"
    @keydown.enter="emit('click', publicacion.id)"
  >
    <!-- Imagen -->
    <div class="aspect-[4/3] overflow-hidden bg-gray-100">
      <img
        v-if="publicacion.imagenPrincipalUrl && !imagenError"
        :src="getCloudinaryUrl(publicacion.imagenPrincipalUrl)"
        :alt="publicacion.titulo"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="onImageError"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12"
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
    </div>

    <!-- Contenido -->
    <div class="flex flex-1 flex-col gap-1.5 p-3">
      <span
        :class="[
          'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold',
          CONDICION_CLASES[publicacion.condicion],
        ]"
      >
        {{ CONDICION_LABELS[publicacion.condicion] }}
      </span>

      <h3 class="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
        {{ publicacion.titulo }}
      </h3>

      <span class="mt-auto pt-1 text-base font-bold text-[var(--primary)]">
        {{ formatPrecio(publicacion.precio) }}
      </span>
    </div>
  </article>
</template>
