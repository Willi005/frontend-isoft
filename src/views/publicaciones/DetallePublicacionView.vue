<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  PhArrowLeft,
  PhShoppingCart,
  PhMinus,
  PhPlus,
  PhCaretDown,
  PhCaretUp,
  PhMagnifyingGlassPlus, 
  PhMagnifyingGlassMinus, 
  PhX, 
  PhCaretLeft, 
  PhCaretRight
} from '@phosphor-icons/vue'
import { obtenerPublicacion, agregarAlCarrito } from '@/services/publicacionesService'
import type { PublicacionDetalleResponse } from '@/types/publicaciones'
import { EstadoModeracionPublicacion } from '@/types/publicaciones'
import { getCloudinaryUrl } from '@/utils/cloudinary'
import { CONDICION_LABELS, CONDICION_CLASES } from '@/utils/useCondicionLabels'
import { formatPrecio, formatFechaLarga } from '@/utils/useFormatters'

const route = useRoute()
const router = useRouter()

const publicacionId = Number(route.params.id)

// Estado local

const publicacion = ref<PublicacionDetalleResponse | null>(null)
const cargando = ref(true)
const errorCarga = ref<string | null>(null)

const imagenSeleccionada = ref(0)
const cantidad = ref(1)
const agregandoCarrito = ref(false)
const mensajeCarrito = ref<string | null>(null)

const mostrarTodasCaracteristicas = ref(false)

// Mapeo visual de estados


const MODERACION_CONFIG: Record<EstadoModeracionPublicacion, { label: string; clases: string }> = {
  [EstadoModeracionPublicacion.APROBADA]: { label: 'Aprobada', clases: 'bg-emerald-100 text-emerald-700' },
  [EstadoModeracionPublicacion.RECHAZADA]: { label: 'Rechazada', clases: 'bg-red-100 text-red-700' },
  [EstadoModeracionPublicacion.PENDIENTE]: { label: 'Pendiente de revisión', clases: 'bg-amber-100 text-amber-700' },
}

// Datos calculados

const imagenPrincipal = computed(() => {
  if (!publicacion.value || !publicacion.value.imagenesUrls || publicacion.value.imagenesUrls.length === 0) {
    return null
  }
  return getCloudinaryUrl(publicacion.value.imagenesUrls[imagenSeleccionada.value])
})

const modalImagenAbierto = ref(false)
const zoomNivel = ref(1)

function abrirModalImagen() {
  modalImagenAbierto.value = true
  zoomNivel.value = 1
  document.body.style.overflow = 'hidden'
}

function cerrarModalImagen() {
  modalImagenAbierto.value = false
  zoomNivel.value = 1
  document.body.style.overflow = 'auto'
}

function hacerZoomIn() {
  zoomNivel.value = Math.min(zoomNivel.value + 0.5, 4)
}

function hacerZoomOut() {
  zoomNivel.value = Math.max(zoomNivel.value - 0.5, 0.5)
}

function siguienteImagen() {
  if (!publicacion.value) return
  if (imagenSeleccionada.value < publicacion.value.imagenesUrls.length - 1) {
    imagenSeleccionada.value++
  } else {
    imagenSeleccionada.value = 0 // Si llegamos a la última, volvemos a la primera imagen
  }
  zoomNivel.value = 1 // Quitamos el zoom al cambiar de imagen
}

function imagenAnterior() {
  if (!publicacion.value) return
  if (imagenSeleccionada.value > 0) {
    imagenSeleccionada.value--
  } else {
    imagenSeleccionada.value = publicacion.value.imagenesUrls.length - 1 // Si estamos en la primera y retrocedemos, vamos a la última
  }
  zoomNivel.value = 1 // Quitamos el zoom al cambiar de imagen
}

const tieneStock = computed(() => publicacion.value !== null && publicacion.value.stock > 0)

// Métodos principales del componente


