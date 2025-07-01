import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface VentasLineChartProps {
  data: Array<{
    mes?: string;
    fecha?: string;
    total: number;
    cantidad: number;
  }>;
  title?: string;
  dataKey?: string;
  xAxisKey?: string;
}

const VentasLineChart: React.FC<VentasLineChartProps> = ({ 
  data, 
  title = "Ventas", 
  dataKey = "total",
  xAxisKey = "mes" 
}) => {
  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'total' ? `$${value.toLocaleString()}` : value,
              name === 'total' ? 'Total' : 'Cantidad'
            ]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="cantidad" 
            stroke="#dc2626" 
            strokeWidth={2}
            dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VentasLineChart;
