import { Request, Response } from 'express';
import { SolicitudClienteService } from '../services/solicitudClienteService';

export class SolicitudClienteController {
  private solicitudClienteService: SolicitudClienteService;

  constructor() {
    this.solicitudClienteService = new SolicitudClienteService();
  }

  /**
   * Obtener detalle completo de una solicitud con información del cliente
   */
  async obtenerDetalleCompleto(req: Request, res: Response): Promise<void> {
    try {
      const { id_solicitud } = req.params;
      const idSolicitud = parseInt(id_solicitud);

      if (isNaN(idSolicitud)) {
        res.status(400).json({
          success: false,
          message: 'ID de solicitud inválido'
        });
        return;
      }

      const resultado = await this.solicitudClienteService.obtenerDetalleCompleto(idSolicitud);

      if (!resultado) {
        res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Detalle de solicitud obtenido exitosamente',
        data: resultado
      });

    } catch (error) {
      console.error('Error en obtenerDetalleCompleto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el detalle de la solicitud'
      });
    }
  }

  /**
   * Rechazar una solicitud
   */
  async rechazarSolicitud(req: Request, res: Response): Promise<void> {
    try {
      const { id_solicitud } = req.params;
      const { comentario } = req.body;
      const idSolicitud = parseInt(id_solicitud);

      if (isNaN(idSolicitud)) {
        res.status(400).json({
          success: false,
          message: 'ID de solicitud inválido'
        });
        return;
      }

      if (!comentario || comentario.trim() === '') {
        res.status(400).json({
          success: false,
          message: 'El motivo de rechazo es requerido'
        });
        return;
      }

      const resultado = await this.solicitudClienteService.rechazarSolicitud(
        idSolicitud,
        comentario.trim()
      );

      if (resultado) {
        res.json({
          success: true,
          message: 'Solicitud rechazada exitosamente'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada o ya procesada'
        });
      }

    } catch (error) {
      console.error('Error en rechazarSolicitud:', error);
      res.status(500).json({
        success: false,
        message: 'Error al rechazar la solicitud'
      });
    }
  }

  /**
   * Aprobar una solicitud
   */
  async aprobarSolicitud(req: Request, res: Response): Promise<void> {
    try {
      const { id_solicitud } = req.params;
      const idSolicitud = parseInt(id_solicitud);

      if (isNaN(idSolicitud)) {
        res.status(400).json({
          success: false,
          message: 'ID de solicitud inválido'
        });
        return;
      }

      const resultado = await this.solicitudClienteService.aprobarSolicitud(idSolicitud);

      if (resultado) {
        res.json({
          success: true,
          message: 'Solicitud aprobada exitosamente'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada o ya procesada'
        });
      }

    } catch (error) {
      console.error('Error en aprobarSolicitud:', error);
      res.status(500).json({
        success: false,
        message: 'Error al aprobar la solicitud'
      });
    }
  }

  /**
   * Descargar archivo adjunto de una solicitud
   */
  async descargarArchivo(req: Request, res: Response): Promise<void> {
    try {
      const { id_solicitud } = req.params;
      const idSolicitud = parseInt(id_solicitud);

      if (isNaN(idSolicitud)) {
        res.status(400).json({
          success: false,
          message: 'ID de solicitud inválido'
        });
        return;
      }

      const archivo = await this.solicitudClienteService.obtenerArchivo(idSolicitud);

      if (!archivo) {
        res.status(404).json({
          success: false,
          message: 'No hay archivo adjunto en esta solicitud'
        });
        return;
      }

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="solicitud_${idSolicitud}_archivo.pdf"`);
      res.send(archivo);

    } catch (error) {
      console.error('Error en descargarArchivo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al descargar el archivo'
      });
    }
  }
}