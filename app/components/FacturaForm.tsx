'use client';

import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import PopupCbte from "./PopupCbte";
import Trash from "./icons/Trash";
import Pencil from "./icons/Pencil";
import Save from "./icons/Save";

interface Comprobante {
  idIVAReceptor: number | null;
  CbteTipo: number;
  Concepto: number | null;
  DocTipo: number | null;
  DocNro: number | null;
  CbteDesde: number | null;
  CbteHasta: number | null;
  CbteFch: string;
  ImpTotal: number | null;
  ImpTotConc: number | null;
  ImpNeto: number | null;
  ImpOpEx: number | null;
  ImpIVA: number | null;
  ImpTrib: number | null;
  MonId: string;
  createdAt: string;
  Iva: { Id: number; BaseImp: number; Importe: number }[];
  Productos: any[];
  CbtesAsoc: { Tipo: number; PtoVta: number; Nro: number }[];
}

export default function FacturaForm() {
  const [alicuota, setAlicuota] = useState<string | null>(null);
  const [alicuotas, setAlicuotas] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [productoActual, setProductoActual] = useState({ descripcion: "", cantidad: 1, precioUnitario: 0 });
  const [cantidad, setCantidad] = useState<number | null>(1);
  const [Iva, setIva] = useState<{ Id: number; BaseImp: number; Importe: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [facturaAsociada, setFacturaAsociada] = useState({ Tipo: '', PtoVta: '', Nro: '' , cae: '', impTotal: 0, cbteFch: '' });

  const [form, setForm] = useState<Comprobante>({
    idIVAReceptor: null,
    CbteTipo: 0,
    Concepto: null,
    DocTipo: 99,
    DocNro: null,
    CbteDesde: null,
    CbteHasta: null,
    CbteFch: new Date().toISOString().split('T')[0],
    ImpTotal: null,
    ImpTotConc: null,
    ImpNeto: null,
    ImpOpEx: 0,
    ImpIVA: null,
    ImpTrib: null,
    MonId: "PES",
    createdAt: new Date().toISOString(),
    Iva: [
      {
        Id: 5,
        BaseImp: 0,
        Importe: 0,
      },
    ],
    Productos: [],
    CbtesAsoc: [],
  });

  const fetchAlicuotas = async () => {
    const res = await fetch('/api/arca/alicuotas');
    const data = await res.json();
    setAlicuotas(data.ResultGet.IvaTipo);
  };

  useEffect(() => {
    fetchAlicuotas();
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "CbteTipo" || name === "DocTipo" || name === "Concepto" || name === "idIVAReceptor" || name === "DocNro" || name === "CbteDesde" || name === "CbteHasta" || name === "ImpTotal" || name === "ImpTotConc" || name === "ImpNeto" || name === "ImpOpEx" || name === "ImpIVA" || name === "ImpTrib" ? Number(value) : value,
    }));
    if (name === "CbteTipo") {
      const res = await fetch('/api/arca/comprobante-ultimo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ CbteTipo: value }),
      });
      if (!res.ok) {
        throw new Error('Error al obtener el último comprobante');
      }
      const data = await res.json();
      if (data) {
        setForm(prev => ({
          ...prev,
          CbteDesde: data.CbteNro,
          CbteHasta: data.CbteNro,
        }));
      }
    }
  };

  const handleFacturaAsociadaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFacturaAsociada(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (form.CbteTipo === 3 || form.CbteTipo === 8) {
      console.log('Factura asociada:', facturaAsociada);
      if (facturaAsociada.Tipo && facturaAsociada.PtoVta && facturaAsociada.cae) {
        const cbtesAsoc = {
          Tipo: Number(facturaAsociada.Tipo),
          PtoVta: Number(facturaAsociada.PtoVta),
          Nro: Number(facturaAsociada.cae)
        };
        setForm(prev => ({
          ...prev,
          CbtesAsoc: [cbtesAsoc]
        }));
      }
    } else {
      setForm(prev => {
        const newForm = { ...prev };
        newForm.CbtesAsoc = [];
        return newForm;
      });
    }
  }, [facturaAsociada, form.CbteTipo]);

  useEffect(() => {
    setFacturaAsociada({ Tipo: '', PtoVta: '', Nro: '', cae: '', impTotal: 0, cbteFch: '' });
  }, [form.CbteTipo]);

  const handleAlicuotaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlicuota(e.target.value);
    const selected = alicuotas.find(item => JSON.stringify(item) === e.target.value);
    if (selected) {
      const porcentaje = Number(selected.Desc.replace('%', '')) || 21;
      const ImpNeto = productos.reduce((acc, p) => acc + p.cantidad * p.precioUnitario, 0);
      const ImpIVA = +(ImpNeto * porcentaje / 100).toFixed(2);
      setForm({
        ...form,
        ImpNeto,
        ImpIVA,
        ImpTotal: + (ImpNeto + ImpIVA).toFixed(2),
        Iva: [
          {
            Id: selected.Id,
            BaseImp: ImpNeto,
            Importe: ImpIVA,
          },
        ]
      });
    }
  };

  const agregarProducto = (productoParam?: any) => {
    const prod = productoParam || productoActual;
    const nuevoProducto = {
      ...prod,
      id: prod.id || null,
      total: +(prod.cantidad * prod.precioUnitario).toFixed(2)
    };
    const nuevosProductos = [...productos, nuevoProducto];
    setProductos(nuevosProductos);
    setForm(prev => ({
      ...prev,
      Productos: nuevosProductos
    }));

    if (alicuota) {
      const selected = JSON.parse(alicuota);
      const porcentaje = Number(selected.Desc.replace('%', ''));
      const ImpNeto = (nuevosProductos.reduce((acc, p) => acc + p.total, 0)).toFixed(2);
      const ImpIVA = +(ImpNeto * porcentaje / 100).toFixed(2);
      setForm(prev => ({
        ...prev,
        ImpNeto,
        ImpIVA,
        ImpTotal: +(ImpNeto + ImpIVA).toFixed(2),
        Iva: [
          {
            Id: selected.Id,
            BaseImp: ImpNeto,
            Importe: ImpIVA,
          },
        ]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.CbteTipo === 0) {
      setError('Debe seleccionar un tipo de comprobante válido');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    setLoading(true);
    console.log('Enviando formulario:', form);
    console.log('CbtesAsoc:', form.CbtesAsoc);
    console.log('Factura asociada actual:', facturaAsociada);
    const res = await fetch('/api/arca/comprobantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setSuccess(null);
      setLoading(false);
      setTimeout(() => {
        setError(null);
      }, 3000)
    } else {
      setSuccess('Comprobante guardado exitosamente');
      setError(null);
      setLoading(false);
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      setForm({
        idIVAReceptor: null,
        CbteTipo: 0,
        Concepto: null,
        DocTipo: 99,
        DocNro: null,
        CbteDesde: null,
        CbteHasta: null,
        CbteFch: new Date().toISOString().split('T')[0],
        ImpTotal: null,
        ImpTotConc: null,
        ImpNeto: null,
        ImpOpEx: 0,
        ImpIVA: null,
        ImpTrib: null,
        MonId: "PES",
        createdAt: new Date().toISOString(),
        Iva: [
          {
            Id: 5,
            BaseImp: 0,
            Importe: 0,
          },
        ],
        Productos: [],
        CbtesAsoc: [],
      });
      setProductos([]);
      setAlicuota(null);
      setFacturaAsociada({ Tipo: '', PtoVta: '', Nro: '', cae: '', impTotal: 0, cbteFch: '' });
    }
  };

  function formatDateTimeLocal(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISO = new Date(date.getTime() - tzOffset).toISOString();
    return localISO.slice(0, 16);
  }

  const handleSelectProducto = (producto: any) => {
    agregarProducto({
      id: producto.id || null,
      descripcion: producto.descripcion || "",
      cantidad: producto.cantidad ?? 1,
      precioUnitario: producto.precioUnitario ?? 0
    });
  }

  const handleEliminarProducto = (index: number) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
    setForm(prev => ({
      ...prev,
      Productos: nuevosProductos
    }));
    if (alicuota) {
      const selected = JSON.parse(alicuota);
      const porcentaje = Number(selected.Desc.replace('%', ''));
      const ImpNeto = nuevosProductos.reduce((acc, p) => acc + p.total, 0);
      const ImpIVA = +(ImpNeto * porcentaje / 100).toFixed(2);
      setForm(prev => ({
        ...prev,
        ImpNeto,
        ImpIVA,
        ImpTotal: +(ImpNeto + ImpIVA).toFixed(2),
        Iva: [
          {
            Id: selected.Id,
            BaseImp: ImpNeto,
            Importe: ImpIVA,
          },
        ]
      }));
    }
  };

  const handleModificarCantidad = (index: number, nuevaCantidad: number) => {
    const nuevosProductos = productos.map((p, i) =>
      i === index ? { ...p, cantidad: nuevaCantidad, total: +(nuevaCantidad * p.precioUnitario).toFixed(2) } : p
    );
    setProductos(nuevosProductos);
    setForm(prev => ({
      ...prev,
      Productos: nuevosProductos
    }));
    if (alicuota) {
      const selected = JSON.parse(alicuota);
      const porcentaje = Number(selected.Desc.replace('%', ''));
      const ImpNeto = nuevosProductos.reduce((acc, p) => acc + p.total, 0);
      const ImpIVA = +(ImpNeto * porcentaje / 100).toFixed(2);
      setForm(prev => ({
        ...prev,
        ImpNeto,
        ImpIVA,
        ImpTotal: +(ImpNeto + ImpIVA).toFixed(2),
        Iva: [
          {
            Id: selected.Id,
            BaseImp: ImpNeto,
            Importe: ImpIVA,
          },
        ]
      }));
    }

  };

  const handleSelectComprobante = async (C : any) => {
    console.log('Comprobante seleccionado:', C);
    setFacturaAsociada({
      Tipo: C.tipoCbte || '',
      PtoVta: C.puntoVenta || '',
      Nro: C.cbteHasta || '',
      cae: C.cae || '',
      impTotal: C.impTotal || 0,
      cbteFch: C.cbteFch || '',
    });
  }

  const getTipoComprobante = (tipo: number) => {
    switch (tipo) {
      case 1:
        return 'Factura A';
      case 6:
        return 'Factura B';
      case 3:
        return 'Nota de Crédito A';
      case 8:
        return 'Nota de Crédito B';
      default:
        return 'Desconocido';
    }
  }

  return (
    <>
      <div className="container mt-5">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1">Agregar productos</h2>
        <div className="bg-white p-6 rounded-xl space-y-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:space-x-4 animate-fade-in-down">
          <Popup onSelect={(producto: any) => handleSelectProducto(producto)} />
        </div>

        {productos.length > 0 && (
          <table className="w-full mb-4 border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Descripción</th>
                <th className="px-3 py-2 text-left">Cantidad</th>
                <th className="px-3 py-2 text-left">Precio Unitario</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-3 py-2">{p.descripcion}</td>
                  <td className="px-3 py-2">
                    {p.editable ? (
                      <input
                        type="number"
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={p.cantidad}
                        onChange={(e) => {
                          const nuevaCantidad = Number(e.target.value);
                          const nuevosProductos = productos.map((prod, index) =>
                            index === i ? { ...prod, cantidad: nuevaCantidad, total: +(nuevaCantidad * prod.precioUnitario).toFixed(2) } : prod
                          );
                          setProductos(nuevosProductos);
                          setForm((prev) => {
                            const ImpNeto = nuevosProductos.reduce((acc, prod) => acc + prod.total, 0);
                            const ImpIVA = alicuota ? +(ImpNeto * Number(JSON.parse(alicuota).Desc.replace('%', '')) / 100).toFixed(2) : 0;
                            return {
                              ...prev,
                              Productos: nuevosProductos,
                              ImpNeto,
                              ImpIVA,
                              ImpTotal: +(ImpNeto + ImpIVA).toFixed(2),
                            };
                          });
                        }}
                      />
                    ) : (
                      <span>{p.cantidad}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">${p.precioUnitario}</td>
                  <td className="px-3 py-2">${p.total}</td>
                  <td className="px-3 py-2 flex space-x-2">
                    <button
                      type="button"
                      className={`${p.editable
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-500 hover:bg-blue-700"
                        } text-white px-2 py-1 rounded text-xs cursor-pointer flex items-center space-x-1`}
                      onClick={() => {
                        const nuevosProductos = productos.map((prod, index) =>
                          index === i ? { ...prod, editable: !prod.editable } : prod
                        );
                        setProductos(nuevosProductos);
                      }}
                    >
                      {p.editable ? (
                        <>
                          <Save className="inline-block w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Pencil className="inline-block w-4 h-4" />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-xs cursor-pointer"
                      onClick={() => handleEliminarProducto(i)}
                    >
                      <Trash className="inline-block w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="sticky top-4 z-40 bg-white/85 p-4 border border-gray-300 rounded-xl shadow-sm mb-6 animate-fade-in-down">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-800">Tipo de Comprobante</p>
              <p className="text-blue-700 font-bold">
                {form.CbteTipo === 1 ? 'Factura A' :
                  form.CbteTipo === 6 ? 'Factura B' :
                    form.CbteTipo === 3 ? 'Nota de Crédito A' :
                      form.CbteTipo === 8 ? 'Nota de Crédito B' :
                        'Sin seleccionar'}
              </p>
            </div>
            <div>
              <p className="text-gray-800">Concepto</p>
              <p className="text-purple-700 font-bold">{{
                1: "Productos",
                2: "Servicios",
                3: "Prod. y Serv."
              }[form.Concepto || 1]}</p>
            </div>
            <div>
              <p className="text-gray-800">IVA</p>
              <p className="text-yellow-600 font-bold">${Number(form.ImpIVA).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-800">Importe Total</p>
              <p className="text-green-700 font-bold">${Number(form.ImpTotal).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1">Datos del Comprobante</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alicuota IVA</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="Iva"
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
                  name="CbteTipo"
                  id="CbteTipo"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={form.CbteTipo ?? 0}
                  onChange={handleChange}
                  required
                >
                  <option value={0} disabled>Elija un tipo de comprobante...</option>
                  <option value={1}>Factura A</option>
                  <option value={6}>Factura B</option>
                  <option value={3}>Nota de credito A</option>
                  <option value={8}>Nota de credito B</option>
                </select>
                <label htmlFor="CbteTipo" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Tipo de Comprobante</label>
              </div>

              {(form.CbteTipo === 3 || form.CbteTipo === 8) && (
                <span>
                  <span className="flex mb-5">
                    <PopupCbte 
                      key={form.CbteTipo} 
                      onSelect={(C: any) => handleSelectComprobante(C)} 
                      CbteTipo={form.CbteTipo} 
                    />
                  </span>

                {(facturaAsociada.Tipo  && 
                  <table className="w-full mb-4 border border-gray-200 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Número</th>
                        <th className="px-3 py-2 text-left">Tipo</th>
                        <th className="px-3 py-2 text-left">Fecha</th>
                        <th className="px-3 py-2 text-left">Total</th>
                        <th className="px-3 py-2 text-left">CAE</th>
                        <th className="px-3 py-2 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key={facturaAsociada.Nro} className="border-t border-gray-200">
                          <td className="px-3 py-2 font-medium">{facturaAsociada.Nro}</td>
                          <td className="px-3 py-2">{getTipoComprobante(parseInt(facturaAsociada.Tipo))}</td>
                          <td className="px-3 py-2">{facturaAsociada.cbteFch}</td>
                          <td className="px-3 py-2">${facturaAsociada.impTotal}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{facturaAsociada.cae}</td>
                          <td className="px-3 py-2 flex space-x-2">
                            <button
                              type="button"
                              className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-xs cursor-pointer"
                              onClick={() => setFacturaAsociada({ Tipo: '', PtoVta: '', Nro: '', cae: '', impTotal: 0, cbteFch: '' })}
                            >
                              <Trash className="inline-block w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                    </tbody>
                  </table>
                  )}
                </span>
  
              )}
              {/* Concepto */}
              <div className="relative z-0 w-full mb-5 group">
                <select
                  name="Concepto"
                  id="Concepto"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={form.Concepto ?? ""}
                  onChange={handleChange}
                  required
                >
                  <option value='' defaultValue={""} disabled>Seleccione un Concepto...</option>
                  <option value={1}>Productos</option>
                  <option value={2}>Servicios</option>
                  <option value={3}>Productos y Servicios</option>
                </select>
                <label htmlFor="Concepto" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Concepto</label>
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
                  <option value="" defaultValue={""} disabled>Seleccione condicion frente al IVA...</option>

                  <option value="1">&nbsp;IVA Responsable Inscripto</option>

                  <option value="4">&nbsp;IVA Sujeto Exento</option>

                  <option value="5">&nbsp;Consumidor Final</option>

                  <option value="6">&nbsp;Responsable Monotributo</option>

                  <option value="7">&nbsp;Sujeto No Categorizado</option>

                  <option value="8">&nbsp;Proveedor del Exterior</option>

                  <option value="9">&nbsp;Cliente del Exterior</option>

                  <option value="10">&nbsp;IVA Liberado - Ley Nº 19.640</option>

                  <option value="13">&nbsp;Monotributista Social</option>

                  <option value="15">&nbsp;IVA No Alcanzado</option>

                  <option value="16">&nbsp;Monotributo Trabajador Independiente Promovido</option>

                </select>
                <label htmlFor="idIVAReceptor" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Condicion frente al IVA</label>
              </div>
              {/* Tipo de Documento */}
              <div className="relative z-0 w-full mb-5 group">
                <select
                  name="DocTipo"
                  id="DocTipo"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={form.DocTipo ?? 99}
                  onChange={handleChange}
                  required
                >
                  <option value={99}>Consumidor Final</option>
                  <option value={80}>CUIT</option>
                  <option value={96}>DNI</option>
                </select>
                <label htmlFor="DocTipo" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Tipo de Documento</label>
              </div>
              {/* Número de Documento */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="DocNro"
                  id="DocNro"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={form.DocNro ?? ""}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="DocNro" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Número de Documento</label>
              </div>
              {/* Fecha del Comprobante */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="date"
                  name="CbteFch"
                  id="CbteFch"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={form.CbteFch ?? ""}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="CbteFch" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Fecha del Comprobante</label>
              </div>
              {/* Importe Total */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="ImpTotal"
                  id="ImpTotal"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={
                    alicuota
                      ? (() => {
                        try {
                          return Number((form?.ImpNeto ?? 0) + (form?.ImpIVA ?? 0)).toFixed(2);
                        } catch {
                          return form.ImpTotal ?? 0;
                        }
                      })()
                      : form.ImpTotal ?? 0
                  }
                  onChange={handleChange}
                  required
                />
                <label htmlFor="ImpTotal" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Importe Total</label>
              </div>
              {/* Importe No Gravado */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="ImpTotConc"
                  id="ImpTotConc"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={form.ImpTotConc ?? 0}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="ImpTotConc" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Importe No Gravado</label>
              </div>
              {/* Importe Neto Gravado */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="ImpNeto"
                  id="ImpNeto"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={form.ImpNeto ?? 0}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="ImpNeto" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Importe Neto Gravado</label>
              </div>
              {/* IVA */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="ImpIVA"
                  id="ImpIVA"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={form.ImpIVA ?? ""}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="ImpIVA" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">IVA</label>
              </div>
              {/* Tributos */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="number"
                  name="ImpTrib"
                  id="ImpTrib"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={form.ImpTrib ?? 0}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="ImpTrib" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Tributos</label>
              </div>
              {/* Fecha de Creación */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="datetime-local"
                  name="createdAt"
                  id="createdAt"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formatDateTimeLocal(form.createdAt)}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="createdAt" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] left-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5">Fecha de Creación</label>
              </div>
            </div>
          </div>
          {error && (
            <section className="mt-6 mb-6 bg-red-100 p-4 rounded-lg shadow-md">
              <p className="text-red-700 text-center">{error}. Por favor, verifica los datos ingresados.</p>
            </section>
          )}
          {success && (
            <section className="mt-6 mb-6 bg-green-100 p-4 rounded-lg shadow-md">
              <p className="text-green-700 text-center">{success}</p>
            </section>
          )}
          {loading && <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-6 w-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-blue-700 font-medium">Generando comprobante...</span>
          </div>}
          {!loading && !error && !success && (
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Generar</button>
          )}
        </form>
      </div>
    </>

  );
}
