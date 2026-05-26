<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseList from '../components/ui/BaseList.vue'
import BaseModal from '../components/ui/BaseModal.vue'

const textVal     = ref('')
const numberVal   = ref('')
const passwordVal = ref('')
const errorVal    = ref('usuario@ufrontera.cl')
const disableVal = ref('No editable')
const productForm = ref({
    nombre: '',
    precio: 67,
    categoria: '',
    stock: 1
})

const isModalOpen    = ref(false)
const isLgModalOpen  = ref(false)

const listItems = [
  { id: 1, title: 'MacBook Pro 14" M3', subtitle: 'Ingeniería Informática', meta: '$1.200.000', badge: 'Nuevo', badgeVariant: 'success' as const, image: 'https://placehold.co/40x40/1a4d8f/ffffff?text=M' },
  { id: 2, title: 'Canon EOS R50', subtitle: 'Diseño Gráfico', meta: '$680.000', badge: 'Usado', badgeVariant: 'warning' as const, image: 'https://placehold.co/40x40/006341/ffffff?text=C' },
  { id: 3, title: 'Calculadora Casio fx-991', subtitle: 'Matemáticas', meta: '$25.000', badge: 'Nuevo', badgeVariant: 'success' as const, image: 'https://placehold.co/40x40/374151/ffffff?text=C' },
]

const gridItems = [
  { id: 1, title: 'iPhone 14 Plus', subtitle: 'Electrónica', meta: '$720.000', badge: 'Usado', badgeVariant: 'warning' as const, image: 'https://placehold.co/200x140/1a4d8f/ffffff?text=📱' },
  { id: 2, title: 'Bicicleta de montaña', subtitle: 'Vehículos', meta: '$280.000', badge: 'Usado', badgeVariant: 'warning' as const, image: 'https://placehold.co/200x140/006341/ffffff?text=🚲' },
  { id: 3, title: 'Libro: Clean Code', subtitle: 'Libros', meta: '$15.000', badge: 'Nuevo', badgeVariant: 'success' as const, image: 'https://placehold.co/200x140/374151/ffffff?text=📘' },
  { id: 4, title: 'Teclado mecánico', subtitle: 'Electrónica', meta: '$85.000', badge: 'Nuevo', badgeVariant: 'success' as const, image: 'https://placehold.co/200x140/4b5563/ffffff?text=⌨️' },
]

const rankingItems = [
  { id: 1, title: 'Laptop Lenovo ThinkPad', subtitle: 'Electrónica', meta: '$950.000' },
  { id: 2, title: 'Mesa de estudio', subtitle: 'Muebles', meta: '$120.000' },
  { id: 3, title: 'Auriculares Sony WH-1000XM5', subtitle: 'Electrónica', meta: '$350.000' },
  { id: 4, title: 'Manual de Anatomía', subtitle: 'Libros', meta: '$22.000' },
  { id: 5, title: 'Silla ergonómica', subtitle: 'Muebles', meta: '$180.000' },
]
</script>

