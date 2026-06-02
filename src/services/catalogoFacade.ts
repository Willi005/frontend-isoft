// Fachada: Catálogo de Productos
// Abstrae la interacción con el módulo de Catálogo de Productos.
// Actualmente usa datos mock; en el futuro se conectará al servicio real.

export interface ProductoCatalogo {
  id: number
  nombre: string
}

export interface ICatalogoFacade {
  buscarProductos(query: string): ProductoCatalogo[]
}

/**
 * Implementación mock de la fachada de catálogo.
 * Cuando el módulo de catálogo esté listo, se reemplazará
 * por llamadas reales sin modificar los consumidores.
 */
export const catalogoFacade: ICatalogoFacade = {
  buscarProductos(query: string): ProductoCatalogo[] {
    if (!query.trim()) return []
    return [
      { id: 101, nombre: 'Producto 1: ' + query },
      { id: 102, nombre: 'Producto 2: ' + query },
      { id: 103, nombre: 'Producto 3 (Otra opción)' },
    ]
  },
}
