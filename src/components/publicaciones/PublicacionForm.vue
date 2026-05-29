<script setup lang="ts">
import { reactive, computed, watch, ref } from 'vue'
import ImagenUploader from './ImagenUploader.vue'
import type {
  CrearPublicacionRequest,
  EditarPublicacionRequest,
  PublicacionDetalleResponse,
} from '@/types/publicaciones'
import { EstadoCondicionPublicacion } from '@/types/publicaciones'

// ---------------------------------------------------------------------------
// Props y emits
// ---------------------------------------------------------------------------

interface Props {
  modo: 'crear' | 'editar'
  datosIniciales?: PublicacionDetalleResponse
  cargando?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  datosIniciales: undefined,
  cargando: false,
})

const emit = defineEmits<{
  (e: 'submit', payload: {
    datos: CrearPublicacionRequest | EditarPublicacionRequest
    archivos: File[]
  }): void
  (e: 'cancelar'): void
}>()

// ---------------------------------------------------------------------------
// Datos simulados (mock) — no se muestran en el formulario
// ---------------------------------------------------------------------------

const MOCK_VENDEDOR_ID = 1
const MOCK_PRODUCTO_CATALOGO_ID = 1
const MOCK_PRODUCTO_NOMBRE = 'Producto de ejemplo (simulado)'

// ---------------------------------------------------------------------------
// Estado del formulario
// ---------------------------------------------------------------------------

const form = reactive({
  titulo: '',
  descripcion: '',
  precio: null as number | null,
  stock: null as number | null,
  condicion: '' as EstadoCondicionPublicacion | '',
})

const archivosNuevos = reactive<{ lista: File[] }>({ lista: [] })
const imagenesAMantener = reactive<{ lista: string[] }>({ lista: [] })
const errores = reactive<Record<string, string>>({})

// ---------------------------------------------------------------------------
// Opciones de condicion
// ---------------------------------------------------------------------------

const CONDICION_OPCIONES: { value: EstadoCondicionPublicacion; label: string }[] = [
  { value: EstadoCondicionPublicacion.NUEVO, label: 'Nuevo' },
  { value: EstadoCondicionPublicacion.COMO_NUEVO, label: 'Como nuevo' },
  { value: EstadoCondicionPublicacion.BUEN_ESTADO, label: 'Buen estado' },
  { value: EstadoCondicionPublicacion.ACEPTABLE, label: 'Aceptable' },
]

// ---------------------------------------------------------------------------
// Contadores de caracteres
// ---------------------------------------------------------------------------

const tituloCount = computed(() => form.titulo.length)
const descripcionCount = computed(() => form.descripcion.length)

// ---------------------------------------------------------------------------
// Inicializacion con datos existentes (modo edicion)
// ---------------------------------------------------------------------------

watch(
  () => props.datosIniciales,
  (datos) => {
    if (datos && props.modo === 'editar') {
      form.titulo = datos.titulo
      form.descripcion = datos.descripcion
      form.precio = datos.precio
      form.condicion = datos.condicion
      imagenesAMantener.lista = [...datos.imagenesUrls]
    }
  },
  { immediate: true },
)

// ---------------------------------------------------------------------------
// Especificaciones simuladas del producto de catalogo
// ---------------------------------------------------------------------------

const especificacionesMock = ref([
  { nombre: 'Almacenamiento', valor: '128 GB' },
  { nombre: 'Color', valor: 'Negro' },
  { nombre: 'RAM', valor: '6 GB' },
])

// ---------------------------------------------------------------------------
// Validacion
// ---------------------------------------------------------------------------

