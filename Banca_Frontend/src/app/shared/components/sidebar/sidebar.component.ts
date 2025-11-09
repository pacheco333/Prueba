import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MenuItem {
  titulo: string;
  items: { label: string; ruta: string }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];
  menuAbierto = true;
  sidebarVisible = false;
  isSmallScreen = false;

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
    if (!this.isSmallScreen) {
      this.sidebarVisible = true;
    }
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar() {
    if (this.isSmallScreen) {
      this.sidebarVisible = false;
    }
  }
}
