'use client';

import React, { useState, useEffect } from 'react';
import ComprobantesAccordion from '../../components/ComprobantesAcordion';
export default function ComprobantesPage() {
  const [comprobantes, setComprobantes] = useState<[any]>([{}]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchComprobante = async () => {
    try {
      const response = await fetch('/api/arcapp/comprobantes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener el comprobante');
      }
      const data = await response.json();
      setComprobantes(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComprobante();
  }, []);

  return (
    <div>
      {error && (
        <section className="mt-6 mb-6 bg-red-100 p-4 rounded-lg shadow-md">
          <p className="text-red-700 text-center">{error}. Para crear un producto, aprete <a className='text-red-900' href="/productos/crear-producto">aqui</a></p>
        </section>
      )}
      {loading && <div className="flex items-center justify-center py-8">
        <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-blue-700 font-medium">Cargando productos...</span>
      </div>}
      {!loading && comprobantes && (
        <ComprobantesAccordion comprobantes={comprobantes} />
      )}
    </div>
  );
}
