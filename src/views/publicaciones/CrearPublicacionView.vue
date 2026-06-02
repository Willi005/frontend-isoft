<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowLeft } from '@phosphor-icons/vue'
import PublicacionForm from '@/components/publicaciones/PublicacionForm.vue'
import { crearPublicacion } from '@/services/publicacionesService'
import type { CrearPublicacionRequest } from '@/types/publicaciones'

const router = useRouter()
const cargando = ref(false)
const errorMsg = ref<string | null>(null)

async function onSubmit(payload: { datos: any; archivos: File[] }): Promise<void> {
  cargando.value = true
  errorMsg.value = null

  try {
    await crearPublicacion(
      payload.datos as CrearPublicacionRequest,
      payload.archivos,
    )
    router.push({ name: 'gestion-publicaciones' })
  } catch {
    errorMsg.value = 'No se pudo crear la publicación. Verifique los datos e intente nuevamente.'
  } finally {
    cargando.value = false
  }
}

function onCancelar(): void {
  router.back()
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:px-0">
    <!-- Botón para volver a la vista anterior -->
    <button
      type="button"
      class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-700"
      @click="onCancelar"
    >
      <PhArrowLeft :size="16" weight="regular" />
      Volver atrás
    </button>

    <!-- Título de la sección -->
    <div>
      <h1 class="text-2xl font-bold leading-8 text-gray-900">
        Crear nueva Publicación
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Completa los detalles para publicar tu producto en la comunidad universitaria.
      </p>
    </div>

    <!-- Mensaje de error general si falla algo -->
    <div
      v-if="errorMsg"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMsg }}
    </div>

    <!-- Formulario principal -->
    <PublicacionForm
      modo="crear"
      :cargando="cargando"
      @submit="onSubmit"
      @cancelar="onCancelar"
    />
  </section>
</template>
