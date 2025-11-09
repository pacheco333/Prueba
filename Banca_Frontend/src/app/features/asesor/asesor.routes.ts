import { Routes } from '@angular/router';
import { AsesorLayoutComponent } from './layout/asesor-layout.component';

export const ASESOR_ROUTES: Routes = [
  {
    path: '',
    component: AsesorLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'solicitar-producto',
        pathMatch: 'full'
      },
      {
        path: 'solicitar-producto',
        loadComponent: () =>
          import('./components/solicitar-producto/solicitar-producto.component').then(
            (m) => m.SolicitarProductoComponent
          ),
      }
    ]
  }
];

