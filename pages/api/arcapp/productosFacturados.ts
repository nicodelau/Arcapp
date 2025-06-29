import type { NextApiRequest, NextApiResponse } from 'next';
import { get_products, get_product_by_id, delete_product } from '../../../services/ProductosFacturadosServices';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // aca el id es del comprobante
    if(req.method == 'GET' && req.query.id) {
        const id = req.query.id as string;

        try {
            const producto = await get_product_by_id(id);
            
            if (!producto)
                return res.status(404).json({ error: 'Producto no encontrado' });
            
            return res.status(200).json(producto);
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener el producto' });
        }
    }

    if(req.method == 'GET') {
        try {
            const productos = await get_products();
            
            if (!productos)
                return res.status(404).json({ error: 'No se encontraron productos' });
            
            return res.status(200).json(productos);
        } catch (error) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
    }

    if(req.method == 'DELETE' && req.query.id) {
        const id = req.query.id as string;
        
        try {
            const deleted = await delete_product(id);

            if (!deleted) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            return res.status(200).json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }

}
