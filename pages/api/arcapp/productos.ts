import type { NextApiRequest, NextApiResponse } from 'next';
import { get_products, get_product_by_id, create_product, update_product, delete_product } from '../../../services/ProductosServices';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if(req.method == 'GET' && req.query.id_arca) {
        const id = req.query.id_arca as string;

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

    if(req.method == 'POST') {
        const { id_arca, descripcion, precioUnitario } = req.body;

        if (!id_arca || !descripcion || !precioUnitario) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        try {
            const producto = {
                id_arca,
                descripcion,
                precioUnitario: parseFloat(precioUnitario)
            };

            const productos = await create_product(producto);

            if (!productos) {
                return res.status(500).json({ error: 'Error al crear el producto' });
            }

            return res.status(201).json({ message: 'Producto creado exitosamente', producto });
        } catch (error) {
            console.error('Error al crear el producto:', error);
            return res.status(500).json({ error: 'Error al crear el producto' });
        }
    }

    if(req.method == 'PUT' && req.query.id) {
        const id = req.query.id as string;
        const { descripcion, precioUnitario, id_arca } = req.body;

        if (!descripcion || !precioUnitario) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        try {
            const producto = {
                id_arca: parseInt(id_arca),
                descripcion,
                precioUnitario: parseFloat(precioUnitario)
            };

            const updatedProducto = await update_product(id, producto);

            if (!updatedProducto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            return res.status(200).json({ message: 'Producto actualizado exitosamente', producto: updatedProducto });
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return res.status(500).json({ error: 'Error al actualizar el producto' });
        }

        return res.status(405).json({ error: 'Método no permitido' });

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
