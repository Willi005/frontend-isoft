<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'apply', filters: Filters): void }>()

interface Filters {
  categories: string[]
  priceMin: number | null
  priceMax: number | null
  condition: string
}

const categories = [
  { value: 'vehiculos',     label: 'Vehículos' },
  { value: 'electronica',   label: 'Electrónica' },
  { value: 'juguetes',      label: 'Juguetes y juegos' },
  { value: 'ropa',          label: 'Ropa y accesorios' },
  { value: 'libros',        label: 'Libros' },
  { value: 'servicios',     label: 'Servicios' },
  { value: 'otros',         label: 'Otros' },
]

const selectedCategories = ref<string[]>([])
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const condition = ref<string>('any')

const isDirty = ref(false)

const markDirty = () => { isDirty.value = true }

const apply = () => {
  emit('apply', {
    categories: selectedCategories.value,
    priceMin: priceMin.value,
    priceMax: priceMax.value,
    condition: condition.value,
  })
  isDirty.value = false
}

const reset = () => {
  selectedCategories.value = []
  priceMin.value = null
  priceMax.value = null
  condition.value = 'any'
  isDirty.value = false
  emit('apply', { categories: [], priceMin: null, priceMax: null, condition: 'any' })
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <h2 class="sidebar__heading">Filtros</h2>
      <button v-if="isDirty" class="sidebar__reset" @click="reset">Limpiar</button>
    </div>

    <!-- Categories -->
    <div class="sidebar__section">
      <h3 class="sidebar__section-title">Categoría</h3>
      <div class="sidebar__options">
        <label v-for="cat in categories" :key="cat.value" class="sidebar__checkbox-label">
          <input
            v-model="selectedCategories"
            type="checkbox"
            :value="cat.value"
            class="sidebar__checkbox"
            @change="markDirty"
          />
          <span class="sidebar__checkbox-custom"></span>
          <span class="sidebar__option-text">{{ cat.label }}</span>
        </label>
      </div>
    </div>

    <!-- Price -->
    <div class="sidebar__section">
      <h3 class="sidebar__section-title">Precio (CLP)</h3>
      <div class="sidebar__price-row">
        <div class="sidebar__price-field">
          <label for="price-min" class="sidebar__price-label">Mín</label>
          <input
            id="price-min"
            v-model.number="priceMin"
            type="number"
            class="sidebar__price-input"
            placeholder="0"
            min="0"
            @input="markDirty"
          />
        </div>
        <span class="sidebar__price-sep">—</span>
        <div class="sidebar__price-field">
          <label for="price-max" class="sidebar__price-label">Máx</label>
          <input
            id="price-max"
            v-model.number="priceMax"
            type="number"
            class="sidebar__price-input"
            placeholder="∞"
            min="0"
            @input="markDirty"
          />
        </div>
      </div>
    </div>

    <!-- Condition -->
    <div class="sidebar__section">
      <h3 class="sidebar__section-title">Condición</h3>
      <div class="sidebar__options">
        <label v-for="opt in [{ value: 'any', label: 'Cualquiera' }, { value: 'new', label: 'Nuevo' }, { value: 'used', label: 'Usado' }]" :key="opt.value" class="sidebar__radio-label">
          <input v-model="condition" type="radio" :value="opt.value" class="sidebar__radio" @change="markDirty" />
          <span class="sidebar__radio-custom"></span>
          <span class="sidebar__option-text">{{ opt.label }}</span>
        </label>
      </div>
    </div>

    <button class="sidebar__apply" :class="{ 'sidebar__apply--active': isDirty }" :disabled="!isDirty" @click="apply">
      Aplicar Filtros
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0; 
  background: var(--white);
  border: var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  position: sticky;
  top: calc(var(--topbar-height) + var(--space-4));
  max-height: calc(100vh - var(--topbar-height) - (var(--space-4) * 2));
  overflow-y: auto;
}
.sidebar::-webkit-scrollbar {
  width: 4px;
}
.sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar::-webkit-scrollbar-thumb {
  background: var(--gray-100);
  border-radius: var(--radius-full);
}
.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--gray-200);
}
.sidebar__header { display: flex; align-items: center; justify-content: space-between; }
.sidebar__heading { font-size: var(--font-size-md); font-weight: 700; color: var(--gray-900); }
.sidebar__reset { background: none; border: none; font-size: var(--font-size-xs); color: var(--primary); cursor: pointer; font-weight: 500; }
.sidebar__reset:hover { text-decoration: underline; }

