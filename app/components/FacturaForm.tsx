'use client';

import React, { useState, useEffect } from "react";

interface Comprobante {
  idIVAReceptor: number | null;
  tipoCbte: number | null;
  concepto: number | null;
  docTipo: number | null;
  docNro: number | null;
  cbteDesde: number | null;
  cbteHasta: number | null;
  cbteFch: string;
  impTotal: number | null;
  impTotConc: number | null;
  impNeto: number | null;
  impOpEx: number | null;
  impIVA: number | null;
  impTrib: number | null;
  monId: string;
  createdAt: string;
  ivaItems: { Id: number; BaseImp: number; Importe: number }[];
  Productos: any[];
}

export default function FacturaForm() {
  const [alicuota, setAlicuota] = useState<string | null>(null);
  const [alicuotas, setAlicuotas] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [productoActual, setProductoActual] = useState({ descripcion: "", cantidad: 1, precioUnitario: 0 });
  const [ivaItems, setIvaItems] = useState<{ Id: number; BaseImp: number; Importe: number }[]>([]);

  const [form, setForm] = useState<Comprobante>({
    idIVAReceptor: null,
    tipoCbte: null,
    concepto: null,
    docTipo: null,
    docNro: null,
    cbteDesde: null,
    cbteHasta: null,
    cbteFch: new Date().toISOString().split('T')[0],
    impTotal: null,
    impTotConc: null,
    impNeto: null,
    impOpEx: null,
    impIVA: null,
    impTrib: null,
    monId: "PES",
    createdAt: new Date().toISOString(),
    ivaItems: [
      {
        Id: 5,
        BaseImp: 0,
        Importe: 0,
      },
    ],
    Productos: [],
  });

  const fetchAlicuotas = async () => {
    const res = await fetch('/api/arca/alicuotas');
    const data = await res.json();
    setAlicuotas(data.ResultGet.IvaTipo);
  };

  useEffect(() => {
    fetchAlicuotas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAlicuotaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlicuota(e.target.value);
    const selected = alicuotas.find(item => JSON.stringify(item) === e.target.value);
    if (selected) {
      const porcentaje = Number(selected.Desc.replace('%', '')) || 21;
      const impNeto = productos.reduce((acc, p) => acc + p.cantidad * p.precioUnitario, 0);
      const impIVA = +(impNeto * porcentaje / 100).toFixed(2);
      setForm({
        ...form,
        impNeto,
        impIVA,
        impTotal: + (impNeto + impIVA).toFixed(2),
        ivaItems: [
          {
            Id: selected.Id,
            BaseImp: impNeto,
            Importe: impIVA,
          },
        ]
      });
    }
  };

  const handleProductoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductoActual({
      ...productoActual,
      [e.target.name]: e.target.name === 'descripcion'
        ? e.target.value
        : parseFloat(e.target.value)
    });
  };

  const agregarProducto = () => {
    const nuevoProducto = {
      ...productoActual,
      total: +(productoActual.cantidad * productoActual.precioUnitario).toFixed(2)
    };
    const nuevosProductos = [...productos, nuevoProducto];
    setProductos(nuevosProductos);
    setForm(prev => ({
      ...prev,
      Productos: nuevosProductos
    }));

    // Actualizar totales
    if (alicuota) {
      const selected = JSON.parse(alicuota);
      const porcentaje = Number(selected.Desc.replace('%', ''));
      const impNeto = nuevosProductos.reduce((acc, p) => acc + p.total, 0);
      const impIVA = +(impNeto * porcentaje / 100).toFixed(2);
      setForm(prev => ({
        ...prev,
        impNeto,
        impIVA,
        impTotal: +(impNeto + impIVA).toFixed(2),
        ivaItems: [
          {
            Id: selected.Id,
            BaseImp: impNeto,
            Importe: impIVA,
          },
        ]
      }));
    }

    setProductoActual({ descripcion: "", cantidad: 1, precioUnitario: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/arca/comprobantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1">Agregar productos</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Descripción" name="descripcion" value={productoActual.descripcion} onChange={handleProductoChange} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
          <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Cantidad" name="cantidad" value={productoActual.cantidad} onChange={handleProductoChange} />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
          <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Precio Unitario" name="precioUnitario" value={productoActual.precioUnitario} onChange={handleProductoChange} />
        </div>
        <div className="flex items-end">
          <button type="button" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors" onClick={agregarProducto}>Agregar</button>
        </div>
      </div>

      {productos.length > 0 && (
        <table className="w-full mb-4 border border-gray-200 rounded-lg overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Descripción</th>
              <th className="px-3 py-2 text-left">Cantidad</th>
              <th className="px-3 py-2 text-left">Precio Unitario</th>
              <th className="px-3 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i} className="border-t border-gray-200">
                <td className="px-3 py-2">{p.descripcion}</td>
                <td className="px-3 py-2">{p.cantidad}</td>
                <td className="px-3 py-2">${p.precioUnitario}</td>
                <td className="px-3 py-2">${p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="sticky top-4 z-40 bg-white p-4 border border-gray-300 rounded-xl shadow-sm mb-6 animate-fade-in-down">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Tipo de Comprobante</p>
            <p className="text-blue-700 font-bold">{form.tipoCbte === 1 ? 'Factura A' : 'Factura B'}</p>
          </div>
          <div>
            <p className="text-gray-400">Concepto</p>
            <p className="text-purple-700 font-bold">{{
              1: "Productos",
              2: "Servicios",
              3: "Prod. y Serv."
            }[form.concepto || 1]}</p>
          </div>
          <div>
            <p className="text-gray-400">IVA</p>
            <p className="text-yellow-600 font-bold">${Number(form.impIVA).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400">Importe Total</p>
            <p className="text-green-700 font-bold">${Number(form.impTotal).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1">Datos del Comprobante</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Alicuota IVA</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="ivaItems"
            value={alicuota ?? ''}
            onChange={handleAlicuotaChange}
          >
            <option value="">Seleccione una alícuota</option>
            {alicuotas.map((item: any) => (
              <option key={item.Id} value={JSON.stringify(item)}>
                {item.Desc}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4 mb-6">
          <div className="gap-4">
            {/* Tipo de Comprobante */}
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="tipoCbte"
                id="tipoCbte"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={form.tipoCbte ?? ""}
                onChange={handleChange}
                required
              >
                <option value={6}>Factura B</option>
                <option value={1}>Factura A</option>
              </select>
              <label htmlFor="tipoCbte" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Tipo de Comprobante</label>
            </div>
            {/* Concepto */}
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="concepto"
                id="concepto"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={form.concepto ?? ""}
                onChange={handleChange}
                required
              >
                <option value='' selected disabled>Seleccione un concepto...</option>
                <option value={1}>Productos</option>
                <option value={2}>Servicios</option>
                <option value={3}>Productos y Servicios</option>
              </select>
              <label htmlFor="concepto" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Concepto</label>
            </div>
            {/* condicion frente al iva */}
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="idIVAReceptor"
                id="idIVAReceptor"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={form.idIVAReceptor ?? ""}
                onChange={handleChange}
                required
              >
                <option value="" selected disabled>Seleccione condicion frente al IVA...</option>
                
                <option value="4">&nbsp;IVA Sujeto Exento</option>
                
                <option value="5">&nbsp;Consumidor Final</option>
                
                <option value="7">&nbsp;Sujeto No Categorizado</option>
                
                <option value="8">&nbsp;Proveedor del Exterior</option>
                
                <option value="9">&nbsp;Cliente del Exterior</option>
                
                <option value="10">&nbsp;IVA Liberado - Ley Nº 19.640</option>
                
                <option value="15">&nbsp;IVA No Alcanzado</option>
                
              </select>
              <label htmlFor="idIVAReceptor" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Condicion frente al IVA</label>
            </div>
            {/* Tipo de Documento */}
            <div className="relative z-0 w-full mb-5 group">
              <select
                name="docTipo"
                id="docTipo"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={form.docTipo ?? ""}
                onChange={handleChange}
                required
              >
                <option value={99}>Consumidor Final</option>
                <option value={80}>CUIT</option>
                <option value={96}>DNI</option>
              </select>
              <label htmlFor="docTipo" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Tipo de Documento</label>
            </div>
            {/* Número de Documento */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="docNro"
                id="docNro"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.docNro ?? ""}
                onChange={handleChange}
                required
              />
              <label htmlFor="docNro" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Número de Documento</label>
            </div>
            {/* Comprobante Desde */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="cbteDesde"
                id="cbteDesde"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.cbteDesde ?? ""}
                onChange={handleChange}
                required
              />
              <label htmlFor="cbteDesde" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Comprobante Desde</label>
            </div>
            {/* Comprobante Hasta */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="cbteHasta"
                id="cbteHasta"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.cbteHasta ?? ""}
                onChange={handleChange}
                required
              />
              <label htmlFor="cbteHasta" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Comprobante Hasta</label>
            </div>
            {/* Fecha del Comprobante */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="date"
                name="cbteFch"
                id="cbteFch"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.cbteFch ?? ""}
                onChange={handleChange}
                required
              />
              <label htmlFor="cbteFch" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Fecha del Comprobante</label>
            </div>
            {/* Importe Total */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="impTotal"
                id="impTotal"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.impTotal ?? ""}
                onChange={handleChange}
                required
              />
              <label htmlFor="impTotal" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Importe Total</label>
            </div>
            {/* Importe No Gravado */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="impTotConc"
                id="impTotConc"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.impTotConc ?? ""}
                onChange={handleChange}
                required
              />
              <label htmlFor="impTotConc" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Importe No Gravado</label>
            </div>
            {/* Importe Neto Gravado */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="impNeto"
                id="impNeto"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={
                  alicuota
                    ? (() => {
                      try {
                        const ali = JSON.parse(alicuota).Desc;
                        const porcentaje = ali.replace('%', '');
                        const divisor = (1 + Number(porcentaje / 100));
                        return (Number(form.impTotal) / divisor).toFixed(2);
                      } catch {
                        return form.impNeto ?? "";
                      }
                    })()
                    : form.impNeto ?? ""
                }
                onChange={handleChange}
                required
              />
              <label htmlFor="impNeto" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Importe Neto Gravado</label>
            </div>
            {/* IVA */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="impIVA"
                id="impIVA"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.impIVA ?? ""}
                onChange={handleChange}
                required
              />
              <label htmlFor="impIVA" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">IVA</label>
            </div>
            {/* Tributos */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="number"
                name="impTrib"
                id="impTrib"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.impTrib ?? ""}
                onChange={handleChange}
                required
              />
              <label htmlFor="impTrib" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Tributos</label>
            </div>
            {/* Fecha de Creación */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="datetime-local"
                name="createdAt"
                id="createdAt"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={form.createdAt ?? "".slice(0, 16)}
                onChange={handleChange}
                required
              />
              <label htmlFor="createdAt" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Fecha de Creación</label>
            </div>
          </div>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Generar</button>
      </form>
    </div>
  );
}
