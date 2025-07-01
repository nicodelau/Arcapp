import { useState, useEffect } from 'react';

interface EstadisticasData {
  ventasPorMes: Array<{
    mes: string;
    total: number;
    cantidad: number;
  }>;
  productosMasVendidos: Array<{
    nombre: string;
    cantidad: number;
    total: number;
  }>;
  ventasPorTipo: Array<{
    tipo: string;
    total: number;
    cantidad: number;
  }>;
  estadisticasGenerales: {
    totalComprobantes: number;
    totalProductos: number;
    totalVentas: number;
    promedioVenta: number;
  };
  ventasUltimos7Dias: Array<{
    fecha: string;
    total: number;
    cantidad: number;
  }>;
}

export const useEstadisticas = () => {
  const [data, setData] = useState<EstadisticasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/estadisticas?tipo=todas');
      
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }
      
      const estadisticas = await response.json();
      setData(estadisticas);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticaEspecifica = async (tipo: string, params?: Record<string, string>) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ tipo, ...params });
      const response = await fetch(`/api/estadisticas?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar estadística específica');
      }
      
      const estadistica = await response.json();
      return estadistica;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchEstadisticas,
    fetchEspecifica: fetchEstadisticaEspecifica,
  };
};
