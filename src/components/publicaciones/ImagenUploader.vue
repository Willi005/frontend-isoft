<script setup lang="ts">
import { ref, computed } from 'vue'
import { PhUploadSimple, PhX } from '@phosphor-icons/vue'

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
      <div
        v-for="url in urlsAMantener"
        :key="'existente-' + url"
        class="group relative aspect-square overflow-hidden rounded-md border border-gray-200"
      >
        <img
          :src="url"
          alt="Imagen existente"
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
      </div>

      <!-- Nuevas -->
      <div
        v-for="(preview, index) in previewsNuevos"
        :key="'nuevo-' + index"
        class="group relative aspect-square overflow-hidden rounded-md border border-dashed border-[var(--primary)]"
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
      </div>
    </div>
  </div>
</template>