function validar(): boolean {
  // Reiniciar errores
  Object.keys(errores).forEach((k) => delete errores[k])

  if (!form.titulo.trim()) {
    errores.titulo = 'El titulo es obligatorio'
  } else if (form.titulo.length > 30) {
    errores.titulo = 'El titulo no puede superar los 30 caracteres'
  }

  if (!form.descripcion.trim()) {
    errores.descripcion = 'La descripcion es obligatoria'
  } else if (form.descripcion.length > 2000) {
    errores.descripcion = 'La descripcion no puede superar los 2000 caracteres'
  }

  if (form.precio === null || form.precio <= 0) {
    errores.precio = 'El precio debe ser mayor a 0'
  }

  if (!form.condicion) {
    errores.condicion = 'La condicion es obligatoria'
  }

  if (props.modo === 'crear') {
    if (form.stock === null || form.stock < 1) {
      errores.stock = 'El stock debe ser al menos 1'
    }
  }

  return Object.keys(errores).length === 0
}

// ---------------------------------------------------------------------------
// Submit
// ---------------------------------------------------------------------------

function onSubmit(): void {
  if (!validar()) return

  if (props.modo === 'crear') {
    const datos: CrearPublicacionRequest = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      precio: form.precio!,
      stock: form.stock!,
      condicion: form.condicion as EstadoCondicionPublicacion,
      productoCatalogoId: MOCK_PRODUCTO_CATALOGO_ID,
      vendedorId: MOCK_VENDEDOR_ID,
    }
    emit('submit', { datos, archivos: archivosNuevos.lista })
  } else {
    const datos: EditarPublicacionRequest = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      precio: form.precio!,
      condicion: form.condicion as EstadoCondicionPublicacion,
      imagenesAMantener: imagenesAMantener.lista,
    }
    emit('submit', { datos, archivos: archivosNuevos.lista })
  }
}

// ---------------------------------------------------------------------------
// Handlers de ImagenUploader
// ---------------------------------------------------------------------------

function onArchivosUpdate(archivos: File[]): void {
  archivosNuevos.lista = archivos
}

function onImagenesAMantenerUpdate(urls: string[]): void {
  imagenesAMantener.lista = urls
}
</script>

