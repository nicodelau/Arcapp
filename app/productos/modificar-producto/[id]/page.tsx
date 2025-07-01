'use client';
import React, { useEffect, useState, use } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface PageProps {
    params: Promise<{ id: string }>;
}

type Producto = {
    id?: number;
    id_arca?: number;
    descripcion?: string;
    precioUnitario?: number;
};

export default function ModificarProducto({ params }: PageProps) {
    const { id: productoId } = use(params);
    const [producto, setProducto] = React.useState<Producto | null>((null));
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [form, setForm] = useState({
        id: productoId,
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
            const response = await fetch(`/api/arcapp/productos?id=${productoId}`, {
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

            setProducto(producto[0]);
            setForm({
                id: productoId,
                id_arca: producto[0]?.id_arca || '',
                descripcion: producto[0]?.descripcion || '',
                precioUnitario: producto[0]?.precioUnitario || '',
            });
            setLoading(false);
            setSuccess('Producto cargado exitosamente');

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/arcapp/productos?id=${form.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error('Error al modificar el producto');
            }

            const data = await response.json();
            setSuccess('Producto modificado exitosamente');
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error: any) {
            setError(error.message);
            setTimeout(() => {
                setError(null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            {loading && <LoadingSpinner message="Cargando producto..." />}
            {error && (
                <section className="mt-6 mb-6 bg-red-100 p-4 rounded-lg shadow-md">
                    <p className="text-red-700 text-center">{error}</p>
                </section>
            )}
            {success && (
                <section className="mt-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1 text-center">Modificar Producto</h2>
                <div className="flex flex-col items-center gap-4 justify-center">
                    <form onSubmit={handleSubmit} method="POST" className="w-full max-w-md">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="number"
                                name="id_arca"
                                id="id_arca"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                onChange={handleChange}
                                value={form.id_arca}
                                required
                            />
                            <label htmlFor="id_arca" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Número de ID en ARCA</label>
                        </div>
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="descripcion"
                                id="descripcion"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                onChange={handleChange}
                                value={form.descripcion}
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
                                onChange={handleChange}
                                value={form.precioUnitario}
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