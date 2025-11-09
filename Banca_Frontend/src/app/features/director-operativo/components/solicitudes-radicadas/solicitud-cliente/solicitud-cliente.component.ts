import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudService, SolicitudDetalleCompleta } from './services/solicitud.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-solicitud-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-cliente.component.html',
  styleUrls: ['./solicitud-cliente.component.css']
})
export class SolicitudClienteComponent implements OnInit {
  solicitud?: SolicitudDetalleCompleta;
  
  mostrarModalRechazo: boolean = false;
  mostrarModalAprobacion: boolean = false;
  motivoRechazo: string = '';
  
  cargando: boolean = false;
  error: string = '';
  procesando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private solicitudService: SolicitudService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarSolicitud();
  }

  private cargarSolicitud(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'ID de solicitud no proporcionado';
      return;
    }
    
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error = 'ID de solicitud inválido';
      return;
    }

    this.cargando = true;
    this.solicitudService.obtenerDetalleCompleto(id).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.solicitud = resp.data;
        } else {
          this.error = resp.message || 'No fue posible cargar la solicitud';
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error detalle solicitud', err);
        this.error = 'Error al conectar con el servidor';
        this.cargando = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/director-operativo/consultar-solicitudes']);
  }

  abrirModalRechazo(): void {
    this.mostrarModalRechazo = true;
    this.motivoRechazo = '';
  }

  cerrarModalRechazo(): void {
    this.mostrarModalRechazo = false;
    this.motivoRechazo = '';
  }

  async confirmarRechazo(): Promise<void> {
    if (!this.motivoRechazo.trim()) {
      this.toastService.warning('Por favor ingrese el motivo del rechazo');
      return;
    }

    if (!this.solicitud) return;

    this.procesando = true;
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 600));
    
    this.solicitudService.rechazarSolicitud(this.solicitud.id_solicitud, this.motivoRechazo).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.toastService.success('Solicitud rechazada exitosamente');
          this.mostrarModalRechazo = false;
          setTimeout(() => this.volver(), 1000);
        } else {
          this.toastService.error(resp.message || 'Error al rechazar la solicitud');
        }
        this.procesando = false;
      },
      error: (err) => {
        console.error('Error al rechazar solicitud:', err);
        this.toastService.error('Error al conectar con el servidor');
        this.procesando = false;
      }
    });
  }

  abrirModalAprobacion(): void {
    this.mostrarModalAprobacion = true;
  }

  cerrarModalAprobacion(): void {
    this.mostrarModalAprobacion = false;
  }

  async confirmarAprobacion(): Promise<void> {
    if (!this.solicitud) return;

    this.procesando = true;
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 600));
    
    this.solicitudService.aprobarSolicitud(this.solicitud.id_solicitud).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.toastService.success('Solicitud aprobada exitosamente');
          this.mostrarModalAprobacion = false;
          setTimeout(() => this.volver(), 1000);
        } else {
          this.toastService.error(resp.message || 'Error al aprobar la solicitud');
        }
        this.procesando = false;
      },
      error: (err) => {
        console.error('Error al aprobar solicitud:', err);
        this.toastService.error('Error al conectar con el servidor');
        this.procesando = false;
      }
    });
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  obtenerAnioNacimiento(fechaNacimiento: string): string {
    if (!fechaNacimiento) return '--';
    const fecha = new Date(fechaNacimiento);
    return fecha.getFullYear().toString();
  }

  descargarArchivo(): void {
    if (!this.solicitud) return;

    this.solicitudService.descargarArchivo(this.solicitud.id_solicitud).subscribe({
      next: (response) => {
        // Determinar el tipo de archivo y MIME type
        const tipoArchivo = this.solicitud!.tipo_archivo || 'pdf';
        const mimeTypes: { [key: string]: string } = {
          'pdf': 'application/pdf',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        const mimeType = mimeTypes[tipoArchivo] || 'application/octet-stream';
        
        // Crear un blob desde la respuesta
        const blob = new Blob([response], { type: mimeType });
        
        // Crear URL temporal
        const url = window.URL.createObjectURL(blob);
        
        // Crear elemento <a> para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = `solicitud_${this.solicitud!.id_solicitud}_archivo.${tipoArchivo}`;
        
        // Simular click
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar archivo:', err);
        if (err.status === 404) {
          this.toastService.info('No hay archivo adjunto en esta solicitud');
        } else {
          this.toastService.error('Error al descargar el archivo');
        }
      }
    });
  }

  tieneArchivo(): boolean {
    // Ahora usamos la propiedad alineada con el backend: tiene_archivo
    return this.solicitud?.tiene_archivo || false;
  }
}