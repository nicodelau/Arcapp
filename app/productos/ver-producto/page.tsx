'use client';
import React, { useState, useEffect } from 'react';

export default function CrearProductoPage() {
    type Producto = {
        descripcion: string;
        cantidad: number;
        id_arca: number;
        precioUnitario: number;
    };

    const [productos, setProductos] = useState<Producto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
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
                        setError(null);
                    }, 3000);
                    return [];
                });

            if (!fetchProds || fetchProds.length === 0) {
                setError('No se encontraron productos');
                setTimeout(() => {
                    setError(null);
                }, 3000);
                return;
            }

            if (fetchProds.error) {
                setError(fetchProds.error);
                setTimeout(() => {
                    setError(null);
                }, 3000);
                return;
            }

            console.log('Productos obtenidos:', fetchProds);

            setProductos(fetchProds);
            setLoading(false);
        };

        fetchProductos();
    }, []);
    return (
        <div className="container mt-5">
            <section className="mt-6">

                {productos.length > 0 && (
                    <table className="w-full mb-4 border border-gray-200 rounded-lg overflow-hidden text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 text-left">Descripción</th>
                                <th className="px-3 py-2 text-left">Id ARCA</th>
                                <th className="px-3 py-2 text-left">Precio Unitario</th>
                                <th className="px-3 py-2 text-left">Modificar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((p, i) => (
                                <tr key={i} className="border-t border-gray-200">
                                    <td className="px-3 py-2">{p.descripcion}</td>
                                    <td className="px-3 py-2">{p.id_arca}</td>
                                    <td className="px-3 py-2">${p.precioUnitario}</td>
                                    <td className="px-3 py-2">
                                        <a href={`/productos/modificar-producto/${p.id_arca}`} className="text-blue-600 hover:underline">Modificar</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {productos.length === 0 && (
                    <section className="mt-6 mb-6 bg-red-100 p-4 rounded-lg shadow-md">
                        <p className="text-red-700 text-center">{error}</p>
                    </section>
                )}
            </section>
        </div>
    );
}