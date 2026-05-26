<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  showSearch?: boolean
  cartCount?: number
  notifCount?: number
}
const props = withDefaults(defineProps<Props>(), { showSearch: true, cartCount: 0, notifCount: 0 })
const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'cart-click'): void
  (e: 'profile-click'): void
}>()

const searchQuery = ref('')
const onSearch = () => emit('search', searchQuery.value)
</script>

<template>
  <header class="topbar">
    <div class="topbar__inner">
      <!-- Logo -->
      <a class="topbar__logo" href="/">
        <div class="topbar__logo-icon">
          <img src="../../assets/Logo_Ufro.png" alt="logo ufro"/>
        </div>
        <div class="topbar__logo-text">
          <span class="topbar__logo-brand">UFRO</span>
          <span class="topbar__logo-sub">Market</span>
        </div>
      </a>

      <!-- Search -->
      <div v-if="showSearch" class="topbar__search">
        <label for="topbar-search" class="sr-only">Buscar en UFRO Market</label>
        <div class="topbar__search-wrap">
          <svg class="topbar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="topbar-search"
            v-model="searchQuery"
            type="search"
            placeholder="Buscar en UFRO Market..."
            class="topbar__search-input"
            @keydown.enter="onSearch"
          />
        </div>
      </div>

      <!-- Actions -->
      <nav class="topbar__actions">
        <button class="topbar__action" aria-label="Mensajes">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </button>
        <button class="topbar__action topbar__action--badge" :data-count="notifCount > 0 ? notifCount : undefined" aria-label="Notificaciones">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
        <button class="topbar__action topbar__action--badge" :data-count="cartCount > 0 ? cartCount : undefined" aria-label="Carrito" @click="emit('cart-click')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.96-1.62L23 6H6"/>
          </svg>
        </button>
        <button class="topbar__avatar" aria-label="Perfil" @click="emit('profile-click')">
          <span>U</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky; top: 0;
  width: 100%;
  height: var(--topbar-height);
  background: var(--primary);
  z-index: var(--z-topbar);
  box-shadow: var(--shadow-md);
}
.topbar__inner {
  max-width: var(--content-max-w);
  margin: 0 auto;
  height: 100%;
  display: flex; align-items: center; gap: var(--space-4);
  padding: 0 var(--space-6);
}

/* Logo */
.topbar__logo { 
  display: flex; 
  align-items: center; 
  gap: var(--space-2); 
  text-decoration: none;  
  flex-shrink: 0; 
}
.topbar__logo-icon {
  width: 42px; 
  height: 42px;
  display: flex; 
  align-items: center; 
  justify-content: center;
}
.topbar__logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.topbar__logo-text { display: flex; flex-direction: column; line-height: 1.0; }
.topbar__logo-brand { font-weight: 800; font-size: var(--font-size-lg); color: var(--white); letter-spacing: 0.02em; }
.topbar__logo-sub  { font-size: var(--font-size-xs); color: rgba(255,255,255,0.85); font-weight: 500; }

/* Search */
.topbar__search { flex: 1; max-width: 560px;}
.topbar__search-wrap {
  position: relative;
  display: flex; align-items: center;
}
.topbar__search-icon { position: absolute; left: var(--space-4); color: var(--gray-400); pointer-events: none; flex-shrink: 0; }
.topbar__search-input {
  width: 100%;
  padding: 6px var(--space-4) 6px calc(var(--space-4) + 16px + var(--space-3));
  background: var(--white);
  border: 2px solid transparent;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--gray-900);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.topbar__search-input::placeholder { color: var(--gray-400); }
.topbar__search-input:focus { outline: none; border-color: #93b8f0; box-shadow: 0 0 0 2px rgba(147, 184, 240, 0.35); }

/* Actions */
.topbar__actions { display: flex; align-items: center; gap: var(--space-2); margin-left: auto; flex-shrink: 0; }
.topbar__action {
  position: relative;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: var(--radius-md);
  color: rgba(255,255,255,0.85);
  transition: background var(--transition-fast), color var(--transition-fast);
}
.topbar__action:hover { background: rgba(255,255,255,0.2); color: var(--white); }
.topbar__action--badge[data-count]::after {
  content: attr(data-count);
  position: absolute; top: -4px; right: -4px;
  min-width: 18px; height: 18px;
  background: var(--danger);
  color: var(--white);
  font-size: 10px; font-weight: 700;
  border-radius: var(--radius-full);
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--primary);
}
.topbar__avatar {
  width: 36px; height: 36px;
  border-radius: var(--radius-full);
  background: var(--accent);
  border: 2px solid rgba(255,255,255,0.4);
  color: var(--white);
  font-weight: 700; font-size: var(--font-size-sm);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}
.topbar__avatar:hover { border-color: rgba(255,255,255,0.9); }

/* Accessibility */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
</style>