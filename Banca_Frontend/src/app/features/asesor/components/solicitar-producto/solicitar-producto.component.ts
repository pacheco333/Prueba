import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-solicitar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-producto.component.html',
  styleUrl: './solicitar-producto.component.css'
})
export class SolicitarProductoComponent implements OnInit {
  cedula: string = '';
  producto: string = 'Cuenta de Ahorros (Persona natural)';
  comentario: string = '';
  archivoSeleccionado: string = '';
  archivoFile: File | null = null;
  clienteEncontrado: boolean = false;
  clienteNoEncontrado: boolean = false;
  nombreCliente: string = '';
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  
  // Datos del usuario autenticado
  currentUser: any = null;

  constructor(
    private solicitudService: SolicitudService,
    private authService: AuthService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    // Obtener datos del usuario autenticado
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Usuario autenticado:', user);
    });
  }

  // Validar que solo se ingresen números
  onCedulaInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Eliminar cualquier caracter que no sea número
    this.cedula = value.replace(/[^0-9]/g, '');
    // Actualizar el valor del input
    input.value = this.cedula;
  }

  async buscarCliente(): Promise<void> {
    if (!this.cedula.trim()) {
      this.toastService.warning('Por favor ingrese una cédula');
      return;
    }

    console.log('Buscando cliente con cédula:', this.cedula);
    this.isLoading = true;
    this.clienteEncontrado = false;
    this.clienteNoEncontrado = false;
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.solicitudService.buscarCliente(this.cedula).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Respuesta completa:', response);
        console.log('Cliente encontrado:', response.data);
        this.clienteEncontrado = true;
        this.clienteNoEncontrado = false;
        const cliente = response.data;
        this.nombreCliente = `${cliente.primer_nombre || ''} ${cliente.segundo_nombre || ''} ${cliente.primer_apellido || ''} ${cliente.segundo_apellido || ''}`.trim() || 'Cliente';
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al buscar cliente:', error);
        this.clienteEncontrado = false;
        this.clienteNoEncontrado = true;
        this.nombreCliente = '';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validar tamaño del archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.toastService.error('El archivo es demasiado grande. El tamaño máximo es 5MB.');
        input.value = '';
        return;
      }

      // Validar tipo de archivo
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        this.toastService.error('Tipo de archivo no permitido. Use PDF, JPG, PNG o Word.');
        input.value = '';
        return;
      }

      this.archivoFile = file;
      this.archivoSeleccionado = file.name;
    }
  }

  async enviarSolicitud(): Promise<void> {
    // Validaciones
    if (!this.cedula.trim()) {
      this.toastService.warning('Por favor ingrese la cédula del titular');
      return;
    }

    if (!this.clienteEncontrado) {
      this.toastService.warning('Debe buscar y verificar que el cliente existe antes de enviar la solicitud');
      return;
    }

    if (!this.currentUser) {
      this.toastService.error('Error: No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.');
      return;
    }

    // Preparar datos de la solicitud
    const solicitud = {
      cedula: this.cedula,
      producto: this.producto,
      comentario: this.comentario,
      archivo: this.archivoFile
    };

    console.log('Enviando solicitud:', solicitud);
    console.log('Usuario que crea la solicitud:', this.currentUser);
    
    this.isSubmitting = true;
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.solicitudService.enviarSolicitud(solicitud).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        console.log('Solicitud enviada exitosamente:', response);
        this.toastService.success('¡Solicitud enviada exitosamente!');
        this.limpiarFormulario();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al enviar solicitud:', error);
        const errorMessage = error.error?.message || 'Error al enviar la solicitud';
        this.toastService.error(errorMessage);
      }
    });
  }

  cancelar(): void {
    this.confirmDialogService.confirm(
      '¿Está seguro de que desea cancelar? Se perderán los datos ingresados.',
      () => this.limpiarFormulario(),
      {
        title: 'Cancelar solicitud',
        confirmText: 'Sí, cancelar',
        cancelText: 'No, continuar'
      }
    );
  }

  private limpiarFormulario(): void {
    this.cedula = '';
    this.producto = 'Cuenta de Ahorros (Persona natural)';
    this.comentario = '';
    this.archivoSeleccionado = '';
    this.archivoFile = null;
    this.clienteEncontrado = false;
    this.clienteNoEncontrado = false;
    this.nombreCliente = '';
    
    // Limpiar input de archivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}