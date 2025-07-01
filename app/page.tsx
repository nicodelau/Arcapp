'use client';

import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from '../lib/useAuth';
import { useEstadisticas } from '../lib/useEstadisticas';
import EstadisticasGenerales from './components/charts/EstadisticasGenerales';
import VentasLineChart from './components/charts/VentasLineChart';
import Link from 'next/link';
import LoadingSpinner from './components/LoadingSpinner';

export default function Home() {
  const { user } = useAuth();
  const { data, loading } = useEstadisticas();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido{user?.username ? `, ${user.username}` : ''}
            </h1>
            <p className="text-gray-600 mt-2">Panel de control principal - AFIP App</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/comprobantes/crear-comprobante">
              <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">📄</div>
                <h3 className="font-semibold">Crear Comprobante</h3>
                <p className="text-sm opacity-90">Generar nueva factura</p>
              </div>
            </Link>
            
            <Link href="/productos/crear-producto">
              <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">📦</div>
                <h3 className="font-semibold">Crear Producto</h3>
                <p className="text-sm opacity-90">Agregar nuevo producto</p>
              </div>
            </Link>
            
            <Link href="/comprobantes">
              <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg hover:bg-purple-600 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-semibold">Ver Comprobantes</h3>
                <p className="text-sm opacity-90">Consultar facturas</p>
              </div>
            </Link>
            
            <Link href="/estadisticas">
              <div className="bg-orange-500 text-white p-6 rounded-lg shadow-lg hover:bg-orange-600 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold">Estadísticas</h3>
                <p className="text-sm opacity-90">Ver dashboard completo</p>
              </div>
            </Link>
          </div>

          {/* Dashboard Preview */}
          {loading ? (
            <LoadingSpinner message="Cargando estadísticas..." />
          ) : data ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Resumen de Estadísticas</h2>
                <Link href="/estadisticas">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Ver Dashboard Completo
                  </button>
                </Link>
              </div>
              
              {/* Estadísticas Generales */}
              <EstadisticasGenerales data={data.estadisticasGenerales} />
              
              {/* Gráfico de Ventas Últimos 7 Días */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <VentasLineChart 
                  data={data.ventasUltimos7Dias} 
                  title="Ventas de los Últimos 7 Días"
                  xAxisKey="fecha"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay datos disponibles</h3>
              <p className="text-gray-600">Crea algunos comprobantes para ver las estadísticas</p>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
