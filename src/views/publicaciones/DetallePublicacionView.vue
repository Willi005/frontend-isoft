<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArrowLeft, PhShoppingCart, PhMinus, PhPlus } from '@phosphor-icons/vue'
import { obtenerPublicacion, agregarAlCarrito } from '@/services/publicacionesService'
import type { PublicacionDetalleResponse } from '@/types/publicaciones'
import { EstadoCondicionPublicacion, EstadoModeracionPublicacion } from '@/types/publicaciones'

const route = useRoute()
const router = useRouter()

const publicacionId = Number(route.params.id)

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------

const publicacion = ref<PublicacionDetalleResponse | null>(null)
const cargando = ref(true)
const errorCarga = ref<string | null>(null)

const imagenSeleccionada = ref(0)
const cantidad = ref(1)
const agregandoCarrito = ref(false)
const mensajeCarrito = ref<string | null>(null)

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

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

const MODERACION_CONFIG: Record<EstadoModeracionPublicacion, { label: string; clases: string }> = {
  [EstadoModeracionPublicacion.APROBADA]: { label: 'Aprobada', clases: 'bg-emerald-100 text-emerald-700' },
  [EstadoModeracionPublicacion.RECHAZADA]: { label: 'Rechazada', clases: 'bg-red-100 text-red-700' },
  [EstadoModeracionPublicacion.PENDIENTE]: { label: 'Pendiente de revision', clases: 'bg-amber-100 text-amber-700' },
}

// ---------------------------------------------------------------------------
// Computed
// ---------------------------------------------------------------------------

const imagenPrincipal = computed(() => {
  if (!publicacion.value || publicacion.value.imagenesUrls.length === 0) return null
  return publicacion.value.imagenesUrls[imagenSeleccionada.value]
})

const tieneStock = computed(() => publicacion.value !== null && publicacion.value.stock > 0)

// ---------------------------------------------------------------------------
// Funciones
// ---------------------------------------------------------------------------

function formatPrecio(valor: number): string {
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  })
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

async function cargarPublicacion(): Promise<void> {
  cargando.value = true
  errorCarga.value = null

  try {
    publicacion.value = await obtenerPublicacion(publicacionId)
    imagenSeleccionada.value = 0
  } catch {
    errorCarga.value = 'No se pudo cargar la publicacion.'
  } finally {
    cargando.value = false
  }
}

function ajustarCantidad(delta: number): void {
  const nueva = cantidad.value + delta
  if (nueva < 1) return
  if (publicacion.value && nueva > publicacion.value.stock) return
  cantidad.value = nueva
}

async function onAgregarCarrito(): Promise<void> {
  if (!publicacion.value) return
  agregandoCarrito.value = true
  mensajeCarrito.value = null

  try {
    await agregarAlCarrito(publicacion.value.id, cantidad.value)
    mensajeCarrito.value = 'Producto agregado al carrito'
    setTimeout(() => { mensajeCarrito.value = null }, 3000)
  } catch {
    mensajeCarrito.value = 'Error al agregar al carrito'
  } finally {
    agregandoCarrito.value = false
  }
}

function volver(): void {
  router.back()
}

onMounted(() => cargarPublicacion())
</script>