async function cargarPublicacion(): Promise<void> {
  cargando.value = true
  errorCarga.value = null

  try {
    publicacion.value = await obtenerPublicacion(publicacionId)
    imagenSeleccionada.value = 0
  } catch {
    errorCarga.value = 'No se pudo cargar la publicación.'
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
    
    // Actualizamos el stock disponible localmente y reseteamos el contador
    publicacion.value.stock -= cantidad.value
    cantidad.value = 1
    
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
    <!-- Botón para regresar -->
    <button
      type="button"
      class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:text-gray-700"
      @click="volver"
    >
      <PhArrowLeft :size="16" weight="regular" />
      Volver atrás
    </button>

    <!-- Loading state -->
    <div v-if="cargando" class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div class="aspect-square animate-pulse rounded-lg bg-gray-200" />
      <div class="flex flex-col gap-4">
        <div class="h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div class="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
        <div class="h-10 w-32 animate-pulse rounded bg-gray-200" />
        <div class="h-24 w-full animate-pulse rounded bg-gray-200" />
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
        @click="cargarPublicacion"
      >
        Reintentar
      </button>
    </div>

    <!-- Información detallada del producto -->
    <div v-else-if="publicacion" class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Sección izquierda con las imágenes -->
      <div class="flex flex-col gap-3">
        <!-- Imagen grande seleccionada -->
        <div 
          class="aspect-square w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm cursor-pointer relative group"
          @click="abrirModalImagen"
        >
          <img
            v-if="imagenPrincipal"
            :src="imagenPrincipal"
            :alt="publicacion.titulo"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <!-- Icono de lupa para indicar que se puede hacer clic -->
          <div v-if="imagenPrincipal" class="absolute bottom-4 right-4 rounded-full bg-white/80 p-2 text-gray-700 shadow-sm backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <PhMagnifyingGlassPlus :size="20" />
          </div>
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300"
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

        <!-- Galería de imágenes pequeñas -->
        <div
          v-if="publicacion.imagenesUrls.length > 1"
          class="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5"
        >
          <button
            v-for="(url, index) in publicacion.imagenesUrls"
            :key="index"
            type="button"
            :class="[
              'aspect-square w-full overflow-hidden rounded-lg border-2 transition-all duration-200',
              index === imagenSeleccionada
                ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-md scale-[1.02]'
                : 'border-transparent bg-gray-100 hover:border-gray-300 hover:shadow-sm opacity-80 hover:opacity-100',
            ]"
            @click="imagenSeleccionada = index"
          >
            <img :src="getCloudinaryUrl(url)" :alt="`Imagen ${index + 1}`" class="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Sección derecha con la información y botones -->
      <div class="flex flex-col gap-4">
        <!-- Estado de revisión por parte del administrador -->
        <div
          v-if="publicacion.estadoModeracion !== 'APROBADA'"
          :class="[
            'inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold',
            MODERACION_CONFIG[publicacion.estadoModeracion].clases,
          ]"
        >
          {{ MODERACION_CONFIG[publicacion.estadoModeracion].label }}
        </div>

        <!-- Estado del producto (nuevo, usado, etc.) -->
        <span
          :class="[
            'inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
            CONDICION_CLASES[publicacion.condicion],
          ]"
        >
          {{ CONDICION_LABELS[publicacion.condicion] }}
        </span>

        <!-- Título de la publicación -->
        <h1 class="text-2xl font-bold leading-tight text-gray-900">
          {{ publicacion.titulo }}
        </h1>

        <!-- Precio formateado -->
        <p class="text-3xl font-bold text-[var(--primary)]">
          {{ formatPrecio(publicacion.precio) }}
        </p>

        <!-- Cantidad disponible -->
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

        <!-- Controles para agregar al carrito -->
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

          <!-- Mensaje temporal después de agregar al carrito -->
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

        <!-- Texto descriptivo del producto -->
        <div class="border-t border-gray-200 pt-4">
          <h2 class="mb-2 text-sm font-semibold text-gray-900">Descripción</h2>
          <p class="whitespace-pre-line text-sm leading-relaxed text-gray-600">
            {{ publicacion.descripcion }}
          </p>
        </div>

        <!-- Tabla de características (datos simulados por ahora) -->
        <div class="border-t border-gray-200 pt-4">
          <h2 class="mb-3 text-sm font-semibold text-gray-900">Características principales</h2>
          <div class="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div class="flex flex-col rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <span class="text-xs font-medium text-gray-500">Característica 1</span>
              <span class="font-medium text-gray-900">Simulado Ej: J.K. Rowling</span>
            </div>
            <div class="flex flex-col rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <span class="text-xs font-medium text-gray-500">Característica 2</span>
              <span class="font-medium text-gray-900">Simulado Ej: Salamandra</span>
            </div>
            <template v-if="mostrarTodasCaracteristicas">
              <div class="col-span-1 md:col-span-2 mt-2 border border-gray-200">
                <div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
                  <span class="text-xs font-medium text-gray-500 w-1/3">Característica 3</span>
                  <span class="text-sm text-gray-900 w-2/3">Simulado Ej: Español</span>
                </div>
                <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <span class="text-xs font-medium text-gray-500 w-1/3">Característica 4</span>
                  <span class="text-sm text-gray-900 w-2/3">Simulado Ej: 256</span>
                </div>
                <div class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
                  <span class="text-xs font-medium text-gray-500 w-1/3">Característica 5</span>
                  <span class="text-sm text-gray-900 w-2/3">Simulado Ej: Tapa blanda</span>
                </div>
                <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
                  <span class="text-xs font-medium text-gray-500 w-1/3">Característica 6</span>
                  <span class="text-sm text-gray-900 w-2/3">Simulado Ej: 200g</span>
                </div>
              </div>
            </template>
          </div>
          <button 
            type="button" 
            class="mt-3 flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]"
            @click="mostrarTodasCaracteristicas = !mostrarTodasCaracteristicas"
          >
            {{ mostrarTodasCaracteristicas ? 'Ocultar características' : 'Ver todas las características' }}
            <component :is="mostrarTodasCaracteristicas ? PhCaretUp : PhCaretDown" :size="16" weight="bold" />
          </button>
        </div>

        <!-- Mostrar por qué se rechazó la publicación -->
        <div
          v-if="publicacion.razonRechazo"
          class="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <h3 class="mb-1 text-sm font-semibold text-red-700">Razón de rechazo</h3>
          <p class="text-sm text-red-600">{{ publicacion.razonRechazo }}</p>
        </div>

        <!-- Fecha de publicación y otros datos -->
        <div class="flex flex-col gap-1 border-t border-gray-200 pt-4 text-xs text-gray-400">
          <span>Publicado el {{ formatFechaLarga(publicacion.fechaCreacion) }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal para ver la imagen en pantalla completa -->
  <Teleport to="body">
    <div
      v-if="modalImagenAbierto && imagenPrincipal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <!-- Botones de control del modal -->
      <div class="absolute top-4 right-4 z-10 flex gap-4">
        <button
          @click="hacerZoomOut"
          class="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          title="Alejar"
        >
          <PhMagnifyingGlassMinus :size="24" />
        </button>
        <button
          @click="hacerZoomIn"
          class="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          title="Acercar"
        >
          <PhMagnifyingGlassPlus :size="24" />
        </button>
        <button
          @click="cerrarModalImagen"
          class="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-red-500/80 ml-4"
          title="Cerrar"
        >
          <PhX :size="24" />
        </button>
      </div>

      <!-- Imagen a tamaño completo -->
      <div 
        class="flex h-full w-full items-center justify-center overflow-auto p-4"
        @click.self="cerrarModalImagen"
      >
        <img
          :src="imagenPrincipal"
          :style="{ transform: `scale(${zoomNivel})`, transformOrigin: 'center center' }"
          class="max-h-[90vh] max-w-[90vw] h-full w-full object-contain transition-transform duration-300"
          alt="Imagen ampliada"
        />
      </div>

      <!-- Botones de anterior/siguiente -->
      <template v-if="publicacion && publicacion.imagenesUrls.length > 1">
        <button
          @click="imagenAnterior"
          class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 z-10"
          title="Imagen anterior"
        >
          <PhCaretLeft :size="32" weight="bold" />
        </button>
        <button
          @click="siguienteImagen"
          class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70 z-10"
          title="Siguiente imagen"
        >
          <PhCaretRight :size="32" weight="bold" />
        </button>
      </template>
    </div>
  </Teleport>
</template>
