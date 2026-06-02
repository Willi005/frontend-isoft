<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import ImagenUploader from './ImagenUploader.vue'
import type {
  CrearPublicacionData,
  EditarPublicacionData,
  PublicacionDetalle,
} from '@/utils/mockStore'
import { EstadoCondicionPublicacion } from '@/utils/mockStore'
import { CONDICION_OPCIONES } from '@/utils/useCondicionLabels'
import { catalogoFacade, cuentasFacade } from '@/utils/mockStore'

// Props y emits

interface Props {
  modo: 'crear' | 'editar'
  datosIniciales?: PublicacionDetalle
  cargando?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  datosIniciales: undefined,
  cargando: false,
})

const emit = defineEmits<{
  (e: 'submit', payload: {
    datos: CrearPublicacionData | EditarPublicacionData
    archivos: File[]
  }): void
  (e: 'cancelar'): void
}>()

// Datos simulados (mock) — no se muestran en el formulario

const productoSeleccionado = ref<{ id: number; nombre: string } | null>(
  props.modo === 'editar' ? { id: 1, nombre: 'Producto de ejemplo (simulado)' } : null
)
const busquedaProducto = ref('')
const resultadosBusqueda = computed(() => {
  return catalogoFacade.buscarProductos(busquedaProducto.value)
})

function seleccionarProducto(prod: { id: number; nombre: string }) {
  productoSeleccionado.value = prod
  busquedaProducto.value = ''
  delete errores.producto
}

function cambiarProducto() {
  productoSeleccionado.value = null
}

// Estado local del formulario

const form = reactive({
  titulo: '',
  descripcion: '',
  precio: null as number | null,
  stock: null as number | null,
  condicion: '' as EstadoCondicionPublicacion | '',
})

const condicionAbierta = ref(false)
const condicionContainer = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (condicionAbierta.value && condicionContainer.value && !condicionContainer.value.contains(event.target as Node)) {
    condicionAbierta.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const archivosNuevos = reactive<{ lista: File[] }>({ lista: [] })
const imagenesAMantener = reactive<{ lista: string[] }>({ lista: [] })
const errores = reactive<Record<string, string>>({})



// Contadores de caracteres

const tituloCount = computed(() => form.titulo.length)
const descripcionCount = computed(() => form.descripcion.length)

// Inicializacion con datos existentes (modo edicion)

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

// Especificaciones simuladas del producto de catalogo

const especificacionesMock = ref([
  { nombre: 'Almacenamiento', valor: '128 GB' },
  { nombre: 'Color', valor: 'Negro' },
  { nombre: 'RAM', valor: '6 GB' },
])

// Validacion

function validar(): boolean {
  // Reiniciar errores
  Object.keys(errores).forEach((k) => delete errores[k])

  if (!form.titulo.trim()) {
    errores.titulo = 'El título es obligatorio'
  } else if (form.titulo.length > 30) {
    errores.titulo = 'El título no puede superar los 30 caracteres'
  }

  if (!form.descripcion.trim()) {
    errores.descripcion = 'La descripción es obligatoria'
  } else if (form.descripcion.length > 2000) {
    errores.descripcion = 'La descripción no puede superar los 2000 caracteres'
  }

  if (form.precio === null || form.precio <= 0) {
    errores.precio = 'El precio debe ser mayor a 0'
  }

  if (!form.condicion) {
    errores.condicion = 'La condición es obligatoria'
  }

  if (props.modo === 'crear') {
    if (form.stock === null || form.stock < 1) {
      errores.stock = 'El stock debe ser al menos 1'
    }
    if (!productoSeleccionado.value) {
      errores.producto = 'Debe seleccionar un producto del catálogo'
    }
  }

  return Object.keys(errores).length === 0
}

// Guardado de datos

function onSubmit(): void {
  if (!validar()) return

  if (props.modo === 'crear') {
    const datos: CrearPublicacionData = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      precio: form.precio!,
      stock: form.stock!,
      condicion: form.condicion as EstadoCondicionPublicacion,
      productoCatalogoId: productoSeleccionado.value!.id,
      vendedorId: cuentasFacade.obtenerUsuarioActual().id,
    }
    emit('submit', { datos, archivos: archivosNuevos.lista })
  } else {
    const datos: EditarPublicacionData = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      precio: form.precio!,
      condicion: form.condicion as EstadoCondicionPublicacion,
      imagenesAMantener: imagenesAMantener.lista,
    }
    emit('submit', { datos, archivos: archivosNuevos.lista })
  }
}

// Handlers de ImagenUploader

function onArchivosUpdate(archivos: File[]): void {
  archivosNuevos.lista = archivos
}

