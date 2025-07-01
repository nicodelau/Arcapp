import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ProductosBarChartProps {
  data: Array<{
    nombre: string;
    cantidad: number;
    total: number;
  }>;
  title?: string;
  dataKey?: string;
}

const ProductosBarChart: React.FC<ProductosBarChartProps> = ({ 
  data, 
  title = "Productos Más Vendidos",
  dataKey = "cantidad" 
}) => {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="nombre" 
            tick={{ fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'total' ? `$${value.toLocaleString()}` : value,
              name === 'total' ? 'Total Vendido' : 'Cantidad Vendida'
            ]}
          />
          <Legend />
          <Bar 
            dataKey="cantidad" 
            fill="#3b82f6" 
            name="Cantidad"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="total" 
            fill="#10b981" 
            name="Total ($)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductosBarChart;
