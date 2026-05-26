<script setup lang="ts">
interface Item {
  id: string | number
  title: string
  subtitle?: string
  meta?: string
  badge?: string
  badgeVariant?: 'primary' | 'success' | 'danger' | 'warning'
  image?: string
}
interface Props {
  type?: 'list' | 'grid' | 'descending'
  items?: Item[]
  emptyText?: string
}
const props = withDefaults(defineProps<Props>(), {
  type: 'list',
  items: () => [],
  emptyText: 'No hay elementos para mostrar.',
})
const badgeClass = (v?: string) => ({ primary: 'badge--primary', success: 'badge--success', danger: 'badge--danger', warning: 'badge--warning' }[v ?? 'primary'] ?? 'badge--primary')
</script>

<template>
  <div :class="['base-list', `base-list--${type}`]">
    <p v-if="!items.length" class="base-list__empty">{{ emptyText }}</p>

    <!-- LIST -->
    <template v-if="type === 'list' && items.length">
      <div v-for="item in items" :key="item.id" class="list-item">
        <img v-if="item.image" :src="item.image" alt="" class="list-item__img" />
        <div class="list-item__body">
          <span class="list-item__title">{{ item.title }}</span>
          <span v-if="item.subtitle" class="list-item__subtitle">{{ item.subtitle }}</span>
        </div>
        <div class="list-item__end">
          <span v-if="item.meta" class="list-item__meta">{{ item.meta }}</span>
          <span v-if="item.badge" :class="['badge', badgeClass(item.badgeVariant)]">{{ item.badge }}</span>
        </div>
      </div>
    </template>

    <!-- GRID -->
    <template v-if="type === 'grid' && items.length">
      <div v-for="item in items" :key="item.id" class="grid-item">
        <div v-if="item.image" class="grid-item__img-wrap">
          <img :src="item.image" alt="" class="grid-item__img" />
        </div>
        <div class="grid-item__body">
          <span class="grid-item__title">{{ item.title }}</span>
          <span v-if="item.subtitle" class="grid-item__subtitle">{{ item.subtitle }}</span>
          <div class="grid-item__foot">
            <span v-if="item.meta" class="grid-item__meta">{{ item.meta }}</span>
            <span v-if="item.badge" :class="['badge', badgeClass(item.badgeVariant)]">{{ item.badge }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- DESCENDING -->
    <template v-if="type === 'descending' && items.length">
      <ol class="desc-list">
        <li v-for="(item, i) in items" :key="item.id" class="desc-item">
          <span class="desc-item__rank">{{ i + 1 }}</span>
          <div class="desc-item__body">
            <span class="desc-item__title">{{ item.title }}</span>
            <span v-if="item.subtitle" class="desc-item__subtitle">{{ item.subtitle }}</span>
          </div>
          <span v-if="item.meta" class="desc-item__meta">{{ item.meta }}</span>
        </li>
      </ol>
    </template>
  </div>
</template>

<style scoped>
.base-list { width: 100%; }
.base-list__empty { color: var(--gray-500); font-size: var(--font-size-sm); text-align: center; padding: var(--space-8); }

/* LIST */
.base-list--list { display: flex; flex-direction: column; gap: 1px; border: var(--border); border-radius: var(--radius-lg); overflow: hidden; background: var(--border-color); }
.list-item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: var(--white); transition: background var(--transition-fast); }
.list-item:hover { background: var(--gray-50); }
.list-item__img { width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
.list-item__body { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.list-item__title { font-weight: 500; font-size: var(--font-size-sm); color: var(--gray-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.list-item__subtitle { font-size: var(--font-size-xs); color: var(--gray-500); }
.list-item__end { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-1); flex-shrink: 0; }
.list-item__meta { font-size: var(--font-size-xs); color: var(--gray-600); font-weight: 500; }

/* GRID */
.base-list--grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--space-4); }
.grid-item { background: var(--white); border-radius: var(--radius-lg); border: var(--border); overflow: hidden; display: flex; flex-direction: column; transition: box-shadow var(--transition-base), transform var(--transition-base); }
.grid-item:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.grid-item__img-wrap { height: 140px; background: var(--gray-100); overflow: hidden; }
.grid-item__img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
.grid-item:hover .grid-item__img { transform: scale(1.04); }
.grid-item__body { padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-1); flex: 1; }
.grid-item__title { font-weight: 600; font-size: var(--font-size-sm); color: var(--gray-900); }
.grid-item__subtitle { font-size: var(--font-size-xs); color: var(--gray-500); }
.grid-item__foot { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: var(--space-2); }
.grid-item__meta { font-size: var(--font-size-sm); font-weight: 700; color: var(--primary); }

/* DESCENDING */
.desc-list { display: flex; flex-direction: column; gap: var(--space-2); }
.desc-item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: var(--white); border: var(--border); border-radius: var(--radius-md); }
.desc-item__rank { font-size: var(--font-size-lg); font-weight: 700; color: var(--gray-300); min-width: 28px; }
.desc-item__body { flex: 1; display: flex; flex-direction: column; }
.desc-item__title { font-weight: 500; font-size: var(--font-size-sm); color: var(--gray-900); }
.desc-item__subtitle { font-size: var(--font-size-xs); color: var(--gray-500); }
.desc-item__meta { font-size: var(--font-size-sm); font-weight: 600; color: var(--gray-700); }

/* BADGE */
.badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--font-size-xs); font-weight: 600; }
.badge--primary { background: var(--primary-light); color: var(--primary); }
.badge--success { background: var(--success-light); color: #059669; }
.badge--danger  { background: var(--danger-light);  color: #dc2626; }
.badge--warning { background: var(--warning-light); color: #d97706; }
</style>