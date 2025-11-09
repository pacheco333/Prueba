import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.routes').then(m => m.LOGIN_ROUTES)
  },
  {
    path: 'registro',
    loadChildren: () =>
      import('./features/registro/registro.routes').then(m => m.REGISTRO_ROUTES)
  },
  
  {
    path: 'asesor',
    loadChildren: () =>
      import('./features/asesor/asesor.routes').then(m => m.ASESOR_ROUTES),
    canActivate: [roleGuard],
    data: { role: 'Asesor' }
  },
  {
    path: 'director-operativo',
    loadChildren: () =>
      import('./features/director-operativo/director-operativo.routes').then(
        m => m.DIRECTOR_OPERATIVO_ROUTES
      ),
    canActivate: [roleGuard],
    data: { role: 'Director-operativo' }
  },
  
  {
    path: '**',
    redirectTo: '/login'
  }
];