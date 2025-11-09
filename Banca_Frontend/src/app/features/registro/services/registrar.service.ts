import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface RegistroUsuario {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export interface RegistroResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Registrar {
  private apiUrl = `${environment.apiUrl}/auth/registro`; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  registrarUsuario(userData: RegistroUsuario): Observable<RegistroResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RegistroResponse>(this.apiUrl, userData, { headers }).pipe(
      map(response => {
        // Validar respuesta exitosa
        if (response.success) {
          return response;
        }
        throw new Error(response.message || 'Error al registrar usuario');
      }),
      catchError(error => {
        // Manejo de errores
        let errorMessage = 'Error al conectar con el servidor';
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 409) {
          errorMessage = 'El correo electrónico ya está registrado';
        } else if (error.status === 400) {
          errorMessage = 'Datos de registro inválidos';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
        }

        return throwError(() => ({
          status: error.status,
          error: { message: errorMessage }
        }));
      })
    );
  }

  validarEmail(email: string): Observable<boolean> {
    // Endpoint para validar si el email ya existe
    return this.http.get<{exists: boolean}>(`${environment.apiUrl}/auth/validar-email`, {
      params: { email }
    }).pipe(
      map(response => !response.exists),
      catchError(() => throwError(() => new Error('Error al validar email')))
    );
  }
}