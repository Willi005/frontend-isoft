import axios from 'axios'
import type {
  CrearPublicacionRequest,
  EditarPublicacionRequest,
  PublicacionDetalleResponse,
  PublicacionListaResponse,
  StockActualizadoResponse,
  ItemCarritoResponse,
  PageResponse,
  BuscarPublicacionesParams,
  OperacionStock,
} from '@/types/publicaciones'
import { EstadoModeracionPublicacion, EstadoPublicacion } from '@/types/publicaciones'

// Instancia de Axios

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    Accept: 'application/json',
  },
})

// Utilidades internas

/**
 * Construye un FormData con la parte "datos" serializada como JSON Blob
 * y los archivos adjuntos bajo la clave indicada.
 */
function buildMultipartPayload(
  datosKey: string,
  datos: Record<string, unknown>,
  archivosKey: string,
  archivos?: File[],
): FormData {
  const fd = new FormData()

  const jsonBlob = new Blob([JSON.stringify(datos)], { type: 'application/json' })
  fd.append(datosKey, jsonBlob)

  if (archivos && archivos.length > 0) {
    for (const archivo of archivos) {
      fd.append(archivosKey, archivo)
    }
  }

  return fd
}

// Métodos principales del componente de servicio

/**
 * Crear publicacion.
 * POST /api/v1/publicaciones (multipart/form-data)
 */
export async function crearPublicacion(
  datos: CrearPublicacionRequest,
  imagenes?: File[],
): Promise<PublicacionDetalleResponse> {
  const fd = buildMultipartPayload('datos', datos as unknown as Record<string, unknown>, 'imagenes', imagenes)
  const { data } = await apiClient.post<PublicacionDetalleResponse>('/api/v1/publicaciones', fd)
  return data
}

/**
 * Obtener publicacion por ID.
 * GET /api/v1/publicaciones/{id}
 */
export async function obtenerPublicacion(id: number): Promise<PublicacionDetalleResponse> {
  const { data } = await apiClient.get<PublicacionDetalleResponse>(`/api/v1/publicaciones/${id}`)
  return data
}

/**
 * Buscar publicaciones con filtros y paginado.
 * GET /api/v1/publicaciones
 */
export async function buscarPublicaciones(
  params: BuscarPublicacionesParams = {},
): Promise<PageResponse<PublicacionListaResponse>> {
  const { data } = await apiClient.get<PageResponse<PublicacionListaResponse>>('/api/v1/publicaciones', {
    params: {
      busqueda: params.busqueda ?? undefined,
      condicion: params.condicion ?? undefined,
      precioMin: params.precioMin ?? undefined,
      precioMax: params.precioMax ?? undefined,
      page: params.page ?? 0,
      size: params.size ?? 12,
      sort: params.sort ?? undefined,
      vendedorId: params.vendedorId ?? undefined,
      estadoPublicacion: params.estadoPublicacion ?? undefined,
    },
  })
  return data
}

/**
 * Editar publicacion.
 * PUT /api/v1/publicaciones/{id} (multipart/form-data)
 */
export async function editarPublicacion(
  id: number,
  datos: EditarPublicacionRequest,
  nuevasImagenes?: File[],
): Promise<PublicacionDetalleResponse> {
  const fd = buildMultipartPayload(
    'datos',
    datos as unknown as Record<string, unknown>,
    'nuevasImagenes',
    nuevasImagenes,
  )
  const { data } = await apiClient.put<PublicacionDetalleResponse>(`/api/v1/publicaciones/${id}`, fd)
  return data
}

/**
 * Eliminar publicacion.
 * DELETE /api/v1/publicaciones/{id}
 */
export async function eliminarPublicacion(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/publicaciones/${id}`)
}

/**
 * Listar publicaciones por estado de moderacion (panel de administracion).
 * GET /api/v1/publicaciones/moderacion
 */
export async function listarPorModeracion(
  estado: EstadoModeracionPublicacion,
  page = 0,
  size = 12,
): Promise<PageResponse<PublicacionListaResponse>> {
  const { data } = await apiClient.get<PageResponse<PublicacionListaResponse>>(
    '/api/v1/publicaciones/moderacion',
    { params: { estado, page, size } },
  )
  return data
}

/**
 * Moderar publicacion (aprobar/rechazar).
 * PATCH /api/v1/publicaciones/estado/{id}/moderacion
 */
export async function moderarPublicacion(
  id: number,
  estado: EstadoModeracionPublicacion,
  razonRechazo?: string,
): Promise<PublicacionDetalleResponse> {
  const { data } = await apiClient.patch<PublicacionDetalleResponse>(
    `/api/v1/publicaciones/estado/${id}/moderacion`,
    null,
    { params: { estado, razonRechazo: razonRechazo ?? undefined } },
  )
  return data
}

/**
 * Cambiar estado de visibilidad (ACTIVA, EN_PAUSA, etc.).
 * PATCH /api/v1/publicaciones/estado/{id}/visibilidad
 */
export async function cambiarVisibilidad(
  id: number,
  estado: EstadoPublicacion,
): Promise<PublicacionDetalleResponse> {
  const { data } = await apiClient.patch<PublicacionDetalleResponse>(
    `/api/v1/publicaciones/estado/${id}/visibilidad`,
    null,
    { params: { estado } },
  )
  return data
}

/**
 * Ajustar stock de una publicacion.
 * PATCH /api/v1/publicaciones/{id}/stock
 */
export async function ajustarStock(
  id: number,
  cantidad: number,
  operacion: OperacionStock,
): Promise<StockActualizadoResponse> {
  const { data } = await apiClient.patch<StockActualizadoResponse>(
    `/api/v1/publicaciones/${id}/stock`,
    null,
    { params: { cantidad, operacion } },
  )
  return data
}

/**
 * Agregar publicacion al carrito.
 * POST /api/v1/publicaciones/{id}/carrito
 */
export async function agregarAlCarrito(
  id: number,
  cantidad: number,
): Promise<ItemCarritoResponse> {
  const { data } = await apiClient.post<ItemCarritoResponse>(
    `/api/v1/publicaciones/${id}/carrito`,
    null,
    { params: { cantidad } },
  )
  return data
}

/**
 * Confirmar compra eliminando reservas.
 * DELETE /api/v1/publicaciones/reservas
 */
export async function eliminarReservas(ids: number[]): Promise<void> {
  await apiClient.delete('/api/v1/publicaciones/reservas', { params: { ids: ids.join(',') } })
}

/**
 * Ajustar cantidad de una reserva existente en el carrito.
 * PATCH /api/v1/publicaciones/reservas/{idReserva}
 */
export async function ajustarReservaCarrito(
  idReserva: number,
  cantidad: number,
  operacion: OperacionStock,
): Promise<ItemCarritoResponse> {
  const { data } = await apiClient.patch<ItemCarritoResponse>(
    `/api/v1/publicaciones/reservas/${idReserva}`,
    null,
    { params: { cantidad, operacion } },
  )
  return data
}
