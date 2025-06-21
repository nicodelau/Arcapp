import React from "react";

interface Producto {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total?: number;
}

interface ProductosTableProps {
  productos: Producto[];
}

export default function ProductosTable({ productos }: ProductosTableProps) {
  if (productos.length === 0) return null;
  return (
    <table className="w-full mb-4 border border-gray-200 rounded-lg overflow-hidden text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-2 text-left">Descripción</th>
          <th className="px-3 py-2 text-left">Cantidad</th>
          <th className="px-3 py-2 text-left">Precio Unitario</th>
          <th className="px-3 py-2 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p, i) => (
          <tr key={i} className="border-t border-gray-200">
            <td className="px-3 py-2">{p.descripcion}</td>
            <td className="px-3 py-2">{p.cantidad}</td>
            <td className="px-3 py-2">${p.precioUnitario}</td>
            <td className="px-3 py-2">${p.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
