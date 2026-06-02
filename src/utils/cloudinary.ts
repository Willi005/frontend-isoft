export function getCloudinaryUrl(publicIdOrUrl: string | null | undefined): string {
  if (!publicIdOrUrl) return 'https://placehold.co/400x400/eeeeee/cccccc?text=Sin+Imagen'
  
  // Si ya es una URL completa (http/https), o una data URI, o blob, se retorna tal cual.
  // Esto permite que el Uploader siga mostrando las imagenes seleccionadas localmente.
  if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://') || publicIdOrUrl.startsWith('data:') || publicIdOrUrl.startsWith('blob:')) {
    return publicIdOrUrl
  }

  // Si es un string 'mock-image-X' que usamos en nuestros datos estaticos:
  if (publicIdOrUrl.startsWith('mock-image')) {
    return `https://placehold.co/600x400/var(--primary)/ffffff?text=Imagen+Simulada`
  }

  // Fallback genérico para maqueta
  return `https://placehold.co/400x400/e2e8f0/64748b?text=Placeholder`
}
