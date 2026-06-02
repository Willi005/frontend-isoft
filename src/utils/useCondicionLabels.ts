// Composable: useCondicionLabels
// Mapeos de condición reutilizables para el módulo de publicaciones.

import { EstadoCondicionPublicacion } from '@/utils/mockStore'

/** Labels legibles para cada condición. */
export const CONDICION_LABELS: Record<EstadoCondicionPublicacion, string> = {
  [EstadoCondicionPublicacion.NUEVO]: 'Nuevo',
  [EstadoCondicionPublicacion.COMO_NUEVO]: 'Como nuevo',
  [EstadoCondicionPublicacion.BUEN_ESTADO]: 'Buen estado',
  [EstadoCondicionPublicacion.ACEPTABLE]: 'Aceptable',
}

/** Clases CSS (Tailwind) para el badge de cada condición. */
export const CONDICION_CLASES: Record<EstadoCondicionPublicacion, string> = {
  [EstadoCondicionPublicacion.NUEVO]: 'bg-emerald-100 text-emerald-700',
  [EstadoCondicionPublicacion.COMO_NUEVO]: 'bg-sky-100 text-sky-700',
  [EstadoCondicionPublicacion.BUEN_ESTADO]: 'bg-amber-100 text-amber-700',
  [EstadoCondicionPublicacion.ACEPTABLE]: 'bg-gray-100 text-gray-600',
}

/** Opciones para selectores/dropdowns de condición. */
export const CONDICION_OPCIONES: { value: EstadoCondicionPublicacion; label: string }[] = [
  { value: EstadoCondicionPublicacion.NUEVO, label: 'Nuevo' },
  { value: EstadoCondicionPublicacion.COMO_NUEVO, label: 'Como nuevo' },
  { value: EstadoCondicionPublicacion.BUEN_ESTADO, label: 'Buen estado' },
  { value: EstadoCondicionPublicacion.ACEPTABLE, label: 'Aceptable' },
]
