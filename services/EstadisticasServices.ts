import { prisma } from '../lib/prisma';

export async function getVentasPorMes() {
  try {
    const comprobantes = await prisma.comprobante.findMany({
      select: {
        cbteFch: true,
        impTotal: true,
      },
      orderBy: {
        cbteFch: 'asc',
      },
    });

    // Agrupar por mes y año
    const ventasPorMes = comprobantes.reduce((acc: any, comprobante) => {
      const fecha = new Date(comprobante.cbteFch);
      const año = fecha.getFullYear();
      const mes = fecha.getMonth();
      const mesAño = `${año}-${(mes + 1).toString().padStart(2, '0')}`;
      
      if (!acc[mesAño]) {
        acc[mesAño] = { mes: mesAño, total: 0, cantidad: 0 };
      }
      
      acc[mesAño].total += comprobante.impTotal;
      acc[mesAño].cantidad += 1;
      
      return acc;
    }, {});

    return Object.values(ventasPorMes);
  } catch (error) {
    console.error('Error al obtener ventas por mes:', error);
    throw new Error('Error al obtener ventas por mes');
  }
}

export async function getProductosMasVendidos(limite: number = 5) {
  try {
    const productosFacturados = await prisma.productoFacturado.groupBy({
      by: ['productoId'],
      _sum: {
        cantidad: true,
        total: true,
      },
      orderBy: {
        _sum: {
          cantidad: 'desc',
        },
      },
      take: limite,
    });

    const productosConDetalles = await Promise.all(
      productosFacturados.map(async (item) => {
        const producto = await prisma.producto.findUnique({
          where: { id: item.productoId },
          select: { descripcion: true },
        });
        return {
          nombre: producto?.descripcion || 'Producto desconocido',
          cantidad: item._sum.cantidad || 0,
          total: item._sum.total || 0,
        };
      })
    );

    return productosConDetalles;
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    throw new Error('Error al obtener productos más vendidos');
  }
}

export async function getVentasPorTipoComprobante() {
  try {
    const ventasPorTipo = await prisma.comprobante.groupBy({
      by: ['tipoCbte'],
      _sum: {
        impTotal: true,
      },
      _count: {
        id: true,
      },
    });

    // Mapear tipos de comprobante a nombres más legibles
    const tiposComprobante: { [key: number]: string } = {
      1: 'Factura A',
      6: 'Factura B',
      11: 'Factura C',
      3: 'Nota de Crédito A',
      8: 'Nota de Crédito B',
      13: 'Nota de Crédito C',
    };

    return ventasPorTipo.map((item) => ({
      tipo: tiposComprobante[item.tipoCbte] || `Tipo ${item.tipoCbte}`,
      total: item._sum.impTotal || 0,
      cantidad: item._count.id,
    }));
  } catch (error) {
    console.error('Error al obtener ventas por tipo de comprobante:', error);
    throw new Error('Error al obtener ventas por tipo de comprobante');
  }
}

export async function getEstadisticasGenerales() {
  try {
    const [
      totalComprobantes,
      totalProductos,
      totalVentas,
      promedioVenta,
    ] = await Promise.all([
      prisma.comprobante.count(),
      prisma.producto.count(),
      prisma.comprobante.aggregate({
        _sum: { impTotal: true },
      }),
      prisma.comprobante.aggregate({
        _avg: { impTotal: true },
      }),
    ]);

    return {
      totalComprobantes,
      totalProductos,
      totalVentas: totalVentas._sum.impTotal || 0,
      promedioVenta: promedioVenta._avg.impTotal || 0,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas generales:', error);
    throw new Error('Error al obtener estadísticas generales');
  }
}

export async function getVentasUltimos7Dias() {
  try {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);

    const ventas = await prisma.comprobante.findMany({
      where: {
        createdAt: {
          gte: hace7Dias,
        },
      },
      select: {
        createdAt: true,
        impTotal: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Agrupar por día
    const ventasPorDia = ventas.reduce((acc: any, venta) => {
      const fecha = venta.createdAt.toISOString().split('T')[0];
      if (!acc[fecha]) {
        acc[fecha] = { fecha, total: 0, cantidad: 0 };
      }
      acc[fecha].total += venta.impTotal;
      acc[fecha].cantidad += 1;
      return acc;
    }, {});

    return Object.values(ventasPorDia);
  } catch (error) {
    console.error('Error al obtener ventas de los últimos 7 días:', error);
    throw new Error('Error al obtener ventas de los últimos 7 días');
  }
}
