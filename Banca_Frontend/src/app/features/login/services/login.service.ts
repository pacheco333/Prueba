import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginData {
  email: string;
  password: string;
  rol: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    nombre: string;
    rol: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Login {
  // URL base del backend - ajusta según tu configuración
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Realiza el login del usuario
   * @param loginData Datos de login (email, password, rol)
   * @returns Observable con la respuesta del servidor
   */
  loginUser(loginData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
  }

  /**
   * Verifica las credenciales del usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @param rol Rol seleccionado
   * @returns Observable con la respuesta
   */
  verifyCredentials(email: string, password: string, rol: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { email, password, rol });
  }

  /**
   * Solicita recuperación de contraseña
   * @param email Email del usuario
   * @returns Observable con la respuesta
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Valida el formato del email
   * @param email Email a validar
   * @returns true si el email es válido
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida la contraseña
   * @param password Contraseña a validar
   * @returns true si la contraseña cumple los requisitos
   */
  validatePassword(password: string): boolean {
    return password.length >= 8;
  }
}