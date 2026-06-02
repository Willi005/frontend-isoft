// Composable: useFormatters
// Métodos principales del componente de formato reutilizables para el módulo de publicaciones.

/**
 * Formatea un valor numérico como precio en CLP.
 */
export function formatPrecio(valor: number): string {
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  })
}

/**
 * Formatea una fecha ISO como texto legible en español chileno.
 * Ejemplo: "1 de junio de 2026"
 */
export function formatFechaLarga(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formatea una fecha ISO como DD/MM/YYYY.
 * Ejemplo: "01/06/2026"
 */
export function formatFechaCorta(fechaStr: string): string {
  if (!fechaStr) return ''
  const date = new Date(fechaStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}
