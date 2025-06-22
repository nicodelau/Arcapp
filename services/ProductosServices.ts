import { prisma  } from '../lib/prisma';

export async function get_products() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: {
        id_arca: 'asc',
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
    const producto = await prisma.producto.findFirst({
      where: { id: parseInt(id) }
    })
    return producto;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    throw new Error('Error al obtener el producto');
  }
}

export async function create_product(data: any) {
  try {
    const { id_arca, descripcion, precioUnitario } = data;
    const nuevoProducto = await prisma.producto.create({
      data: {
        id_arca: parseInt(id_arca),
        descripcion,
        precioUnitario: parseFloat(precioUnitario),
      },
    });
    return nuevoProducto;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw new Error('Error al crear el producto');
  }
}

export async function update_product(id: string, data: any) {
  try {
    const { id_arca, descripcion, precioUnitario } = data;
    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        id_arca: parseInt(id_arca),
        descripcion,
        precioUnitario: parseFloat(precioUnitario),
      },
    });
    return productoActualizado;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw new Error('Error al actualizar el producto');
  }
}

export async function delete_product(id: string) {
  try {
    const productoEliminado = await prisma.producto.delete({
      where: { id: parseInt(id) },
    });
    return productoEliminado;
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    throw new Error('Error al eliminar el producto');
  }
}