<template>
  <div class="gallery">
    <h1 class="gallery__title">Componentes UFRO Market</h1>
    <p class="gallery__desc">Vista de galería para probar y visualizar todos los componentes del sistema.</p>

    <!-- ── BUTTONS ── -->
    <section class="section">
      <h2 class="section__title">BaseButton — Variantes</h2>
      <div class="row row--wrap">
        <BaseButton variant="primary">Primario</BaseButton>
        <BaseButton variant="secondary">Secundario</BaseButton>
        <BaseButton variant="outline">Contorno</BaseButton>
        <BaseButton variant="success">Éxito</BaseButton>
        <BaseButton variant="danger">Peligro</BaseButton>
        <BaseButton variant="primary" disabled>Deshabilitado</BaseButton>
      </div>
      <h3 class="section__subtitle">Tamaños</h3>
      <div class="row row--wrap row--center">
        <BaseButton variant="primary" size="sm">Pequeño</BaseButton>
        <BaseButton variant="primary" size="md">Mediano</BaseButton>
        <BaseButton variant="primary" size="lg">Grande</BaseButton>
      </div>
      <h3 class="section__subtitle">Ancho completo</h3>
      <BaseButton variant="primary" full-width>Ancho completo</BaseButton>
    </section>

    <!-- ── INPUTS ── -->
    <section class="section">
      <h2 class="section__title">BaseInput — Tipos</h2>
      <div class="grid-2">
        <BaseInput v-model="textVal" label="Texto" type="text" placeholder="Escribe algo..." hint="Pista de ayuda opcional" />
        <BaseInput v-model="numberVal" label="Número" type="number" placeholder="0" />
        <BaseInput v-model="passwordVal" label="Contraseña" type="password" placeholder="••••••••" />
        <BaseInput v-model="errorVal" label="Con error" type="email" placeholder="email@ufrontera.cl" error="Este correo ya está registrado." />
        <BaseInput v-model="disableVal" label="Deshabilitado" type="text" placeholder="No editable" disabled />
      </div>
    </section>

    <!-- ── LISTS ── -->
    <section class="section">
      <h2 class="section__title">BaseList — Tipo: list</h2>
      <BaseList type="list" :items="listItems" />

      <h2 class="section__title" style="margin-top:var(--space-8)">BaseList — Tipo: grid</h2>
      <BaseList type="grid" :items="gridItems" />

      <h2 class="section__title" style="margin-top:var(--space-8)">BaseList — Tipo: descending</h2>
      <BaseList type="descending" :items="rankingItems" />

      <h2 class="section__title" style="margin-top:var(--space-8)">BaseList — Sin elementos</h2>
      <BaseList type="list" :items="[]" empty-text="No hay publicaciones que coincidan con tu búsqueda." />
    </section>

    <!-- ── MODALS ── -->
    <section class="section">
      <h2 class="section__title">BaseModal</h2>
      <div class="row">
        <BaseButton variant="primary" @click="isModalOpen = true">Abrir modal (md)</BaseButton>
        <BaseButton variant="outline" @click="isLgModalOpen = true">Abrir modal (lg)</BaseButton>
      </div>
    </section>
  </div>

  <!-- Modal MD -->
  <BaseModal :is-open="isModalOpen" title="Confirmar publicación" size="md" @close="isModalOpen = false">
    <template #body>
      <p style="color: var(--gray-600); font-size: var(--font-size-sm); line-height: 1.6;">
        ¿Estás seguro de que deseas publicar este artículo en UFRO Market?
        Una vez publicado será visible para todos los usuarios de la plataforma.
      </p>
      <div style="margin-top: var(--space-4);">
        <BaseInput v-model="textVal" label="Precio de venta (CLP)" type="number" placeholder="0" />
      </div>
    </template>
    <template #footer>
      <BaseButton variant="outline" @click="isModalOpen = false">Cancelar</BaseButton>
      <BaseButton variant="primary" @click="isModalOpen = false">Publicar ahora</BaseButton>
    </template>
  </BaseModal>

  <!-- Modal LG -->
  <BaseModal :is-open="isLgModalOpen" title="Detalles del producto" size="lg" @close="isLgModalOpen = false">
    <template #body>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
        <BaseInput 
          v-model="productForm.nombre" 
          label="Nombre del producto" 
          placeholder="Ej: MacBook Pro M3" 
        />
        <BaseInput 
          v-model="productForm.precio" 
          label="Precio (CLP)" 
          type="number" placeholder="0" 
        />
        <BaseInput 
          v-model="productForm.categoria" 
          label="Categoría" 
          placeholder="Electrónica" 
        />
        <BaseInput 
          v-model="productForm.stock" 
          label="Stock disponible" 
          type="number" placeholder="1" 
        />
      </div>
      <div style="margin-top: var(--space-4);">
        <BaseList type="list" :items="listItems.slice(0,2)" />
      </div>
    </template>
    <template #footer>
      <BaseButton variant="danger" size="sm" @click="isLgModalOpen = false">Eliminar</BaseButton>
      <BaseButton variant="outline" @click="isLgModalOpen = false">Cancelar</BaseButton>
      <BaseButton variant="primary" @click="isLgModalOpen = false">Guardar cambios</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.gallery {
  padding: var(--space-6);
  max-width: 900px;
}
.gallery__title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}
.gallery__desc {
  font-size: var(--font-size-sm);
  color: var(--gray-500);
  margin-bottom: var(--space-8);
}
.section { margin-bottom: var(--space-10); }
.section__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--primary-light);
}
.section__subtitle {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--gray-600);
  margin: var(--space-5) 0 var(--space-3);
}
.row { display: flex; gap: var(--space-3); align-items: center; }
.row--wrap { flex-wrap: wrap; }
.row--center { align-items: center; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
@media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }
</style>