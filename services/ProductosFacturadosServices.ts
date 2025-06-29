import { prisma  } from '../lib/prisma';

export async function get_products() {
  try {
    const productos = await prisma.productoFacturado.findMany({
      orderBy: {
        comprobanteId: 'asc',
      }
    });
    return productos;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw new Error('Error al obtener productos');
  }
}

export async function get_product_by_id(id: string) {
  try {
    const producto = await prisma.productoFacturado.findMany({
      where: { comprobanteId: parseInt(id) }
    })
    return producto;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    throw new Error('Error al obtener el producto');
  }
}

export async function delete_product(id: string) {
  try {
    const productoEliminado = await prisma.productoFacturado.delete({
      where: { id: parseInt(id) },
    });
    return productoEliminado;
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw new Error('Error al eliminar el producto');
  }
}