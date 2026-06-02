<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PhPlus, PhArrowLeft } from '@phosphor-icons/vue'
import PublicacionGestionRow from '@/components/publicaciones/PublicacionGestionRow.vue'
import ConfirmacionModal from '@/components/publicaciones/ConfirmacionModal.vue'
import {
  buscarPublicaciones,
  eliminarPublicacion,
  cambiarVisibilidad,
} from '@/utils/mockStore'
import type { PublicacionLista } from '@/utils/mockStore'
import { EstadoPublicacion } from '@/utils/mockStore'
import { cuentasFacade } from '@/utils/mockStore'

const router = useRouter()

// Estado local

const publicaciones = ref<PublicacionLista[]>([])
const cargando = ref(false)
const error = ref<string | null>(null)

const paginaActual = ref(0)
const totalPaginas = ref(0)
const totalElementos = ref(0)

// Variables para controlar el modal de eliminación
const modalEliminar = ref(false)
const publicacionAEliminar = ref<number | null>(null)
const eliminando = ref(false)

// Control del modal para pausar/activar
const modalEstado = ref(false)
const publicacionACambiar = ref<{ id: number; estado: EstadoPublicacion } | null>(null)
const cambiandoEstado = ref(false)

// Carga de datos simulados

async function cargarPublicaciones(): Promise<void> {
  cargando.value = true
  error.value = null

  try {
    const respuesta = await buscarPublicaciones({
      page: paginaActual.value,
      size: 10,
      vendedorId: cuentasFacade.obtenerUsuarioActual().id,
    })
    
    publicaciones.value = respuesta.content
    totalPaginas.value = respuesta.totalPages
    totalElementos.value = respuesta.totalElements
  } catch {
    error.value = 'No se pudieron cargar las publicaciones.'
  } finally {
    cargando.value = false
  }
}

// Navegación

function irACrear(): void {
  router.push({ name: 'crear-publicacion' })
}

function irAEditar(id: number): void {
  router.push({ name: 'editar-publicacion', params: { id } })
}

function verDetalle(id: number): void {
  router.push({ name: 'detalle-publicacion', params: { id } })
}

// Manejo de eliminación

function solicitarEliminacion(id: number): void {
  publicacionAEliminar.value = id
  modalEliminar.value = true
}

async function confirmarEliminacion(): Promise<void> {
  if (publicacionAEliminar.value === null) return
  eliminando.value = true

  try {
    await eliminarPublicacion(publicacionAEliminar.value)
    modalEliminar.value = false
    publicacionAEliminar.value = null
    await cargarPublicaciones()
  } catch {
    error.value = 'No se pudo eliminar la publicación.'
  } finally {
    eliminando.value = false
  }
}

function cancelarEliminacion(): void {
  modalEliminar.value = false
  publicacionAEliminar.value = null
}

// Activación y pausa

function solicitarCambioEstado(id: number, estado: EstadoPublicacion): void {
  publicacionACambiar.value = { id, estado }
  modalEstado.value = true
}

async function confirmarCambioEstado(): Promise<void> {
  if (!publicacionACambiar.value) return
  cambiandoEstado.value = true

  try {
    await cambiarVisibilidad(
      publicacionACambiar.value.id,
      publicacionACambiar.value.estado,
    )
    // Actualizamos el valor localmente en la vista
    const index = publicaciones.value.findIndex(
      (p) => p.id === publicacionACambiar.value!.id,
    )
    if (index !== -1) {
      publicaciones.value[index] = {
        ...publicaciones.value[index],
        estadoPublicacion: publicacionACambiar.value.estado,
      }
    }
    modalEstado.value = false
    publicacionACambiar.value = null
  } catch {
    error.value = 'No se pudo cambiar el estado de la publicación.'
  } finally {
    cambiandoEstado.value = false
  }
}

function cancelarCambioEstado(): void {
  modalEstado.value = false
  publicacionACambiar.value = null
}

// Lógica de paginación

function irAPagina(pagina: number): void {
  if (pagina < 0 || pagina >= totalPaginas.value) return
  paginaActual.value = pagina
  cargarPublicaciones()
}

onMounted(() => cargarPublicaciones())
</script>

