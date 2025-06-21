'use client';

import { use, useEffect, useState } from 'react';
import React from 'react';

export default function Page({ params }: { params: { nro_comprobante?: string, tipo_comprobante?: string } }) {
    const { nro_comprobante } = params;
    const [comprobante, setComprobante] = useState<string | null>(nro_comprobante || null);
    const [tipoComprobante, setTipoComprobante] = useState<string>('6');
    const [comprobanteData, setComprobanteData] = useState<object | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [tributos, setTributos] = useState<object[]>([]);

    const fetchComprobante = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // You need to use the current state values for comprobante and tipoComprobante
            const response = await fetch(`/api/comprobantes?nro_comprobante=${comprobante}&tipo_comprobante=${tipoComprobante}`);
            if (!response.ok) {
                throw new Error('Comprobante no encontrado');
            }
            const data = await response.json();
            if(data.Errors) {
                // console.log(data.Errors.Err[0].Code, data.Errors.Err[0].Msg);
                setError(data.Errors.Err[0].Msg);

            }
        } catch (error) {
            console.error('Error fetching comprobante:', error);
            setComprobanteData(null);
        }
    };

    const fetchTiposOpciones = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/arca/tipos-opciones');
            if (!response.ok) {
                throw new Error('Error al obtener tipos de opciones');
            }
            const data = await response.json();
            data.ResultGet
            // Aquí podrías hacer algo con los tipos de opciones, como guardarlos en el estado
        } catch (error) {
            console.error('Error fetching tipos opciones:', error);
            setError('Error al obtener tipos de opciones');
        }
        setLoading(false);
    };

    const fetchTiposTributos = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/arca/tipos-tributos');
            if (!response.ok) {
                throw new Error('Error al obtener tipos de tributos');
            }
            const data = await response.json();
            setTributos(data.ResultGet.TributoTipo);
        } catch (error) {
            console.error('Error fetching tipos tributos:', error);
            setError('Error al obtener tipos de tributos');
        }
        setLoading(false);
    };
    useEffect(() => {
        if (comprobante) {
        }
        fetchTiposOpciones();
        fetchTiposTributos();
    }, [comprobante, tipoComprobante]);

    return (
        <div className="container mt-5">
                <h1>Ver tributos</h1>
                {(tributos && tributos.length > 0) && (
                    <div className="mb-3">
                        <label htmlFor="tipo_tributo" className="form-label">Tipos de Tributos</label>
                        <select className="form-select" id="tipo_tributo">
                            {tributos.map((tributo: any) => (
                                <option key={tributo.Id} value={tributo.Id}>
                                    {tributo.Desc}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            <form onSubmit={fetchComprobante} className='form-comprobante'>
                <div className="mb-3">
                    <label htmlFor="nro_comprobante" className="form-label">Número de Comprobante</label>
                    <input
                        type="number"
                        className="form-control"
                        id="nro_comprobante"
                        placeholder="Ingrese el número de comprobante"
                        min={1}
                        max={9999}
                        value={comprobante ?? '1'}
                        onChange={(e) => setComprobante(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tipo_comprobante" className="form-label">Tipo de Comprobante</label>
                    <select
                        className="form-select"
                        id="tipo_comprobante"
                        value={tipoComprobante}
                        onChange={(e) => setTipoComprobante(e.target.value)}>
                        <option value="1">Factura A</option>
                        <option value="2">Factura B</option>
                        <option value="3">Nota de Crédito A</option>
                        <option value="4">Nota de Débito A</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Buscar Comprobante</button>
            </form>
            {loading && <div className="mt-3">Cargando comprobante...</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
}