import pool from '../../../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { SolicitudDetalleCompletaBackend } from '../../../shared/interfaces';

export class SolicitudClienteService {
  
  /**
   * Obtener detalle completo de una solicitud incluyendo información del cliente
   */
  async obtenerDetalleCompleto(id_solicitud: number): Promise<SolicitudDetalleCompletaBackend | null> {
    try {
      const query = `
        SELECT 
          s.id_solicitud,
          s.id_cliente,
          s.id_usuario_rol as id_asesor,
          s.tipo_cuenta,
          s.estado,
          s.comentario_director,
          s.comentario_asesor,
          s.fecha_solicitud,
          s.fecha_respuesta,
          IF(s.archivo IS NOT NULL, true, false) as tiene_archivo,
          s.tipo_archivo,
          
          c.primer_nombre,
          c.segundo_nombre,
          c.primer_apellido,
          c.segundo_apellido,
          c.numero_documento,
          c.tipo_documento,
          c.fecha_nacimiento,
          c.nacionalidad,
          c.genero,
          c.estado_civil,
          
          cp.correo,
          cp.telefono,
          cp.direccion,
          cp.ciudad,
          cp.departamento,
          cp.pais,
          
          ae.ocupacion,
          ae.profesion
          
        FROM solicitudes_apertura s
        INNER JOIN clientes c ON s.id_cliente = c.id_cliente
        LEFT JOIN contacto_personal cp ON c.id_cliente = cp.id_cliente
        LEFT JOIN actividad_economica ae ON c.id_cliente = ae.id_cliente
        WHERE s.id_solicitud = ?
      `;

      const [rows] = await pool.execute<RowDataPacket[]>(query, [id_solicitud]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];

      return {
        id_solicitud: row.id_solicitud,
        id_cliente: row.id_cliente,
        id_asesor: row.id_asesor,
        tipo_cuenta: row.tipo_cuenta,
        estado: row.estado,
        comentario_director: row.comentario_director,
        comentario_asesor: row.comentario_asesor,
        fecha_solicitud: row.fecha_solicitud,
        fecha_respuesta: row.fecha_respuesta,
        tiene_archivo: row.tiene_archivo === 1,
        tipo_archivo: row.tipo_archivo,
        cliente: {
          primer_nombre: row.primer_nombre,
          segundo_nombre: row.segundo_nombre,
          primer_apellido: row.primer_apellido,
          segundo_apellido: row.segundo_apellido,
          numero_documento: row.numero_documento,
          tipo_documento: row.tipo_documento,
          fecha_nacimiento: row.fecha_nacimiento,
          nacionalidad: row.nacionalidad,
          genero: row.genero,
          estado_civil: row.estado_civil
        },
        contacto: {
          correo: row.correo,
          telefono: row.telefono,
          direccion: row.direccion,
          ciudad: row.ciudad,
          departamento: row.departamento,
          pais: row.pais
        },
        actividad_economica: {
          ocupacion: row.ocupacion,
          profesion: row.profesion
        }
      };

    } catch (error) {
      console.error('Error en obtenerDetalleCompleto:', error);
      throw error;
    }
  }

  /**
   * Rechazar una solicitud
   */
  async rechazarSolicitud(id_solicitud: number, comentario: string): Promise<boolean> {
    try {
      const query = `
        UPDATE solicitudes_apertura 
        SET 
          estado = 'Rechazada',
          comentario_director = ?,
          fecha_respuesta = NOW()
        WHERE id_solicitud = ? AND estado = 'Pendiente'
      `;

      const [result] = await pool.execute<ResultSetHeader>(query, [comentario, id_solicitud]);

      return result.affectedRows > 0;

    } catch (error) {
      console.error('Error en rechazarSolicitud:', error);
      throw error;
    }
  }

  /**
   * Aprobar una solicitud
   */
  async aprobarSolicitud(id_solicitud: number): Promise<boolean> {
    try {
      const query = `
        UPDATE solicitudes_apertura 
        SET 
          estado = 'Aprobada',
          fecha_respuesta = NOW()
        WHERE id_solicitud = ? AND estado = 'Pendiente'
      `;

      const [result] = await pool.execute<ResultSetHeader>(query, [id_solicitud]);

      return result.affectedRows > 0;

    } catch (error) {
      console.error('Error en aprobarSolicitud:', error);
      throw error;
    }
  }

  /**
   * Obtener archivo adjunto de una solicitud
   */
  async obtenerArchivo(id_solicitud: number): Promise<{ archivo: Buffer; tipo_archivo: string } | null> {
    try {
      const query = `
        SELECT archivo, tipo_archivo 
        FROM solicitudes_apertura 
        WHERE id_solicitud = ? AND archivo IS NOT NULL
      `;

      const [rows] = await pool.execute<RowDataPacket[]>(query, [id_solicitud]);

      if (rows.length === 0 || !rows[0].archivo) {
        return null;
      }

      return {
        archivo: rows[0].archivo,
        tipo_archivo: rows[0].tipo_archivo || 'pdf'
      };

    } catch (error) {
      console.error('Error en obtenerArchivo:', error);
      throw error;
    }
  }
}