<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PhMagnifyingGlass } from '@phosphor-icons/vue'
import PublicacionCard from '@/components/publicaciones/PublicacionCard.vue'
import { buscarPublicaciones } from '@/services/publicacionesService'
import type { PublicacionListaResponse, BuscarPublicacionesParams } from '@/types/publicaciones'
import { EstadoCondicionPublicacion } from '@/types/publicaciones'

const router = useRouter()
const route = useRoute()

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------

const publicaciones = ref<PublicacionListaResponse[]>([])
const cargando = ref(false)
const error = ref<string | null>(null)

const paginaActual = ref(0)
const totalPaginas = ref(0)
const totalElementos = ref(0)
const tamanioPagina = 12

// Filtros
const busqueda = ref('')
const condicionFiltro = ref<EstadoCondicionPublicacion | ''>('')
const mostrarFiltros = ref(false)

const CONDICION_OPCIONES: { value: EstadoCondicionPublicacion | ''; label: string }[] = [
  { value: '', label: 'Todas las condiciones' },
  { value: EstadoCondicionPublicacion.NUEVO, label: 'Nuevo' },
  { value: EstadoCondicionPublicacion.COMO_NUEVO, label: 'Como nuevo' },
  { value: EstadoCondicionPublicacion.BUEN_ESTADO, label: 'Buen estado' },
  { value: EstadoCondicionPublicacion.ACEPTABLE, label: 'Aceptable' },
]

// ---------------------------------------------------------------------------
// Carga de datos
// ---------------------------------------------------------------------------

async function cargarPublicaciones(): Promise<void> {
  cargando.value = true
  error.value = null

  try {
    const qCond = route.query.condicion as string
    let cond: EstadoCondicionPublicacion | undefined = undefined
    if (qCond === 'new') cond = EstadoCondicionPublicacion.NUEVO
    else if (qCond === 'used') cond = EstadoCondicionPublicacion.USADO // Depende del enum
    
    // Si la integracion o backend espera precioMin, precioMax, condicion
    const params: BuscarPublicacionesParams = {
      page: paginaActual.value,
      size: tamanioPagina,
      busqueda: busqueda.value.trim() || undefined,
      precioMin: route.query.precioMin ? Number(route.query.precioMin) : undefined,
      precioMax: route.query.precioMax ? Number(route.query.precioMax) : undefined,
      condicion: cond || (condicionFiltro.value || undefined),
    }

    const respuesta = await buscarPublicaciones(params)
    publicaciones.value = respuesta.content
    totalPaginas.value = respuesta.totalPages
    totalElementos.value = respuesta.totalElements
  } catch {
    error.value = 'No se pudieron cargar las publicaciones. Intente nuevamente.'
  } finally {
    cargando.value = false
  }
}

watch(() => route.query, () => {
  paginaActual.value = 0
  cargarPublicaciones()
}, { deep: true })

function buscar(): void {
  paginaActual.value = 0
  cargarPublicaciones()
}

function limpiarFiltros(): void {
  busqueda.value = ''
  condicionFiltro.value = ''
  paginaActual.value = 0
  cargarPublicaciones()
}

function irAPagina(pagina: number): void {
  if (pagina < 0 || pagina >= totalPaginas.value) return
  paginaActual.value = pagina
  cargarPublicaciones()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function verDetalle(id: number): void {
  router.push({ name: 'detalle-publicacion', params: { id } })
}

// ---------------------------------------------------------------------------
// Paginacion: rango de paginas visibles
// ---------------------------------------------------------------------------

function paginasVisibles(): number[] {
  const total = totalPaginas.value
  const actual = paginaActual.value
  const rango: number[] = []
  const inicio = Math.max(0, actual - 2)
  const fin = Math.min(total - 1, actual + 2)
  for (let i = inicio; i <= fin; i++) {
    rango.push(i)
  }
  return rango
}

onMounted(() => cargarPublicaciones())
</script>

<template>
  <section class="flex flex-col gap-5">
    <!-- Encabezado -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Catalogo</h1>
        <p v-if="!cargando && totalElementos > 0" class="text-sm text-gray-500">
          {{ totalElementos }} publicacion{{ totalElementos !== 1 ? 'es' : '' }} encontrada{{ totalElementos !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Barra de busqueda -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1 sm:w-72 sm:flex-none">
          <PhMagnifyingGlass
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            :size="16"
            weight="bold"
          />
          <input
            v-model="busqueda"
            type="search"
            placeholder="Buscar publicaciones..."
            class="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
            @keydown.enter="buscar"
          />
        </div>

        <button
          type="button"
          class="hidden rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--primary-dark)] sm:inline-flex"
          @click="buscar"
        >
          Buscar
        </button>
      </div>
    </div>

    <!-- Panel de filtros eliminado (usando el de integración) -->

    <!-- Estado de carga: skeleton -->
    <div
      v-if="cargando"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white"
      >
        <div class="aspect-[4/3] bg-gray-200" />
        <div class="flex flex-col gap-2 p-3">
          <div class="h-4 w-16 rounded bg-gray-200" />
          <div class="h-4 w-full rounded bg-gray-200" />
          <div class="h-5 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>

    <!-- Estado de error -->
    <div
      v-else-if="error"
      class="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-8 text-center"
    >
      <p class="text-sm font-medium text-red-700">{{ error }}</p>
      <button
        type="button"
        class="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-600"
        @click="cargarPublicaciones"
      >
        Reintentar
      </button>
    </div>

    <!-- Estado vacio -->
    <div
      v-else-if="publicaciones.length === 0"
      class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-12 text-center"
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
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
      <p class="text-sm font-medium text-gray-500">No se encontraron publicaciones</p>
      <p class="text-xs text-gray-400">Intente con otros criterios de busqueda</p>
    </div>

    <!-- Grid de publicaciones -->
    <div
      v-else
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <PublicacionCard
        v-for="pub in publicaciones"
        :key="pub.id"
        :publicacion="pub"
        @click="verDetalle"
      />
    </div>

    <!-- Paginacion -->
    <nav
      v-if="!cargando && totalPaginas > 1"
      class="flex items-center justify-center gap-1 pt-2"
      aria-label="Paginacion"
    >
      <button
        type="button"
        class="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="paginaActual === 0"
        @click="irAPagina(paginaActual - 1)"
      >
        Anterior
      </button>

      <button
        v-for="pagina in paginasVisibles()"
        :key="pagina"
        type="button"
        :class="[
          'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors duration-150',
          pagina === paginaActual
            ? 'bg-[var(--primary)] text-white'
            : 'text-gray-600 hover:bg-gray-100',
        ]"
        @click="irAPagina(pagina)"
      >
        {{ pagina + 1 }}
      </button>

      <button
        type="button"
        class="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="paginaActual === totalPaginas - 1"
        @click="irAPagina(paginaActual + 1)"
      >
        Siguiente
      </button>
    </nav>
  </section>
</template>
