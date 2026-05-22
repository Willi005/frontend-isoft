import { createRouter, createWebHistory } from 'vue-router'
import { cuentasRoutes } from './routes/cuentasRoutes'
import { catalogoRoutes } from './routes/catalogoRoutes'
import { publicacionesRoutes } from './routes/publicacionesRoutes'
import { ordenesRoutes } from './routes/ordenesRoutes'
import { pagosRoutes } from './routes/pagosRoutes'
import { mensajeriaRoutes } from './routes/mensajeriaRoutes'
import { logisticaRoutes } from './routes/logisticaRoutes'
import { adminRoutes } from './routes/adminRoutes'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...cuentasRoutes,
    ...catalogoRoutes,
    ...publicacionesRoutes,
    ...ordenesRoutes,
    ...pagosRoutes,
    ...mensajeriaRoutes,
    ...logisticaRoutes,
    ...adminRoutes,
  ],
})

export default router