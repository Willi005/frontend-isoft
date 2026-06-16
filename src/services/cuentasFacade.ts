// Fachada: Cuentas / Usuarios
// Abstrae la interacción con el módulo de Gestión de Cuentas.
// Actualmente usa datos mock; en el futuro se conectará al servicio real.

export interface UsuarioSesion {
  id: number
  nombre: string
}

export interface ICuentasFacade {
  obtenerUsuarioActual(): UsuarioSesion
}

// Implementación mock de la fachada de cuentas.
// Cuando el módulo de cuentas esté listo, se reemplazará
// por la sesión real del usuario autenticado.

export const cuentasFacade: ICuentasFacade = {
  obtenerUsuarioActual(): UsuarioSesion {
    return { id: 1, nombre: 'Usuario Mock' }
  },
}
