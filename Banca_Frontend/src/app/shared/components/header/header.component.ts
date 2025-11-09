import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  @Input() titulo: string = 'Panel';
  @Input() subtitulo: string = 'Sistema de Simulación Bancaria';
  
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Método para obtener las iniciales del usuario
  get iniciales(): string {
    if (!this.currentUser || !this.currentUser.nombre) return '';
    const nombres = this.currentUser.nombre.trim().split(' ');
    if (nombres.length >= 2) {
      return (nombres[0][0] + nombres[nombres.length - 1][0]).toUpperCase();
    }
    return nombres[0][0].toUpperCase();
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
    }
  }
}