'use client';
import React, { useEffect, useState } from 'react';

export default function ModificarProducto({ params }: { params: { id: string } }) {
    const productoId = params.id;
    const [producto, setProducto] = React.useState<Producto | null>((null));
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [form, setForm] = useState({
        id_arca: "",
        descripcion: "",
        precioUnitario: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    if (!productoId) {
        return (
            <div className="container mt-5">
                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-red-600 mb-4 border-b pb-1 text-center">Error</h2>
                    <p className="text-center text-red-600">No se ha proporcionado un ID de producto válido.</p>
                </section>
            </div>
        );
    }

    const fetchProducto = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/arcapp/productos?id_arca=${productoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener el producto');
            }
            const producto = await response.json();
            if (producto.error) {
                throw new Error(producto.error);
            }
            setProducto(producto);
            setLoading(false);
            setSuccess('Producto cargado exitosamente');
            setTimeout(() => {
                setSuccess('');
            }, 3000);
        } catch (error) {
            setError(error.message);
            setSuccess(null);
            setTimeout(() => {
                setError(null);
            }, 3000);
        }
    }

    useEffect(() => {
        fetchProducto();
    }, [productoId]);

    return (
        <div className="container mt-5">
            {loading && <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="text-blue-700 font-medium">Cargando producto...</span>
            </div>}
            {error && (
                <section className="mt-6 mb-6 bg-red-100 p-4 rounded-lg shadow-md">
                    <p className="text-red-700 text-center">{error}</p>
                </section>
            )}
            {success && (
                            <section className="mt-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1 text-center">Modificar Producto</h2>
                <div className="flex flex-col items-center gap-4 justify-center">
                    <form action={`/productos/modificar-producto/${productoId}`} method="POST" className="w-full max-w-md">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="number"
                                name="docArca"
                                id="docArca"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                onChange={(e) => handleChange(e)}
                                value={producto ? producto.id_arca : ''}
                                required
                            />
                            <label htmlFor="docArca" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Número de ID en ARCA</label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="descripcion"
                                id="descripcion"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                onChange={(e) => handleChange(e)}
                                value={producto ? producto.descripcion : ''}
                                required
                            />
                            <label htmlFor="descripcion" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Descripción</label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="number"
                                name="precioUnitario"
                                id="precioUnitario"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                onChange={(e) => handleChange(e)}
                                value={producto ? producto.precioUnitario : ''}
                                required
                            />
                            <label htmlFor="precioUnitario" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Precio Unitario</label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Modificar Producto
                        </button>
                    </form>
                </div>
            </section>
            )}
        </div>
    );
}