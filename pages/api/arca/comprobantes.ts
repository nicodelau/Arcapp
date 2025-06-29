import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import Afip from "../../../lib/afip";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
      const data = req.body;
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '');

      let dataArca = {
        CantReg: 1,
        PtoVta: 3,
        CbteTipo: req.body.CbteTipo,
        Concepto: req.body.Concepto,
        DocTipo: req.body.DocTipo,
        DocNro: Number(req.body.DocNro),
        CbteDesde: req.body.CbteDesde,
        CbteHasta: req.body.CbteHasta,
        CbteFch: formattedDate,
        ImpTotal: req.body.ImpTotal,
        ImpTotConc: req.body.ImpTotConc,
        ImpNeto: parseFloat(req.body.ImpNeto.toFixed(2)),
        ImpOpEx: req.body.ImpOpEx,
        ImpIVA: req.body.ImpIVA,
        ImpTrib: req.body.ImpTrib,
        MonId: req.body.MonId ?? "PES",
        MonCotiz: req.body.MonCotiz ?? 1,
        CondicionIVAReceptorId: req.body.idIVAReceptor,
        Iva: (req.body.Iva || []).map((item: any) => ({
          Id: item.tipoId ?? item.Id,
          BaseImp: item.baseImp ?? parseFloat(item.BaseImp.toFixed(2)),
          Importe: item.importe ?? item.Importe,
        })),
      };

      const response = await Afip.electronicBillingService.createVoucher(dataArca);
      
      if (response.cae) {
        const comprobante = await prisma.comprobante.create({
          data: {
            cae: String(response.cae),
            cantReg: 1,
            puntoVenta: 3,
            tipoCbte: data.CbteTipo,
            concepto: Number(data.Concepto),
            docTipo: Number(data.DocTipo) ?? 80,
            docNro: data.DocNro.toString(),
            cbteDesde: Number(data.CbteDesde),
            cbteHasta: Number(data.CbteHasta),
            cbteFch: data.CbteFch.toString(),
            impTotal: data.ImpTotal,
            impTotConc: Number(data.ImpTotConc),
            impNeto: data.ImpNeto,
            impOpEx: data.ImpOpEx ?? 0,
            impIVA: data.ImpIVA,
            impTrib: Number(data.ImpTrib),
            monId: data.MonId,
            monCotiz: 1,
            ivaItems: {
              create: data.Iva.map((item: any) => ({
                tipoId: Number(item.Id),
                baseImp: item.BaseImp,
                importe: item.Importe,
              })),
            },
          },
          include: {
            ivaItems: true,
          },
        });

        let comprobante2 = {
          ...comprobante,
          docNro: comprobante.docNro.toString(),
        };

        const productosFacturados = data.Productos.map(async (producto: any) => (
          await prisma.productoFacturado.create({
            data: {
              comprobanteId: Number(comprobante2.id),
              cantidad: parseFloat(producto.cantidad),
              total: parseFloat(producto.total),
              productoId: Number(producto.id),
            }
          })
        ));

        return res.status(201).json({
          comprobante: {
            message: "Comprobante creado exitosamente",
            ...comprobante2,
          },
          productosFacturados: {
            message: "Productos facturados creados exitosamente",
            productos: await Promise.all(productosFacturados),
          },
        });
      }
    try {

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al guardar el comprobante" });
    }

  }

  return res.status(405).json({ error: "Método no permitido" });
}
