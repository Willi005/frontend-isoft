<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PhArrowLeft } from '@phosphor-icons/vue'
import PublicacionForm from '@/components/publicaciones/PublicacionForm.vue'
import { obtenerPublicacion, editarPublicacion } from '@/utils/mockStore'
import type {
  PublicacionDetalle,
  EditarPublicacionData,
} from '@/utils/mockStore'

const router = useRouter()
const route = useRoute()

const datosIniciales = ref<PublicacionDetalle | undefined>(undefined)
const cargandoDatos = ref(true)
const cargandoSubmit = ref(false)
const errorMsg = ref<string | null>(null)
const errorCarga = ref<string | null>(null)

const publicacionId = Number(route.params.id)

// Inicialización

async function cargarDatos(): Promise<void> {
  cargandoDatos.value = true
  errorCarga.value = null

  try {
    datosIniciales.value = await obtenerPublicacion(publicacionId)
  } catch {
    errorCarga.value = 'No se pudo cargar la publicación. Verifique el ID e intente nuevamente.'
  } finally {
    cargandoDatos.value = false
  }
}

// Guardado de datos

async function onSubmit(payload: {
  datos: any
  archivos: File[]
}): Promise<void> {
  cargandoSubmit.value = true
  errorMsg.value = null

  try {
    await editarPublicacion(
      publicacionId,
      payload.datos as EditarPublicacionData,
      payload.archivos,
    )
    router.push({ name: 'gestion-publicaciones' })
  } catch {
    errorMsg.value = 'No se pudieron guardar los cambios. Verifique los datos e intente nuevamente.'
  } finally {
    cargandoSubmit.value = false
  }
}

function onCancelar(): void {
  router.back()
}

onMounted(() => cargarDatos())
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

    <!-- Título y barra de búsqueda -->
    <div>
      <h1 class="text-2xl font-bold leading-8 text-gray-900">
        Editar Publicación
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Modifique los datos de su publicación.
      </p>
    </div>

    <!-- Skeleton loading para la carga inicial -->
    <div
      v-if="cargandoDatos"
      class="grid grid-cols-1 gap-5 lg:grid-cols-2"
    >
      <div v-for="n in 3" :key="n" class="flex flex-col gap-4 rounded border border-gray-200 bg-white p-6">
        <div class="h-5 w-48 animate-pulse rounded bg-gray-200" />
        <div class="h-24 w-full animate-pulse rounded bg-gray-200" />
      </div>
      <div v-for="n in 2" :key="'r'+n" class="flex flex-col gap-4 rounded border border-gray-200 bg-white p-6">
        <div class="h-5 w-48 animate-pulse rounded bg-gray-200" />
        <div class="h-32 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>

    <!-- Mensaje de error -->
    <div
      v-else-if="errorCarga"
      class="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-8 text-center"
    >
      <p class="text-sm font-medium text-red-700">{{ errorCarga }}</p>
      <button
        type="button"
        class="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-600"
        @click="cargarDatos"
      >
        Reintentar
      </button>
    </div>

    <!-- Formulario para editar la publicación -->
    <template v-else-if="datosIniciales">
      <!-- Mostrar error si el envío falla -->
      <div
        v-if="errorMsg"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ errorMsg }}
      </div>

      <PublicacionForm
        modo="editar"
        :datos-iniciales="datosIniciales"
        :cargando="cargandoSubmit"
        @submit="onSubmit"
        @cancelar="onCancelar"
      />
    </template>
  </section>
</template>
