// ---------------------------------------------------------------------------
// Enumeraciones
// Derivadas de: com.mercadoufro.model.EstadoCondicionPublicacion
//               com.mercadoufro.model.EstadoModeracionPublicacion
//               com.mercadoufro.model.EstadoPublicacion
// ---------------------------------------------------------------------------

export enum EstadoCondicionPublicacion {
  NUEVO = 'NUEVO',
  COMO_NUEVO = 'COMO_NUEVO',
  BUEN_ESTADO = 'BUEN_ESTADO',
  ACEPTABLE = 'ACEPTABLE',
}

export enum EstadoModeracionPublicacion {
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
  PENDIENTE = 'PENDIENTE',
}

export enum EstadoPublicacion {
  ACTIVA = 'ACTIVA',
  EN_PAUSA = 'EN_PAUSA',
  DESHABILITADA = 'DESHABILITADA',
  ELIMINADA = 'ELIMINADA',
}

// ---------------------------------------------------------------------------
// Request DTOs
// Derivados de: com.mercadoufro.dto.request.*
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Response DTOs
// Derivados de: com.mercadoufro.dto.response.*
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Wrapper generico para respuestas paginadas de Spring Data (Page<T>)
// ---------------------------------------------------------------------------

export interface SortInfo {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export interface PageableInfo {
  pageNumber: number
  pageSize: number
  offset: number
  paged: boolean
  unpaged: boolean
  sort: SortInfo
}

export interface PageResponse<T> {
  content: T[]
  pageable: PageableInfo
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
  sort: SortInfo
}

// ---------------------------------------------------------------------------
// Parametros auxiliares para consultas
// ---------------------------------------------------------------------------

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
