// Interfaces para el módulo de solicitudes

export interface Cliente {
  id_cliente: number;
  numero_documento: string;
  tipo_documento: 'CC' | 'TI' | 'R.Civil' | 'PPT' | 'Pasaporte' | 'Carne diplomático' | 'Cédula de extranjería';
  lugar_expedicion?: string;
  ciudad_nacimiento?: string;
  fecha_nacimiento: Date;
  fecha_expedicion?: Date;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  genero: 'M' | 'F';
  nacionalidad: 'Colombiano' | 'Estadounidense' | 'Otra';
  otra_nacionalidad?: string;
  estado_civil: 'Soltero' | 'Casado' | 'Unión Libre';
  grupo_etnico: 'Indígena' | 'Gitano' | 'Raizal' | 'Palenquero' | 'Afrocolombiano' | 'Ninguna';
  fecha_registro?: Date;
}

export interface SolicitudApertura {
  id_solicitud?: number;
  id_cliente: number;
  id_usuario_rol: number;
  tipo_cuenta: 'Ahorros';
  estado?: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Devuelta';
  comentario_director?: string;
  comentario_asesor?: string;
  archivo?: Buffer;
  fecha_solicitud?: Date;
  fecha_respuesta?: Date;
}

export interface SolicitudRequest {
  cedula: string;
  producto: string;
  comentario?: string;
}

export interface ClienteResponse {
  id_cliente: number;
  numero_documento: string;
  tipo_documento: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nombre_completo: string;
}

export interface SolicitudResponse {
  id_solicitud: number;
  id_cliente: number;
  id_usuario_rol?: number;
  tipo_cuenta: string;
  estado: string;
  comentario_asesor?: string;
  fecha_solicitud: Date;
  cliente?: ClienteResponse;
  creado_por?: {
    nombre: string;
    email: string;
    rol: string;
  };
}

// Interface para la consulta de solicitudes
export interface SolicitudConsultaResponse {
  id_solicitud: number;
  id_asesor: number;  // Este es el id_usuario_rol
  cedula: string;
  tipo_documento?: string;
  fecha: string;
  fecha_respuesta?: string | null;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Devuelta';
  producto: string;
  comentario_director?: string | null;
  comentario_asesor?: string | null;
  nombre_completo: string;
  genero?: string;
  estado_civil?: string;
  fecha_nacimiento?: string;
  nombre_asesor?: string;
  correo_asesor?: string;
}

// ===== NUEVAS INTERFACES PARA DETALLE COMPLETO =====

export interface ClienteInfoBackend {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  numero_documento: string;
  tipo_documento: string;
  fecha_nacimiento: Date;
  nacionalidad: string;
  genero: string;
  estado_civil: string;
}

export interface ContactoInfoBackend {
  correo?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
}

export interface ActividadEconomicaInfoBackend {
  ocupacion?: string;
  profesion?: string;
}

export interface SolicitudDetalleCompletaBackend {
  id_solicitud: number;
  id_cliente: number;
  id_asesor: number;
  tipo_cuenta: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Devuelta';
  comentario_director?: string;
  comentario_asesor?: string;
  fecha_solicitud: Date;
  fecha_respuesta?: Date;
  tiene_archivo: boolean;
  cliente: ClienteInfoBackend;
  contacto: ContactoInfoBackend;
  actividad_economica: ActividadEconomicaInfoBackend;
}

export interface SolicitudDetalleResponse {
  success: boolean;
  message: string;
  data: SolicitudDetalleCompletaBackend;
}

export interface AccionSolicitudRequest {
  comentario?: string;
}

export interface AccionSolicitudResponse {
  success: boolean;
  message: string;
}

// Interfaces para el módulo de usuarios

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  contrasena: string;
  fecha_creacion: Date;
  activo: boolean;
}

export interface RegistroUsuarioRequest {
  nombre: string;
  email: string;
  password: string;
  rol?: string;
}

export interface UsuarioResponse {
  id_usuario: number;
  nombre: string;
  correo: string;
  fecha_creacion: Date;
  activo: boolean;
}

export interface RegistroResponse {
  success: boolean;
  message: string;
  data?: UsuarioResponse;
}

export interface ValidacionEmailResponse {
  exists: boolean;
}

// Interfaces para el módulo de login

export interface LoginRequest {
  email: string;
  password: string;
  rol: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    nombre: string;
    rol: string;
    id_usuario_rol?: number;
  };
}

export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion?: string;
}

export interface UsuarioConRoles {
  id_usuario: number;
  nombre: string;
  correo: string;
  activo: boolean;
  fecha_creacion: Date;
  roles: Rol[];
}

export interface AsignarRolRequest {
  email: string;
  rol: string;
}

export interface AsignarRolResponse {
  success: boolean;
  message: string;
}

export interface VerificarRolRequest {
  email: string;
  rol: string;
}

export interface VerificarRolResponse {
  success: boolean;
  tieneRol: boolean;
}

export interface AuthUser {
  id_usuario: number;
  email: string;
  rol: string;
  id_usuario_rol: number;
}