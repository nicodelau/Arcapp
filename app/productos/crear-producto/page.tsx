'use client';
import React, { useState } from 'react';

export default function CrearProductoPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [form, setForm] = useState({
        id_arca: "",
        descripcion: "",
        precioUnitario: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const producto = {
            id_arca: parseInt(form.id_arca),
            descripcion: form.descripcion,
            precioUnitario: parseFloat(form.precioUnitario)
        };
        
        try {
            const response = await fetch('/api/arcapp/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(producto),
            });

            if (!response.ok) {
                throw new Error('Error al crear el producto');
            }

            const data = await response.json();
            if (data.error) {
                setError(data.error);
                return;
            }
            setSuccess('Producto creado exitosamente');
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (error: any) {
            setError(error.message || 'Error al crear el producto');
            setTimeout(() => {
                setError(null);
            }, 3000);
            return;
        }

        setForm({
            id_arca: "",
            descripcion: "",
            precioUnitario: "",
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };
    return (
        <div>
            <div className="container mt-5">
                {error &&
                    <section className="mt-6 mb-6 bg-red-100 p-4 rounded-lg shadow-md">
                        <p className="text-red-700 text-center">{error}</p>
                    </section>
                }
                {success &&
                    <section className="mt-6 mb-6 bg-green-100 p-4 rounded-lg shadow-md">
                        <p className="text-green-700 text-center">{success}</p>
                    </section>
                }
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="container mt-5">
                <section className="mt-6">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1 text-center">Crear Producto</h2>
                    <div className="flex flex-col items-center gap-4 justify-center">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="number"
                                name="id_arca"
                                id="id_arca"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={form.id_arca ?? ""}
                                onChange={handleChange}
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
                                value={form.descripcion ?? ""}
                                onChange={handleChange}
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
                                value={form.precioUnitario ?? ""}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="precioUnitario" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Precio Unitario</label>
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-6">Crear Producto</button>
                    </div>
                </section>
            </div>
        </form>
        </div>
    );
}