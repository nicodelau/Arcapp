'use client';

import React, { useState, useEffect } from 'react';
import ComprobantesAccordion from '../../components/ComprobantesAcordion';
import LoadingSpinner from '../../components/LoadingSpinner';
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
      {loading && <LoadingSpinner message="Cargando productos..." />}
      {!loading && comprobantes && (
        <ComprobantesAccordion comprobantes={comprobantes} />
      )}
    </div>
  );
}