<template>
  <section class="flex flex-col gap-5">
    <!-- Botón para regresar -->
    <button
      type="button"
      class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-700 mb-2"
      @click="router.back()"
    >
      <PhArrowLeft :size="16" weight="regular" />
      Volver atrás
    </button>

    <!-- Título y barra de búsqueda -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Mis publicaciones</h1>
        <p v-if="!cargando && totalElementos > 0" class="text-sm text-gray-500">
          {{ totalElementos }} publicacion{{ totalElementos !== 1 ? 'es' : '' }}
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--primary-dark)]"
        @click="irACrear"
      >
        <PhPlus :size="16" weight="bold" />
        Nueva publicación
      </button>
    </div>

    <!-- Mensaje de error -->
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Loading state -->
    <div v-if="cargando" class="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div
        v-for="n in 5"
        :key="n"
        class="flex animate-pulse items-center gap-4 border-b border-gray-200 px-4 py-3 last:border-b-0"
      >
        <div class="h-12 w-12 rounded-md bg-gray-200" />
        <div class="flex flex-1 flex-col gap-1.5">
          <div class="h-4 w-48 rounded bg-gray-200" />
          <div class="h-3 w-24 rounded bg-gray-200" />
        </div>
        <div class="h-5 w-16 rounded-full bg-gray-200" />
        <div class="flex gap-1">
          <div class="h-8 w-8 rounded-md bg-gray-200" />
          <div class="h-8 w-8 rounded-md bg-gray-200" />
          <div class="h-8 w-8 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>

    <!-- Mostrar un mensaje si no hay resultados -->
    <div
      v-else-if="publicaciones.length === 0 && !error"
      class="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-12 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      <p class="text-sm font-medium text-gray-500">No tienes publicaciones</p>
      <button
        type="button"
        class="mt-1 inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--primary-dark)]"
        @click="irACrear"
      >
        <PhPlus :size="16" weight="bold" />
        Crear primera publicación
      </button>
    </div>

    <!-- Lista principal -->
    <div
      v-else
      class="overflow-hidden rounded-lg border border-gray-200 bg-white"
    >
      <!-- Encabezado de la tabla (solo visible en escritorio) -->
      <div class="hidden items-center gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 md:flex">
        <div class="w-16 flex-shrink-0"></div> <!-- Espaciador para la columna de la imagen -->
        <div class="min-w-0 flex-1">Producto</div>
        <div class="mr-2 w-32 text-right lg:w-40">Detalles</div>
        <div class="w-24 flex-shrink-0 text-center sm:w-28">Estado</div>
        <div class="w-24 flex-shrink-0 text-center">Acciones</div>
      </div>

      <PublicacionGestionRow
        v-for="pub in publicaciones"
        :key="pub.id"
        :publicacion="pub"
        @editar="irAEditar"
        @cambiar-estado="solicitarCambioEstado"
        @eliminar="solicitarEliminacion"
        @ver-detalle="verDetalle"
      />
    </div>

    <!-- Paginacion -->
    <nav
      v-if="!cargando && totalPaginas > 1"
      class="flex items-center justify-center gap-1 pt-2"
      aria-label="Paginación"
    >
      <button
        type="button"
        class="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="paginaActual === 0"
        @click="irAPagina(paginaActual - 1)"
      >
        Anterior
      </button>

      <span class="px-3 text-sm text-gray-500">
        Página {{ paginaActual + 1 }} de {{ totalPaginas }}
      </span>

      <button
        type="button"
        class="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="paginaActual === totalPaginas - 1"
        @click="irAPagina(paginaActual + 1)"
      >
        Siguiente
      </button>
    </nav>

    <!-- Modal de confirmación para borrar -->
    <ConfirmacionModal
      :is-open="modalEliminar"
      titulo="Eliminar publicación"
      mensaje="Esta acción eliminará la publicación de forma permanente. ¿Está seguro de que desea continuar?"
      texto-confirmar="Eliminar"
      variante="danger"
      @confirmar="confirmarEliminacion"
      @cancelar="cancelarEliminacion"
    />

    <!-- Modal de confirmación para pausar/activar -->
    <ConfirmacionModal
      :is-open="modalEstado"
      titulo="Cambiar estado"
      :mensaje="
        publicacionACambiar?.estado === 'EN_PAUSA'
          ? 'La publicación será pausada y dejará de ser visible en el catálogo.'
          : 'La publicación será activada y será visible en el catálogo.'
      "
      texto-confirmar="Confirmar"
      variante="primary"
      @confirmar="confirmarCambioEstado"
      @cancelar="cancelarCambioEstado"
    />
  </section>
</template>
