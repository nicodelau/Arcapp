'use client';

import React from 'react';
import { useEstadisticas } from '../../lib/useEstadisticas';
import VentasLineChart from '../components/charts/VentasLineChart';
import ProductosBarChart from '../components/charts/ProductosBarChart';
import TipoComprobantesPieChart from '../components/charts/TipoComprobantesPieChart';
import EstadisticasGenerales from '../components/charts/EstadisticasGenerales';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EstadisticasPage() {
  const { data, loading, error, refetch } = useEstadisticas();

  if (loading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message='Cargando datos...' />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar estadísticas</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">No hay datos disponibles</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Estadísticas</h1>
                <p className="text-gray-600 mt-2">Resumen de ventas y estadísticas del negocio</p>
              </div>
              <button
                onClick={refetch}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <span>🔄</span>
                Actualizar
              </button>
            </div>
          </div>

          {/* Estadísticas Generales */}
          <EstadisticasGenerales data={data.estadisticasGenerales} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Ventas por Mes */}
            <VentasLineChart 
              data={data.ventasPorMes} 
              title="Ventas por Mes"
              xAxisKey="mes"
            />

            {/* Ventas Últimos 7 Días */}
            <VentasLineChart 
              data={data.ventasUltimos7Dias} 
              title="Ventas Últimos 7 Días"
              xAxisKey="fecha"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Productos Más Vendidos */}
            <ProductosBarChart 
              data={data.productosMasVendidos} 
              title="Top 5 Productos Más Vendidos"
            />

            {/* Ventas por Tipo de Comprobante */}
            <TipoComprobantesPieChart 
              data={data.ventasPorTipo} 
              title="Distribución por Tipo de Comprobante"
            />
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Última actualización:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Total de gráficos:</strong> 4</p>
              </div>
              <div>
                <p><strong>Período de datos:</strong> Histórico completo</p>
                <p><strong>Moneda:</strong> Pesos Argentinos (ARS)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
