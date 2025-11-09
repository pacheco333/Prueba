import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = 'http://localhost:3000/api/asesor';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Buscar cliente por cédula
   */
  buscarCliente(cedula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/${cedula}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Enviar solicitud de producto
   * Incluye automáticamente el id_usuario_rol del usuario autenticado
   */
  enviarSolicitud(solicitud: any): Observable<any> {
    const formData = new FormData();
    formData.append('cedula', solicitud.cedula);
    formData.append('producto', solicitud.producto);
    formData.append('comentario', solicitud.comentario || '');
    
    // El token JWT ya incluye el id_usuario y el rol
    // El backend extraerá esta información del token
    
    if (solicitud.archivo) {
      formData.append('archivo', solicitud.archivo, solicitud.archivo.name);
    }

    // Enviar con headers de autenticación
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/solicitudes`, formData, { headers });
  }

  /**
   * Obtener todas las solicitudes
   */
  obtenerSolicitudes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solicitudes`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Obtener solicitud por ID
   */
  obtenerSolicitudPorId(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/solicitudes/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Actualizar solicitud
   */
  actualizarSolicitud(id: string, solicitud: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/solicitudes/${id}`, solicitud, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Eliminar solicitud
   */
  eliminarSolicitud(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/solicitudes/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}