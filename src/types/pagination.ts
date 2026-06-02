// ---------------------------------------------------------------------------
// Interfaz base para manejar las respuestas paginadas que entrega Spring Boot
// Este tipo se puede reutilizar en otros módulos
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
