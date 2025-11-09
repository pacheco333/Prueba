import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Obtener el rol requerido de la ruta
  const requiredRole = route.data['role'];
  
  if (!requiredRole) {
    // Si no se especifica rol, solo verificar autenticación
    return true;
  }

  // Verificar si el usuario tiene el rol requerido
  const userRole = authService.getUserRole();

  // Normalizar roles para comparación: minúsculas y separadores unificados
  const normalize = (val?: string | null) =>
    val?.toString().trim().toLowerCase().replace(/[_\s]+/g, '-') || '';

  const normalizedUserRole = normalize(userRole);
  const normalizedRequiredRole = normalize(requiredRole);

  if (normalizedUserRole === normalizedRequiredRole) {
    return true;
  }

  // Si no tiene el rol, redirigir a página no autorizada o login
  console.warn(`Acceso denegado. Rol requerido: ${requiredRole}, Rol del usuario: ${userRole}`);
  router.navigate(['/unauthorized']);
  return false;
};