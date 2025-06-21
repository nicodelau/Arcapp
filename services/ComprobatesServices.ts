import { create } from 'domain';
import { prisma  } from '../lib/prisma';

export async function get_comprobantes() {
  try {
    const comprobantes = await prisma.comprobante.findMany({
      orderBy: {
        cae: 'asc',
      }
    });
    return comprobantes;
  } catch (error) {
    console.error('Error al obtener comprobantes:', error);
    throw new Error('Error al obtener comprobantes');
  }
}

export async function get_comprobante_by_id(cae: string) {
  try {
    const comprobante = await prisma.comprobante.findFirst({
      where: { cae: parseInt(cae) }
    })
    return comprobante;
  } catch (error) {
    console.error('Error al obtener el comprobante:', error);
    throw new Error('Error al obtener el comprobante');
  }
}

export async function create_comprobante(data: any) {
  try {
    const comprobanteData = {
      cantReg: data.CantReg,
      puntoVenta: data.PtoVta, // Use correct field name as per Prisma schema
      tipoCbte: data.CbteTipo, // Use correct field name as per Prisma schema
      cae: data.Cae,           // Make sure this is provided in data
      concepto: data.Concepto,
      docTipo: data.DocTipo,
      docNro: data.DocNro,
      cbteDesde: data.CbteDesde,
      cbteHasta: data.CbteHasta,
      cbteFch: data.CbteFch,
      impTotal: data.ImpTotal,
      impTotConc: data.ImpTotConc,
      impNeto: data.ImpNeto,
      impOpEx: data.ImpOpEx,
      impIVA: data.ImpIVA,
      impTrib: data.ImpTrib,
      monId: data.MonId,
      monCotiz: data.MonCotiz,
      iva: data.Iva,
      createdAt: new Date(),
    }

    const nuevocomprobante = await prisma.comprobante.create({
      data: comprobanteData,
    });
    return nuevocomprobante;
  } catch (error) {
    console.error('Error al crear el comprobante:', error);
    throw new Error('Error al crear el comprobante');
  }
}

// export async function update_comprobante(id: string, data: any) {
//   try {
//     const { cae, descripcion, precioUnitario } = data;
//     const comprobanteActualizado = await prisma.comprobante.update({
//       where: { id: parseInt(id) },
//       data: {
//         descripcion,
//         cantReg,
//         puntoVenta,
//         tipoCbte,
//         cae,
//         concepto,
//         docTipo,
//         docNro,
//         cbteDesde,
//         cbteHasta,
//         cbteFch,
//         impTotal,
//         impTotConc,
//         impNeto,
//         impOpEx,
//         impIVA,
//         impTrib,
//         monId,
//         monCotiz,
//         iva,
//         createdAt,
//       },
//     });
//     return comprobanteActualizado;
//   } catch (error) {
//     console.error('Error al actualizar el comprobante:', error);
//     throw new Error('Error al actualizar el comprobante');
//   }
// }

export async function delete_comprobante(id: string) {
  try {
    const comprobanteEliminado = await prisma.comprobante.delete({
      where: { id: parseInt(id) },
    });
    return comprobanteEliminado;
  } catch (error) {
    console.error('Error al eliminar el comprobante:', error);
    throw new Error('Error al eliminar el comprobante');
  }
}