import React from 'react';

interface EstadisticasGeneralesProps {
  data: {
    totalComprobantes: number;
    totalProductos: number;
    totalVentas: number;
    promedioVenta: number;
  };
}

const EstadisticasGenerales: React.FC<EstadisticasGeneralesProps> = ({ data }) => {
  const estadisticas = [
    {
      titulo: 'Total Comprobantes',
      valor: data.totalComprobantes.toLocaleString(),
      icono: '📄',
      color: 'bg-blue-500',
    },
    {
      titulo: 'Total Productos',
      valor: data.totalProductos.toLocaleString(),
      icono: '📦',
      color: 'bg-green-500',
    },
    {
      titulo: 'Total Ventas',
      valor: `$${data.totalVentas.toLocaleString()}`,
      icono: '💰',
      color: 'bg-yellow-500',
    },
    {
      titulo: 'Promedio por Venta',
      valor: `$${data.promedioVenta.toLocaleString()}`,
      icono: '📊',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {estadisticas.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.titulo}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
            </div>
            <div className={`${stat.color} rounded-full p-3 text-white text-2xl`}>
              {stat.icono}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EstadisticasGenerales;
