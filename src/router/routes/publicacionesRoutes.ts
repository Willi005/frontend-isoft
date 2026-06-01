import type { RouteRecordRaw } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

export const publicacionesRoutes: RouteRecordRaw[] = [
  // Catalogo: con sidebar de filtros visible
  {
    path: '/publicaciones',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'catalogo',
        component: () => import('@/views/publicaciones/CatalogoView.vue'),
      },
    ],
  },

  // Resto de vistas: sin sidebar
  {
    path: '/publicaciones',
    component: DashboardLayout,
    props: { showSidebar: false },
    children: [
      {
        path: 'gestion',
        name: 'gestion-publicaciones',
        component: () => import('@/views/publicaciones/GestionPublicacionesView.vue'),
      },
      {
        path: 'crear',
        name: 'crear-publicacion',
        component: () => import('@/views/publicaciones/CrearPublicacionView.vue'),
        meta: { hideFooter: true }
      },
      {
        path: ':id(\\d+)',
        name: 'detalle-publicacion',
        component: () => import('@/views/publicaciones/DetallePublicacionView.vue'),
      },
      {
        path: ':id(\\d+)/editar',
        name: 'editar-publicacion',
        component: () => import('@/views/publicaciones/EditarPublicacionView.vue'),
        meta: { hideFooter: true }
      },
    ],
  },
]
