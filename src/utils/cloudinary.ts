export function getCloudinaryUrl(publicIdOrUrl: string | null | undefined): string {
  if (!publicIdOrUrl) return ''
  
  // Si ya es una URL completa (http/https), o una data URI, se retorna tal cual
  if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://') || publicIdOrUrl.startsWith('data:')) {
    return publicIdOrUrl
  }

  // De lo contrario, asumimos que es un public_id de Cloudinary
  // El cloud name debe estar configurado en las variables de entorno
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
  
  // Limpiamos barras extra por si acaso
  const cleanId = publicIdOrUrl.replace(/^\/+/, '')
  
  // Cloudinary normalmente necesita o la versión o la extensión.
  // Añadiendo f_auto,q_auto nos aseguramos de que entregue el mejor formato.
  // También añadimos la extensión .jpg si el public_id no tiene una.
  const idWithExt = cleanId.includes('.') ? cleanId : `${cleanId}.jpg`
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${idWithExt}`
}