function onImagenesAMantenerUpdate(urls: string[]): void {
  imagenesAMantener.lista = urls
}
</script>

<template>
  <form
    class="flex flex-col gap-0 pb-24"
    novalidate
    @submit.prevent="onSubmit"
  >
    <!-- Layout de 2 columnas (Figma) -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">

      <!-- ==================== COLUMNA IZQUIERDA ==================== -->
      <div class="flex flex-col gap-5">

        <!-- Seccion: Catalogo (producto simulado) -->
        <div class="rounded border border-gray-200 bg-white">
          <div class="border-b border-gray-200 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">Producto del catálogo</h2>
            <p class="mt-0.5 text-xs text-gray-500">
              El producto se asigna automáticamente (simulado)
            </p>
          </div>
          <div class="px-6 py-4">
            <!-- Buscar Producto -->
            <div v-if="!productoSeleccionado" class="relative">
              <input
                v-model="busquedaProducto"
                type="text"
                placeholder="Buscar producto por nombre..."
                class="w-full rounded border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                :class="{ 'border-red-400': errores.producto }"
              />
              <p v-if="errores.producto" class="mt-1 text-xs text-red-500">{{ errores.producto }}</p>
              
              <!-- Dropdown resultados -->
              <div
                v-if="resultadosBusqueda.length > 0"
                class="absolute left-0 right-0 top-full mt-1 z-10 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
              >
                <div class="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                  Resultados encontrados
                </div>
                <button
                  v-for="res in resultadosBusqueda"
                  :key="res.id"
                  type="button"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  @click="seleccionarProducto(res)"
                >
                  {{ res.nombre }}
                </button>
              </div>
            </div>

            <!-- Item seleccionado mock -->
            <div v-else class="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 px-4 py-3">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-800">{{ productoSeleccionado.nombre }}</p>
                <p class="text-xs text-gray-400">ID: {{ productoSeleccionado.id }}</p>
              </div>
              <button type="button" class="text-xs font-semibold text-[var(--primary)] hover:underline" @click="cambiarProducto">
                Cambiar
              </button>
            </div>
          </div>
        </div>

        <!-- Seccion: Detalles -->
        <div class="rounded border border-gray-200 bg-white">
          <div class="border-b border-gray-200 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">Detalles</h2>
          </div>
          <div class="flex flex-col gap-4 px-6 py-5">
            <!-- Precio y Stock -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Precio formateado -->
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

            <!-- Estado del producto (nuevo, usado, etc.) -->
            <div class="flex flex-col gap-1">
              <label for="pub-condicion" class="text-sm font-medium text-gray-700">
                Condición del artículo
              </label>
              <div class="relative" ref="condicionContainer">
                <button
                  type="button"
                  id="pub-condicion"
                  class="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-3 py-2.5 text-left text-sm text-gray-900 outline-none transition-colors duration-150 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                  :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errores.condicion }"
                  @click="condicionAbierta = !condicionAbierta"
                >
                  <span v-if="form.condicion">{{ CONDICION_OPCIONES.find(o => o.value === form.condicion)?.label }}</span>
                  <span v-else class="text-gray-400">Seleccionar condición</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': condicionAbierta }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                <!-- Menu Dropdown -->
                <div
                  v-if="condicionAbierta"
                  class="absolute left-0 right-0 top-full mt-1 z-10 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                >
                  <button
                    v-for="opt in CONDICION_OPCIONES"
                    :key="opt.value"
                    type="button"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    :class="{ 'bg-gray-50 font-semibold': form.condicion === opt.value }"
                    @click="form.condicion = opt.value; condicionAbierta = false"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
              <p v-if="errores.condicion" class="text-xs text-red-500">
                {{ errores.condicion }}
              </p>
            </div>
          </div>
        </div>

        <!-- Seccion: Contenido (titulo + descripcion) -->
        <div class="rounded border border-gray-200 bg-white">
          <div class="border-b border-gray-200 px-6 py-4">
            <h2 class="text-base font-semibold text-gray-900">Contenido</h2>
          </div>
          <div class="flex flex-col gap-4 px-6 py-5">
            <!-- Título de la publicación -->
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

            <!-- Texto descriptivo del producto -->
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
        <div class="rounded border border-gray-200 bg-white">
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
        <div class="rounded border border-gray-200 bg-white">
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
            <template v-if="productoSeleccionado">
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
            </template>
            <div v-else class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p class="text-sm font-medium text-gray-600">Aún no hay especificaciones</p>
              <p class="text-xs text-gray-500">Selecciona un producto del catálogo para cargar sus características.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== FOOTER ACCIONES ==================== -->
    <div class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
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
