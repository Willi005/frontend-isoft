// ---------------------------------------------------------------------------
// MOCK STORE (Maqueta Frontend)
// ---------------------------------------------------------------------------

export const EstadoCondicionPublicacion = {
  NUEVO: 'NUEVO',
  COMO_NUEVO: 'COMO_NUEVO',
  BUEN_ESTADO: 'BUEN_ESTADO',
  ACEPTABLE: 'ACEPTABLE',
} as const
export type EstadoCondicionPublicacion = (typeof EstadoCondicionPublicacion)[keyof typeof EstadoCondicionPublicacion]

export const EstadoModeracionPublicacion = {
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA',
  PENDIENTE: 'PENDIENTE',
} as const
export type EstadoModeracionPublicacion = (typeof EstadoModeracionPublicacion)[keyof typeof EstadoModeracionPublicacion]

export const EstadoPublicacion = {
  ACTIVA: 'ACTIVA',
  EN_PAUSA: 'EN_PAUSA',
  DESHABILITADA: 'DESHABILITADA',
  ELIMINADA: 'ELIMINADA',
} as const
export type EstadoPublicacion = (typeof EstadoPublicacion)[keyof typeof EstadoPublicacion]

export interface CrearPublicacionData {
  titulo: string
  descripcion: string
  precio: number
  stock: number
  condicion: EstadoCondicionPublicacion
  productoCatalogoId: number
  vendedorId: number
}

export interface EditarPublicacionData {
  titulo: string
  descripcion: string
  precio: number
  condicion: EstadoCondicionPublicacion
  imagenesAMantener: string[]
}

export interface PublicacionDetalle {
  id: number
  titulo: string
  descripcion: string
  precio: number
  stock: number
  condicion: EstadoCondicionPublicacion
  productoCatalogoId: number
  vendedorId: number
  imagenesUrls: string[]
  estadoPublicacion: EstadoPublicacion
  estadoModeracion: EstadoModeracionPublicacion
  razonRechazo: string | null
  fechaCreacion: string
}

export interface PublicacionLista {
  id: number
  titulo: string
  precio: number
  stock: number
  condicion: EstadoCondicionPublicacion
  estadoPublicacion: EstadoPublicacion
  imagenPrincipalUrl: string | null
  fechaCreacion: string
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
}

export interface BuscarPublicacionesParams {
  busqueda?: string
  vendedorId?: number
  estado?: EstadoPublicacion
  soloAprobadas?: boolean
  page?: number
  size?: number
}

// ---------------------------------------------------------------------------
// DATOS EN MEMORIA
// ---------------------------------------------------------------------------

let currentId = 100

const MOCK_PUBLICACION_DETALLE: PublicacionDetalle = {
  id: 1,
  titulo: 'MacBook Pro M2 14" (Simulado)',
  descripcion: 'Este es un producto de prueba completamente simulado para la maqueta del frontend sin conexion a backend.',
  precio: 1500000,
  stock: 5,
  condicion: EstadoCondicionPublicacion.COMO_NUEVO,
  estadoPublicacion: EstadoPublicacion.ACTIVA,
  estadoModeracion: EstadoModeracionPublicacion.APROBADA,
  razonRechazo: null,
  fechaCreacion: new Date().toISOString(),
  imagenesUrls: ['mock-image-1', 'mock-image-2'],
  vendedorId: 1,
  productoCatalogoId: 1
}

const MOCK_PUBLICACION_LISTA_1: PublicacionLista = {
  id: 1,
  titulo: 'MacBook Pro M2 14"',
  precio: 1500000,
  stock: 5,
  condicion: EstadoCondicionPublicacion.COMO_NUEVO,
  estadoPublicacion: EstadoPublicacion.ACTIVA,
  fechaCreacion: new Date().toISOString(),
  imagenPrincipalUrl: 'mock-image-1'
}

const MOCK_PUBLICACION_LISTA_2: PublicacionLista = {
  id: 2,
  titulo: 'Calculadora Científica Casio',
  precio: 25000,
  stock: 12,
  condicion: EstadoCondicionPublicacion.NUEVO,
  estadoPublicacion: EstadoPublicacion.ACTIVA,
  fechaCreacion: new Date(Date.now() - 86400000 * 2).toISOString(),
  imagenPrincipalUrl: 'mock-image-3'
}

