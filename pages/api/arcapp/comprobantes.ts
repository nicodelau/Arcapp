import type { NextApiRequest, NextApiResponse } from 'next';
import { get_comprobante_by_id, get_comprobantes, create_comprobante, get_comprobante_by_tipo } from '../../../services/ComprobatesServices';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET' && req.query.CbteTipo) {
        const tipo = req.query.CbteTipo as string;
        try {
            if(tipo === '3') {
                const comprobante = await get_comprobante_by_tipo('1');
                if(!comprobante) {
                    return res.status(204).json({});
                }

                if (!comprobante) {
                    return res.status(404).json({ error: 'comprobante no encontrado' });
                }
                
                return res.status(200).json(
                    {...comprobante,
                docNro: comprobante.docNro.toString()}
                );
            } else if(tipo === '8') {
                
                const comprobante = await get_comprobante_by_tipo('6');
                if(!comprobante) {
                    return res.status(204).json({});
                }
                return res.status(200).json(
                    {...comprobante,
                docNro: comprobante.docNro.toString()}
                );
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener el comprobante' });
        }

    }
    
    if(req.method == 'GET' && req.query.id) {
        const id = req.query.id as string;
        try {
            const comprobante = await get_comprobante_by_id(id);
            
            if (!comprobante)
                return res.status(404).json({ error: 'comprobante no encontrado' });
            
            return res.status(200).json(
                {...comprobante,
                docNro: comprobante.docNro.toString()}
            );
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener el comprobante' });
        }
    }

    if(req.method == 'GET') {
        try {
            const comprobantes = await get_comprobantes();
            
            if (!comprobantes)
                return res.status(404).json({ error: 'No se encontraron comprobantes' });

            const comprobantesSerializados = comprobantes.map(comprobante => ({
                ...comprobante,
                docNro: comprobante.docNro.toString(),
            }));

            return res.status(200).json(comprobantesSerializados);
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