<template>
  <section class="flex flex-col gap-6">
    <!-- Boton volver -->
    <button
      type="button"
      class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-700"
      @click="volver"
    >
      <PhArrowLeft :size="16" weight="regular" />
      Volver al catalogo
    </button>

    <!-- Estado de carga -->
    <div v-if="cargando" class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div class="aspect-square animate-pulse rounded-lg bg-gray-200" />
      <div class="flex flex-col gap-4">
        <div class="h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div class="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
        <div class="h-10 w-32 animate-pulse rounded bg-gray-200" />
        <div class="h-24 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="errorCarga"
      class="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-8 text-center"
    >
      <p class="text-sm font-medium text-red-700">{{ errorCarga }}</p>
      <button
        type="button"
        class="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-600"
        @click="cargarPublicacion"
      >
        Reintentar
      </button>
    </div>

    <!-- Contenido -->
    <div v-else-if="publicacion" class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Columna izquierda: Galeria -->
      <div class="flex flex-col gap-3">
        <!-- Imagen principal -->
        <div class="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <img
            v-if="imagenPrincipal"
            :src="imagenPrincipal"
            :alt="publicacion.titulo"
            class="h-full w-full object-contain"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16"
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

        <!-- Thumbnails -->
        <div
          v-if="publicacion.imagenesUrls.length > 1"
          class="flex gap-2 overflow-x-auto pb-1"
        >
          <button
            v-for="(url, index) in publicacion.imagenesUrls"
            :key="index"
            type="button"
            :class="[
              'h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-150',
              index === imagenSeleccionada
                ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/30'
                : 'border-gray-200 hover:border-gray-400',
            ]"
            @click="imagenSeleccionada = index"
          >
            <img :src="url" :alt="`Imagen ${index + 1}`" class="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Columna derecha: Informacion -->
      <div class="flex flex-col gap-4">
        <!-- Moderacion -->
        <div
          v-if="publicacion.estadoModeracion !== 'APROBADA'"
          :class="[
            'inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold',
            MODERACION_CONFIG[publicacion.estadoModeracion].clases,
          ]"
        >
          {{ MODERACION_CONFIG[publicacion.estadoModeracion].label }}
        </div>

        <!-- Condicion -->
        <span
          :class="[
            'inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
            CONDICION_CLASES[publicacion.condicion],
          ]"
        >
          {{ CONDICION_LABELS[publicacion.condicion] }}
        </span>

        <!-- Titulo -->
        <h1 class="text-2xl font-bold leading-tight text-gray-900">
          {{ publicacion.titulo }}
        </h1>

        <!-- Precio -->
        <p class="text-3xl font-bold text-[var(--primary)]">
          {{ formatPrecio(publicacion.precio) }}
        </p>

        <!-- Stock -->
        <div class="flex items-center gap-2">
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              tieneStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
            ]"
          >
            {{ tieneStock ? `${publicacion.stock} disponible${publicacion.stock > 1 ? 's' : ''}` : 'Sin stock' }}
          </span>
        </div>

        <!-- Selector de cantidad y boton carrito -->
        <div v-if="tieneStock" class="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-700">Cantidad:</span>
            <div class="flex items-center overflow-hidden rounded-md border border-gray-300 bg-white">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center text-gray-500 transition-colors duration-150 hover:bg-gray-100 disabled:opacity-40"
                :disabled="cantidad <= 1"
                @click="ajustarCantidad(-1)"
              >
                <PhMinus :size="14" weight="bold" />
              </button>
              <span class="flex h-9 w-10 items-center justify-center border-x border-gray-300 text-sm font-medium text-gray-900">
                {{ cantidad }}
              </span>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center text-gray-500 transition-colors duration-150 hover:bg-gray-100 disabled:opacity-40"
                :disabled="cantidad >= publicacion.stock"
                @click="ajustarCantidad(1)"
              >
                <PhPlus :size="14" weight="bold" />
              </button>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="agregandoCarrito"
            @click="onAgregarCarrito"
          >
            <PhShoppingCart :size="18" weight="regular" />
            {{ agregandoCarrito ? 'Agregando...' : 'Agregar al carrito' }}
          </button>

          <!-- Mensaje de feedback -->
          <p
            v-if="mensajeCarrito"
            :class="[
              'text-center text-sm font-medium',
              mensajeCarrito.includes('Error') ? 'text-red-600' : 'text-emerald-600',
            ]"
          >
            {{ mensajeCarrito }}
          </p>
        </div>

        <!-- Descripcion -->
        <div class="border-t border-gray-200 pt-4">
          <h2 class="mb-2 text-sm font-semibold text-gray-900">Descripcion</h2>
          <p class="whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {{ publicacion.descripcion }}
          </p>
        </div>

        <!-- Razon de rechazo -->
        <div
          v-if="publicacion.razonRechazo"
          class="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <h3 class="mb-1 text-sm font-semibold text-red-700">Razon de rechazo</h3>
          <p class="text-sm text-red-600">{{ publicacion.razonRechazo }}</p>
        </div>

        <!-- Metadatos -->
        <div class="flex flex-col gap-1 border-t border-gray-200 pt-4 text-xs text-gray-400">
          <span>Publicado el {{ formatFecha(publicacion.fechaCreacion) }}</span>
          <span>ID de vendedor: {{ publicacion.vendedorId }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