export let publicacionesSimuladas: PublicacionLista[] = [
  MOCK_PUBLICACION_LISTA_1,
  MOCK_PUBLICACION_LISTA_2
]

// ---------------------------------------------------------------------------
// FUNCIONES (Simulando lo que harían los servicios)
// ---------------------------------------------------------------------------

export const cuentasFacade = {
  obtenerUsuarioActual() {
    return { id: 1, nombre: 'Usuario Maqueta' }
  }
}

export const catalogoFacade = {
  async obtenerProductos(query: string) {
    return [
      { id: 1, nombre: 'Producto Maqueta 1' },
      { id: 2, nombre: 'Producto Maqueta 2' },
    ].filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()))
  }
}

export async function crearPublicacion(
  datos: CrearPublicacionData,
  imagenes?: File[],
): Promise<PublicacionDetalle> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevoId = currentId++
      const nueva: PublicacionLista = {
        id: nuevoId,
        titulo: datos.titulo,
        precio: datos.precio,
        stock: datos.stock,
        condicion: datos.condicion,
        estadoPublicacion: EstadoPublicacion.ACTIVA,
        fechaCreacion: new Date().toISOString(),
        imagenPrincipalUrl: 'mock-image-new'
      }
      publicacionesSimuladas.unshift(nueva)
      resolve({
        ...MOCK_PUBLICACION_DETALLE,
        id: nuevoId,
        titulo: datos.titulo,
        precio: datos.precio,
        stock: datos.stock,
        condicion: datos.condicion,
        estadoModeracion: EstadoModeracionPublicacion.PENDIENTE
      })
    }, 300)
  })
}

export async function obtenerPublicacion(id: number): Promise<PublicacionDetalle> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = publicacionesSimuladas.find(p => p.id === Number(id))
      if (found) {
        resolve({
          ...MOCK_PUBLICACION_DETALLE,
          id: found.id,
          titulo: found.titulo,
          precio: found.precio,
          stock: found.stock,
          condicion: found.condicion,
          estadoPublicacion: found.estadoPublicacion,
          fechaCreacion: found.fechaCreacion,
          imagenesUrls: [found.imagenPrincipalUrl || 'mock']
        })
      } else {
        resolve(MOCK_PUBLICACION_DETALLE)
      }
    }, 200)
  })
}

export async function buscarPublicaciones(
  params: BuscarPublicacionesParams,
): Promise<PageResponse<PublicacionLista>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...publicacionesSimuladas]
      
      if (params.busqueda) {
        result = result.filter(p => p.titulo.toLowerCase().includes(params.busqueda!.toLowerCase()))
      }
      if (params.estado) {
        result = result.filter(p => p.estadoPublicacion === params.estado)
      }

      const totalElements = result.length
      const pageSize = params.size || 12
      const pageNumber = params.page || 0
      const totalPages = Math.ceil(totalElements / pageSize)
      
      const start = pageNumber * pageSize
      const content = result.slice(start, start + pageSize)

      resolve({
        content,
        totalPages,
        totalElements
      })
    }, 300)
  })
}

export async function editarPublicacion(
  id: number,
  datos: EditarPublicacionData,
  imagenesNuevas?: File[],
): Promise<PublicacionDetalle> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = publicacionesSimuladas.findIndex(p => p.id === id)
      if (idx !== -1) {
        publicacionesSimuladas[idx] = {
          ...publicacionesSimuladas[idx],
          titulo: datos.titulo,
          precio: datos.precio,
          condicion: datos.condicion
        }
      }
      resolve({
        ...MOCK_PUBLICACION_DETALLE,
        id,
        titulo: datos.titulo,
        precio: datos.precio,
        condicion: datos.condicion
      })
    }, 300)
  })
}

export async function eliminarPublicacion(id: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      publicacionesSimuladas = publicacionesSimuladas.filter(p => p.id !== id)
      resolve()
    }, 200)
  })
}

export async function cambiarVisibilidad(
  id: number,
  nuevoEstado: EstadoPublicacion,
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = publicacionesSimuladas.findIndex(p => p.id === id)
      if (idx !== -1) {
        publicacionesSimuladas[idx].estadoPublicacion = nuevoEstado
      }
      resolve()
    }, 200)
  })
}

// Stubs para carrito
export async function agregarAlCarrito(publicacionId: number, cantidad: number) {
  return Promise.resolve({ id: 999 })
}
