import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

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

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  id_usuario_rol?: number;
}

export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion?: string;
}

export interface RolesResponse {
  success: boolean;
  roles: Rol[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajusta esta URL a tu backend
  private apiUrl = 'http://localhost:3000/api/auth';
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  /**
   * Obtener roles disponibles para un usuario específico
   */
  getRolesDisponibles(email: string): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(`${this.apiUrl}/roles-disponibles`, {
      params: { email }
    });
  }

  /**
   * Obtener todos los roles del sistema
   */
  getRolesDelSistema(): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(`${this.apiUrl}/roles`);
  }

  /**
   * Asignar un rol a un usuario
   */
  asignarRol(email: string, rol: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/asignar-rol`,
      { email, rol }
    );
  }

  /**
   * Verificar si un usuario tiene un rol específico
   */
  verificarRol(email: string, rol: string): Observable<{ success: boolean; tieneRol: boolean }> {
    return this.http.get<{ success: boolean; tieneRol: boolean }>(
      `${this.apiUrl}/verificar-rol`,
      { params: { email, rol } }
    );
  }

  logout(): void {
    // Remover datos de autenticación
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.rol : null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Método para agregar el token a las peticiones HTTP
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
}