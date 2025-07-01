'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UsuarioPage() {
    const { user, isAuthenticated, updateUser, token } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        nombre: '',
        apellido: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                email: user.user_email || (user as any).email || '',
                nombre: user.nombre || '',
                apellido: user.apellido || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log('Token available:', !!token);
            
            if (!token) {
                setError('No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.');
                setLoading(false);
                return;
            }

            const updateData: any = {
                username: formData.username,
                email: formData.email,
                nombre: formData.nombre,
                apellido: formData.apellido
            };

            console.log('Update data:', updateData);

            // Si se quiere cambiar la contraseña
            if (showPasswordFields && formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    setError('Las contraseñas nuevas no coinciden');
                    setLoading(false);
                    return;
                }
                if (formData.newPassword.length < 6) {
                    setError('La nueva contraseña debe tener al menos 6 caracteres');
                    setLoading(false);
                    return;
                }
                if (!formData.currentPassword) {
                    setError('Debe ingresar su contraseña actual');
                    setLoading(false);
                    return;
                }
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData)
            });

            console.log('Response status:', response.status);
            
            if (response.ok) {
                const responseData = await response.json();
                setSuccess('Perfil actualizado correctamente');
                
                // Actualizar el usuario en el contexto
                updateUser({
                    username: formData.username,
                    user_email: formData.email,
                    nombre: formData.nombre,
                    apellido: formData.apellido
                });
                
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
                setShowPasswordFields(false);
                
                // Limpiar mensaje después de 3 segundos
                setTimeout(() => setSuccess(null), 3000);
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                console.log('Error response:', errorData);
                setError(errorData.message || 'Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if (error instanceof TypeError && error.message.includes('fetch')) {
                setError('Error de conexión con el servidor. Verifique su conexión a internet.');
            } else {
                setError(`Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container mt-5">
                <section className="bg-red-100 p-4 rounded-lg shadow-md">
                    <p className="text-red-700 text-center">Debe iniciar sesión para acceder a esta página</p>
                </section>
            </div>
        );
    }

    return (
        <div className="container mt-5 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
                
                {error && (
                    <section className="mb-6 bg-red-100 p-4 rounded-lg shadow-md">
                        <p className="text-red-700 text-center">{error}</p>
                    </section>
                )}
                
                {success && (
                    <section className="mb-6 bg-green-100 p-4 rounded-lg shadow-md">
                        <p className="text-green-700 text-center">{success}</p>
                    </section>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Cambiar contraseña</h3>
                            <button
                                type="button"
                                onClick={() => setShowPasswordFields(!showPasswordFields)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                {showPasswordFields ? 'Cancelar' : 'Cambiar contraseña'}
                            </button>
                        </div>

                        {showPasswordFields && (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña actual
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nueva contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmar nueva contraseña
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6">
                        {loading ? (
                            <LoadingSpinner message="Actualizando perfil..." />
                        ) : (
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Actualizar Perfil
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
