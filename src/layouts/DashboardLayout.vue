<script setup lang="ts">
import { RouterView } from 'vue-router'
import Topbar from '../components/layout/Topbar.vue'
import Sidebar from '../components/layout/Sidebar.vue'
import Footer from '../components/layout/Footer.vue'

interface Props {
  showSidebar?: boolean
  showSearch?: boolean
  cartCount?: number
  notifCount?: number
}
withDefaults(defineProps<Props>(), {
  showSidebar: true,
  showSearch: true,
  cartCount: 0,
  notifCount: 0,
})
</script>

<template>
  <div class="dashboard">
    <Topbar :show-search="showSearch" :cart-count="cartCount" :notif-count="notifCount" />

    <div class="dashboard__body">
      <Sidebar v-if="showSidebar" />
      <main class="dashboard__main">
        <RouterView />
      </main>
    </div>

    <Footer v-if="!$route.meta.hideFooter" />
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard__body {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: var(--space-6);
  max-width: var(--content-max-w);
  width: 100%;
  margin: 0 auto;
  padding: var(--space-6);
}

.dashboard__main {
  flex: 1;
  min-width: 0;
}

@media (max-width: 900px) {
  .dashboard__body { flex-direction: column; padding: var(--space-4); }
}
</style>