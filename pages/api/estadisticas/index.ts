import { NextApiRequest, NextApiResponse } from 'next';
import { 
  getVentasPorMes, 
  getProductosMasVendidos, 
  getVentasPorTipoComprobante,
  getEstadisticasGenerales,
  getVentasUltimos7Dias
} from '../../../services/EstadisticasServices';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { tipo } = req.query;

    switch (tipo) {
      case 'ventas-por-mes':
        const ventasPorMes = await getVentasPorMes();
        return res.status(200).json(ventasPorMes);

      case 'productos-mas-vendidos':
        const limite = parseInt(req.query.limite as string) || 5;
        const productosMasVendidos = await getProductosMasVendidos(limite);
        return res.status(200).json(productosMasVendidos);

      case 'ventas-por-tipo':
        const ventasPorTipo = await getVentasPorTipoComprobante();
        return res.status(200).json(ventasPorTipo);

      case 'estadisticas-generales':
        const estadisticasGenerales = await getEstadisticasGenerales();
        return res.status(200).json(estadisticasGenerales);

      case 'ventas-ultimos-7-dias':
        const ventasUltimos7Dias = await getVentasUltimos7Dias();
        return res.status(200).json(ventasUltimos7Dias);

      case 'todas':
        const [
          ventasPorMesTodas,
          productosMasVendidosTodas,
          ventasPorTipoTodas,
          estadisticasGeneralesTodas,
          ventasUltimos7DiasTodas
        ] = await Promise.all([
          getVentasPorMes(),
          getProductosMasVendidos(),
          getVentasPorTipoComprobante(),
          getEstadisticasGenerales(),
          getVentasUltimos7Dias()
        ]);

        return res.status(200).json({
          ventasPorMes: ventasPorMesTodas,
          productosMasVendidos: productosMasVendidosTodas,
          ventasPorTipo: ventasPorTipoTodas,
          estadisticasGenerales: estadisticasGeneralesTodas,
          ventasUltimos7Dias: ventasUltimos7DiasTodas
        });

      default:
        return res.status(400).json({ 
          message: 'Tipo de estadística no válido. Opciones: ventas-por-mes, productos-mas-vendidos, ventas-por-tipo, estadisticas-generales, ventas-ultimos-7-dias, todas' 
        });
    }
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