<template>
  <form
    class="flex flex-col gap-0"
    novalidate
    @submit.prevent="onSubmit"
  >
    <!-- Layout de 2 columnas (Figma) -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">

      <!-- ==================== COLUMNA IZQUIERDA ==================== -->
      <div class="flex flex-col gap-5">

        <!-- Seccion: Catalogo (producto simulado) -->
        <div class="rounded border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">Producto del catálogo</h2>
            <p class="mt-0.5 text-xs text-gray-500">
              El producto se asigna automáticamente (simulado)
            </p>
          </div>
          <div class="px-6 py-4">
            <!-- Item seleccionado mock -->
            <div class="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 px-4 py-3">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-800">{{ MOCK_PRODUCTO_NOMBRE }}</p>
                <p class="text-xs text-gray-400">ID: {{ MOCK_PRODUCTO_CATALOGO_ID }}</p>
              </div>
              <span class="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Seleccionado
              </span>
            </div>
          </div>
        </div>

        <!-- Seccion: Detalles -->
        <div class="rounded border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">Detalles</h2>
          </div>
          <div class="flex flex-col gap-4 px-6 py-5">
            <!-- Precio y Stock -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Precio -->
              <div class="flex flex-col gap-1">
                <label for="pub-precio" class="text-sm font-medium text-gray-700">
                  Precio (CLP)
                </label>
                <input
                  id="pub-precio"
                  v-model.number="form.precio"
                  type="number"
                  min="1"
                  placeholder="0"
                  class="w-full rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                  :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errores.precio }"
                />
                <p v-if="errores.precio" class="text-xs text-red-500">
                  {{ errores.precio }}
                </p>
              </div>

              <!-- Stock (solo en creacion) -->
              <div v-if="modo === 'crear'" class="flex flex-col gap-1">
                <label for="pub-stock" class="text-sm font-medium text-gray-700">
                  Stock inicial
                </label>
                <input
                  id="pub-stock"
                  v-model.number="form.stock"
                  type="number"
                  min="1"
                  placeholder="1"
                  class="w-full rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                  :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errores.stock }"
                />
                <p v-if="errores.stock" class="text-xs text-red-500">
                  {{ errores.stock }}
                </p>
              </div>
            </div>

            <!-- Condicion -->
            <div class="flex flex-col gap-1">
              <label for="pub-condicion" class="text-sm font-medium text-gray-700">
                Condición del artículo
              </label>
              <select
                id="pub-condicion"
                v-model="form.condicion"
                class="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errores.condicion }"
              >
                <option value="" disabled>Seleccionar condición</option>
                <option
                  v-for="opt in CONDICION_OPCIONES"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
              <p v-if="errores.condicion" class="text-xs text-red-500">
                {{ errores.condicion }}
              </p>
            </div>
          </div>
        </div>

        <!-- Seccion: Contenido (titulo + descripcion) -->
        <div class="rounded border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">Contenido</h2>
          </div>
          <div class="flex flex-col gap-4 px-6 py-5">
            <!-- Titulo -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <label for="pub-titulo" class="text-sm font-medium text-gray-700">
                  Título
                </label>
                <span
                  :class="[
                    'text-xs',
                    tituloCount > 30 ? 'text-red-500' : 'text-gray-400',
                  ]"
                >
                  {{ tituloCount }}/30
                </span>
              </div>
              <input
                id="pub-titulo"
                v-model="form.titulo"
                type="text"
                maxlength="30"
                placeholder="Nombre del producto"
                class="w-full rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errores.titulo }"
              />
              <p v-if="errores.titulo" class="text-xs text-red-500">
                {{ errores.titulo }}
              </p>
            </div>

            <!-- Descripcion -->
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <label for="pub-descripcion" class="text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <span
                  :class="[
                    'text-xs',
                    descripcionCount > 2000 ? 'text-red-500' : 'text-gray-400',
                  ]"
                >
                  {{ descripcionCount }}/2000
                </span>
              </div>
              <textarea
                id="pub-descripcion"
                v-model="form.descripcion"
                maxlength="2000"
                rows="5"
                placeholder="Describe el producto con detalle..."
                class="w-full resize-y rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errores.descripcion }"
              />
              <p v-if="errores.descripcion" class="text-xs text-red-500">
                {{ errores.descripcion }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== COLUMNA DERECHA ==================== -->
      <div class="flex flex-col gap-5">

        <!-- Seccion: Media / Imagenes -->
        <div class="rounded border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">Imágenes</h2>
            <p class="mt-0.5 text-xs text-gray-500">
              Agrega hasta 5 imágenes de tu producto
            </p>
          </div>
          <div class="px-6 py-5">
            <ImagenUploader
              :imagenes-existentes="modo === 'editar' && datosIniciales ? datosIniciales.imagenesUrls : []"
              :max-imagenes="5"
              @update:archivos="onArchivosUpdate"
              @update:imagenes-a-mantener="onImagenesAMantenerUpdate"
            />
          </div>
        </div>

        <!-- Seccion: Especificaciones (placeholder simulado) -->
        <div class="rounded border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-semibold text-gray-900">Especificaciones</h2>
              <span class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                Simulado
              </span>
            </div>
            <p class="mt-0.5 text-xs text-gray-500">
              Campos dinámicos del producto del catálogo
            </p>
          </div>
          <div class="flex flex-col gap-3 px-6 py-5">
            <div
              v-for="spec in especificacionesMock"
              :key="spec.nombre"
              class="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-4 py-2.5"
            >
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span class="text-sm font-medium text-gray-700">{{ spec.nombre }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ spec.valor }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== FOOTER ACCIONES ==================== -->
    <div class="sticky bottom-0 -mx-6 mt-6 flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded px-5 py-2.5 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50"
        :disabled="cargando"
        @click="emit('cancelar')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="inline-flex items-center justify-center rounded bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="cargando"
      >
        <svg
          v-if="cargando"
          class="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ modo === 'crear' ? 'Publicar' : 'Guardar cambios' }}
      </button>
    </div>
  </form>
</template>
