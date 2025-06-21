import type { NextApiRequest, NextApiResponse } from 'next';
import { get_comprobante_by_id, get_comprobantes, create_comprobante } from '../../../services/ComprobatesServices';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if(req.method == 'GET' && req.query.id_arca) {
        const id = req.query.id_arca as string;

        try {
            const comprobante = await get_comprobante_by_id(id);
            
            if (!comprobante)
                return res.status(404).json({ error: 'comprobante no encontrado' });
            
            return res.status(200).json(comprobante);
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener el comprobante' });
        }
    }

    if(req.method == 'GET') {
        try {
            const comprobantes = await get_comprobantes();
            
            if (!comprobantes)
                return res.status(404).json({ error: 'No se encontraron comprobantes' });
            
            return res.status(200).json(comprobantes);
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener comprobantes' });
        }
    }

    if(req.method == 'POST') {
        const comprobante = req.body;
        try {
            const comprobantes = await create_comprobante(comprobante);

            if (!comprobantes) {
                return res.status(500).json({ error: 'Error al crear el comprobante' });
            }

            return res.status(201).json({ message: 'comprobante creado exitosamente', comprobante });
        } catch (error) {
            console.error('Error al crear el comprobante:', error);
            return res.status(500).json({ error: 'Error al crear el comprobante' });
        }
    }

}
