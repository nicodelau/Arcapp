import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import Afip from "../../../lib/afip";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const date = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

    const data = req.body;

    try {
        let data = {
          CantReg: 1,
          PtoVta: 3,
          CbteTipo: req.body.CbteTipo,
          Concepto: req.body.Concepto,
          DocTipo: req.body.DocTipo,
          DocNro: req.body.DocNro,
          CbteDesde: req.body.CbteDesde,
          CbteHasta: req.body.CbteHasta,
          CbteFch: date,
          ImpTotal: req.body.ImpTotal,
          ImpTotConc: req.body.ImpTotConc,
          ImpNeto: req.body.ImpNeto,
          ImpOpEx: req.body.ImpOpEx,
          ImpIVA: req.body.ImpIVA,
          ImpTrib: req.body.ImpTrib,
          MonId: req.body.MonId ?? "PES" ,
          MonCotiz: req.body.MonCotiz ?? 1,
          Iva: req.body.ivaItems,
        };

        const response = await Afip.electronicBillingService.createVoucher(data);
        if(response.cae) {
          try {
            const comprobanteNeon = fetch('/api/arcapp/comprobantes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                CantReg: data.CantReg,
                PtoVta: data.PtoVta,
                CbteTipo: data.CbteTipo,
                Concepto: data.Concepto,
                DocTipo: data.DocTipo,
                DocNro: BigInt(data.DocNro),
                CbteDesde: data.CbteDesde,
                CbteHasta: data.CbteHasta,
                CbteFch: data.CbteFch.toString(),
                ImpTotal: data.ImpTotal,
                ImpTotConc: data.ImpTotConc,
                ImpNeto: data.ImpNeto,
                ImpOpEx: data.ImpOpEx,
                ImpIVA: data.ImpIVA,
                ImpTrib: data.ImpTrib,
                MonId: data.MonId,
                MonCotiz: data.MonCotiz,
                IvaItems: data.Iva.map((item) => ({
                  tipoId: item.Id,
                  baseImp: item.BaseImp,
                  importe: item.Importe
                })),
              })
            });
          } catch (error) {
            console.error("Error al guardar el comprobante en Neon:", error);
            return res.status(500).json({ error: "Error al guardar el comprobante en Neon" });
          }
        }
    } catch (error) {
        console.error("Error al crear el comprobante:", error); 
        return res.status(500).json({ error: "Error al crear el comprobante" });
    }

    // try {
    //   const data = req.body;

    //   const comprobante = await prisma.comprobante.create({
    //     data: {
    //       cantReg: data.CantReg,
    //       puntoVenta: data.PtoVta,
    //       tipoCbte: data.CbteTipo,
    //       concepto: data.Concepto,
    //       docTipo: data.DocTipo,
    //       docNro: BigInt(data.DocNro),
    //       cbteDesde: data.CbteDesde,
    //       cbteHasta: data.CbteHasta,
    //       cbteFch: data.CbteFch.toString(),
    //       impTotal: data.ImpTotal,
    //       impTotConc: data.ImpTotConc,
    //       impNeto: data.ImpNeto,
    //       impOpEx: data.ImpOpEx,
    //       impIVA: data.ImpIVA,
    //       impTrib: data.ImpTrib,
    //       monId: data.MonId,
    //       monCotiz: data.MonCotiz,
    //       ivaItems: {
    //         create: data.Iva.map((item: any) => ({
    //           tipoId: item.Id,
    //           baseImp: item.BaseImp,
    //           importe: item.Importe,
    //         })),
    //       },
    //     },
    //     include: {
    //       ivaItems: true,
    //     },
    //   });

    //   return res.status(201).json(comprobante);
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ error: "Error al guardar el comprobante" });
    // }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
