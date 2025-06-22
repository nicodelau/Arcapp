'use client';
import React, { useState, useEffect } from 'react';
import Pencil from '../../components/icons/Pencil';
import Trash from '../../components/icons/Trash';

export default function CrearProductoPage() {
    type Producto = {
        id: number;
        descripcion: string;
        cantidad: number;
        id_arca: number;
        precioUnitario: number;
    };

    const [productos, setProductos] = useState<Producto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const fetchProductos = async () => {
        setLoading(true);
        setError(null);
        
        const fetchProds = await fetch('/api/arcapp/productos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .catch(error => {
            setError('Error al obtener productos');
            setTimeout(() => {
                setError(error);
            }, 3000);
            return [];
        });

        if (!fetchProds || fetchProds.length === 0) {
            setError('No se encontraron productos');
            setLoading(false);
            return;
        }

        setProductos(fetchProds);
        setLoading(false);
    };

    const eliminarProducto = (id: number) => async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        const response = await fetch(`/api/arcapp/productos?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            setSuccess('Producto eliminado correctamente');
            setLoading(false);
            setTimeout(() => {
                setSuccess(null);
                fetchProductos();
            }, 3000);
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Error al eliminar el producto');
            setLoading(false);
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);
    return (
        <div className="container mt-5">
            <section className="mt-6">

                {productos.length > 0 && !loading && (
                    <table className="w-full mb-4 border border-gray-200 rounded-lg overflow-hidden text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 text-left">Descripción</th>
                                <th className="px-3 py-2 text-left">Id ARCA</th>
                                <th className="px-3 py-2 text-left">Precio Unitario</th>
                                <th className="px-3 py-2 text-left">Modificar</th>
                                <th className="px-3 py-2 text-left">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((p, i) => (
                                <tr key={i} className="border-t border-gray-200">
                                    <td className="px-3 py-2">{p.descripcion}</td>
                                    <td className="px-3 py-2">{p.id_arca}</td>
                                    <td className="px-3 py-2">${p.precioUnitario}</td>
                                    <td className="px-3 py-2">
                                        <a href={`/productos/modificar-producto/${p.id}`} className="text-yellow-600 hover:underline text-xl"><Pencil /></a>
                                    </td>
                                    <td className="px-3 py-2">
                                        <p onClick={eliminarProducto(p.id)} className="text-red-600 hover:underline text-xl cursor-pointer"><Trash /></p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {productos.length === 0 && error != null && (
                    <section className="mt-6 mb-6 bg-red-100 p-4 rounded-lg shadow-md">
                        <p className="text-red-700 text-center">{error}. Para crear un producto, aprete <a className='text-red-900' href="/productos/crear-producto">aqui</a></p>
                    </section>
                )}
                {success && (
                    <section className="mt-6 mb-6 bg-green-100 p-4 rounded-lg shadow-md">
                        <p className="text-green-700 text-center">{success}</p>
                    </section>
                )}
                {loading && <div className="flex items-center justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span className="text-blue-700 font-medium">Cargando productos...</span>
                </div>}
            </section>
        </div>
    );
}