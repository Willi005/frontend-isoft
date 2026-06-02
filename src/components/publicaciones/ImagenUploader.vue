<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PhUploadSimple,
  PhX,
  PhMagnifyingGlassPlus,
  PhMagnifyingGlassMinus,
  PhCaretLeft,
  PhCaretRight
} from '@phosphor-icons/vue'
import { getCloudinaryUrl } from '@/utils/cloudinary'

interface Props {
  imagenesExistentes?: string[]
  maxImagenes?: number
}

const props = withDefaults(defineProps<Props>(), {
  imagenesExistentes: () => [],
  maxImagenes: 5,
})

const emit = defineEmits<{
  (e: 'update:archivos', archivos: File[]): void
  (e: 'update:imagenesAMantener', urls: string[]): void
}>()

const archivosNuevos = ref<File[]>([])
const urlsAMantener = ref<string[]>([...props.imagenesExistentes])
const isDragOver = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const previewsNuevos = computed(() =>
  archivosNuevos.value.map((archivo) => ({
    nombre: archivo.name,
    url: URL.createObjectURL(archivo),
  })),
)

const totalImagenes = computed(
  () => urlsAMantener.value.length + archivosNuevos.value.length,
)

const puedeAgregar = computed(() => totalImagenes.value < props.maxImagenes)

function abrirSelector(): void {
  fileInputRef.value?.click()
}

function onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  agregarArchivos(Array.from(input.files))
  input.value = ''
}

function onDrop(event: DragEvent): void {
  isDragOver.value = false
  if (!event.dataTransfer?.files) return
  const archivos = Array.from(event.dataTransfer.files).filter((f) =>
    f.type.startsWith('image/'),
  )
  agregarArchivos(archivos)
}

function agregarArchivos(nuevos: File[]): void {
  const espacioDisponible = props.maxImagenes - totalImagenes.value
  if (espacioDisponible <= 0) return
  const aAgregar = nuevos.slice(0, espacioDisponible)
  archivosNuevos.value = [...archivosNuevos.value, ...aAgregar]
  emit('update:archivos', archivosNuevos.value)
}

function eliminarNuevo(index: number): void {
  archivosNuevos.value = archivosNuevos.value.filter((_, i) => i !== index)
  emit('update:archivos', archivosNuevos.value)
}

function eliminarExistente(url: string): void {
  urlsAMantener.value = urlsAMantener.value.filter((u) => u !== url)
  emit('update:imagenesAMantener', urlsAMantener.value)
}

// Modal de visualizacion de imagenes

const todasLasImagenes = computed(() => [
  ...urlsAMantener.value.map((url) => getCloudinaryUrl(url)),
  ...previewsNuevos.value.map((p) => p.url)
])

const modalImagenAbierto = ref(false)
const zoomNivel = ref(1)
const imagenSeleccionada = ref(0)

const imagenActualEnModal = computed(() => todasLasImagenes.value[imagenSeleccionada.value] || null)

function abrirModalImagen(index: number) {
  imagenSeleccionada.value = index
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
  if (imagenSeleccionada.value < todasLasImagenes.value.length - 1) {
    imagenSeleccionada.value++
  } else {
    imagenSeleccionada.value = 0
  }
  zoomNivel.value = 1
}

function imagenAnterior() {
  if (imagenSeleccionada.value > 0) {
    imagenSeleccionada.value--
  } else {
    imagenSeleccionada.value = todasLasImagenes.value.length - 1
  }
  zoomNivel.value = 1
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <label class="text-sm font-medium text-gray-700">
      Imagenes
      <span class="ml-1 text-xs font-normal text-gray-400">
        ({{ totalImagenes }}/{{ maxImagenes }})
      </span>
    </label>

    <!-- Zona de drop -->
    <div
      v-if="puedeAgregar"
      :class="[
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors duration-150',
        isDragOver
          ? 'border-[var(--primary)] bg-[var(--primary-light)]'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
      ]"
      role="button"
      tabindex="0"
      aria-label="Subir imagenes"
      @click="abrirSelector"
      @keydown.enter="abrirSelector"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="onDrop"
    >
      <PhUploadSimple
        :size="28"
        weight="regular"
        class="text-gray-400"
      />
      <p class="text-sm text-gray-500">
        Arrastra imagenes o haz clic para seleccionar
      </p>
      <p class="text-xs text-gray-400">
        PNG, JPG o WEBP
      </p>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      multiple
      class="hidden"
      @change="onFileChange"
    />

    <!-- Previsualizacion de imagenes existentes -->
    <div
      v-if="urlsAMantener.length > 0 || previewsNuevos.length > 0"
      class="grid grid-cols-4 gap-2 sm:grid-cols-5"
    >
      <!-- Existentes -->
      <button
        v-for="(url, index) in urlsAMantener"
        :key="'existente-' + url"
        type="button"
        class="group relative aspect-square overflow-hidden rounded-md border-2 border-transparent bg-gray-100 opacity-80 transition-all duration-200 hover:border-gray-300 hover:opacity-100 hover:shadow-sm"
        @click="abrirModalImagen(index)"
      >
        <img
          :src="getCloudinaryUrl(url)"
          alt="Imagen actual"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 flex items-start justify-end bg-black/0 p-1 transition-colors duration-150 group-hover:bg-black/30">
          <button
            type="button"
            class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity duration-150 hover:bg-red-600 group-hover:opacity-100"
            aria-label="Eliminar imagen"
            @click.stop="eliminarExistente(url)"
          >
            <PhX :size="12" weight="bold" />
          </button>
        </div>
      </button>

      <!-- Nuevas -->
      <button
        v-for="(preview, index) in previewsNuevos"
        :key="'nuevo-' + index"
        type="button"
        class="group relative aspect-square overflow-hidden rounded-md border-2 border-transparent bg-gray-100 opacity-80 transition-all duration-200 hover:border-gray-300 hover:opacity-100 hover:shadow-sm"
        @click="abrirModalImagen(urlsAMantener.length + index)"
      >
        <img
          :src="preview.url"
          :alt="preview.nombre"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 flex items-start justify-end bg-black/0 p-1 transition-colors duration-150 group-hover:bg-black/30">
          <button
            type="button"
            class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity duration-150 hover:bg-red-600 group-hover:opacity-100"
            aria-label="Eliminar imagen"
            @click.stop="eliminarNuevo(index)"
          >
            <PhX :size="12" weight="bold" />
          </button>
        </div>
      </button>
    </div>
  </div>

  <!-- Modal para ver la imagen en pantalla completa -->
  <Teleport to="body">
    <div
      v-if="modalImagenAbierto && imagenActualEnModal"
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
          class="ml-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-red-500/80"
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
          :src="imagenActualEnModal"
          :style="{ transform: `scale(${zoomNivel})`, transformOrigin: 'center center' }"
          class="max-h-[90vh] max-w-[90vw] h-full w-full object-contain transition-transform duration-300"
          alt="Imagen ampliada"
        />
      </div>

      <!-- Botones de anterior/siguiente -->
      <template v-if="todasLasImagenes.length > 1">
        <button
          @click="imagenAnterior"
          class="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
          title="Imagen anterior"
        >
          <PhCaretLeft :size="32" weight="bold" />
        </button>
        <button
          @click="siguienteImagen"
          class="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
          title="Siguiente imagen"
        >
          <PhCaretRight :size="32" weight="bold" />
        </button>
      </template>
    </div>
  </Teleport>
</template>
