// Enumeraciones

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

// Interfaces de lo que enviamos al backend

export interface CrearPublicacionRequest {
  titulo: string
  descripcion: string
  precio: number
  stock: number
  condicion: EstadoCondicionPublicacion
  productoCatalogoId: number
  vendedorId: number
}

export interface EditarPublicacionRequest {
  titulo: string
  descripcion: string
  precio: number
  condicion: EstadoCondicionPublicacion
  imagenesAMantener: string[]
}

// Interfaces de lo que recibimos del backend

export interface PublicacionDetalleResponse {
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

export interface PublicacionListaResponse {
  id: number
  titulo: string
  precio: number
  stock: number
  condicion: EstadoCondicionPublicacion
  estadoPublicacion: EstadoPublicacion
  imagenPrincipalUrl: string | null
  fechaCreacion: string
}

export interface StockActualizadoResponse {
  publicacionId: number
  stockAnterior: number
  nuevoStock: number
  estadoPublicacion: EstadoPublicacion
  mensaje: string
}

export interface ItemCarritoResponse {
  idReserva: number
  idPublicacion: number
  idVendedor: number
  imagenPublicacion: string | null
  cantidad: number
  precioUnitario: number
  subtotal: number
}

// Parámetros auxiliares para consultas

export interface BuscarPublicacionesParams {
  busqueda?: string
  condicion?: EstadoCondicionPublicacion
  precioMin?: number
  precioMax?: number
  page?: number
  size?: number
  sort?: string
  vendedorId?: number
  estadoPublicacion?: EstadoPublicacion | 'TODOS' | string
}

export type OperacionStock = 'SUMA' | 'RESTA'

// Re-exportar tipos de paginación desde shared para conveniencia
export type { PageResponse, PageableInfo, SortInfo } from '@/types/pagination'