.sidebar__section { display: flex; flex-direction: column; gap: var(--space-3); }
.sidebar__section-title { font-size: var(--font-size-sm); font-weight: 600; color: var(--gray-700); border-bottom: var(--border); padding-bottom: var(--space-2); }

.sidebar__options { display: flex; flex-direction: column; gap: var(--space-2); }

/* Checkbox */
.sidebar__checkbox-label, .sidebar__radio-label {
  display: flex; align-items: center; gap: var(--space-3);
  cursor: pointer; font-size: var(--font-size-sm); color: var(--gray-700);
  padding: var(--space-1) 0;
}
.sidebar__checkbox-label:hover .sidebar__checkbox-custom,
.sidebar__radio-label:hover .sidebar__radio-custom { border-color: var(--primary); }

.sidebar__checkbox { position: absolute; opacity: 0; width: 0; height: 0; }
.sidebar__checkbox-custom {
  width: 18px; height: 18px; flex-shrink: 0;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}
.sidebar__checkbox:checked + .sidebar__checkbox-custom {
  background: var(--primary); border-color: var(--primary);
}
.sidebar__checkbox:checked + .sidebar__checkbox-custom::after {
  content: '';
  width: 9px; height: 5px;
  border: 2px solid var(--white); border-top: none; border-right: none;
  transform: rotate(-45deg) translateY(-1px);
  display: block;
}
.sidebar__checkbox:focus-visible + .sidebar__checkbox-custom { outline: 2px solid var(--primary); outline-offset: 2px; }

/* Radio */
.sidebar__radio { position: absolute; opacity: 0; width: 0; height: 0; }
.sidebar__radio-custom {
  width: 18px; height: 18px; flex-shrink: 0;
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-full);
  display: flex; align-items: center; justify-content: center;
  transition: border-color var(--transition-fast);
}
.sidebar__radio:checked + .sidebar__radio-custom { border-color: var(--primary); }
.sidebar__radio:checked + .sidebar__radio-custom::after {
  content: '';
  width: 8px; height: 8px;
  background: var(--primary);
  border-radius: var(--radius-full);
  display: block;
}
.sidebar__radio:focus-visible + .sidebar__radio-custom { outline: 2px solid var(--primary); outline-offset: 2px; }

.sidebar__option-text { line-height: 1; }

/* Price */
.sidebar__price-row { display: flex; align-items: flex-end; gap: var(--space-2); }
.sidebar__price-field { display: flex; flex-direction: column; gap: var(--space-1); flex: 1; }
.sidebar__price-label { font-size: var(--font-size-xs); color: var(--gray-500); font-weight: 500; }
.sidebar__price-input {
  width: 100%; padding: var(--space-2) var(--space-3);
  border: 1px solid var(--gray-300); border-radius: var(--radius-md);
  font-size: var(--font-size-sm); color: var(--gray-900);
  transition: border-color var(--transition-fast);
}
.sidebar__price-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(26,77,143,0.12); }
.sidebar__price-sep { color: var(--gray-400); font-size: var(--font-size-sm); padding-bottom: var(--space-2); flex-shrink: 0; }

/* Apply button */
.sidebar__apply {
  width: 100%; padding: var(--space-3);
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--primary);
  font-size: var(--font-size-sm); font-weight: 600;
  cursor: not-allowed;
  opacity: 0.45;
  transition: background var(--transition-fast), color var(--transition-fast), opacity var(--transition-fast);
}
.sidebar__apply--active {
  background: var(--primary); color: var(--white);
  opacity: 1; cursor: pointer;
}
.sidebar__apply--active:hover { background: var(--primary-dark); border-color: var(--primary-dark); }
</style>