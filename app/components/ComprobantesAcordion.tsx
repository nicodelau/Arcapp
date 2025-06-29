import React, { useState, useEffect, useRef } from 'react';

// Asegúrate de instalar puppeteer-core y chrome-aws-lambda (o puppeteer) en tu proyecto
// npm install puppeteer-core chrome-aws-lambda

// Funciones para generar PDF
async function fetchFacturaHTML(id: number): Promise<string> {
  const res = await fetch(`/api/factura-html/${id}`);
  return res.text();
}

async function requestPDF(html: string): Promise<Blob> {
  const res = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html })
  });
  return res.blob();
}

type ProductoItem = {
  id_arca?: number;
  descripcion: string;
  cantidad: number;
  total: number;
};

type Comprobante = {
  id: number;
  cae?: string;
  cbteFch: string;
  tipoCbte: number;
  concepto: number;
  docTipo: number;
  docNro: number;
  cbteDesde: number;
  cbteHasta: number;
  impTotal?: number;
  impNeto?: number;
  impIVA?: number;
  monId: string;
  createdAt?: string;
};

interface AccordionProps {
  comprobantes: Comprobante[];
}

export default function ComprobantesAccordion({ comprobantes }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedComp, setSelectedComp] = useState<Comprobante | null>(null);
  const [productos, setProductos] = useState<ProductoItem[]>([]);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const conceptoLabels: Record<number, string> = {
    1: 'Productos',
    2: 'Servicios',
    3: 'Productos y Servicios',
  };

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // Carga productos facturados y detalles
  const getProductosPorId = async (id: number) => {
    const res = await fetch(`/api/arcapp/productosFacturados?id=${id}`);
    const data = await res.json();
    const detalles = await Promise.all(
      data.map(async (p: any) => {
        const prodRes = await fetch(`/api/arcapp/productos?id_arca=${p.productoId}`);
        const info = await prodRes.json();
        return {
          id_arca: info.id_arca,
          descripcion: info.descripcion,
          cantidad: p.cantidad,
          total: p.cantidad * info.precioUnitario
        };
      })
    );
    setProductos(detalles);
  };

  const handleViewProducts = async (comp: Comprobante) => {
    await getProductosPorId(comp.id);
    setSelectedComp(comp);
    setShowProductsModal(true);
  };

  const handleGeneratePDF = (comp: Comprobante) => {
    setSelectedComp(comp);
    setShowPDFModal(true);
  };

  const confirmGenerate = async () => {
    if (!selectedComp) return;
    setPdfGenerating(true);
    const html = await fetchFacturaHTML(selectedComp.id);
    const blob = await requestPDF(html);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura-${selectedComp.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setPdfGenerating(false);
    setShowPDFModal(false);
  };

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1">Comprobante Detalles</h2>
      <div className="space-y-4">
        {comprobantes.map((c, i) => {
          const isOpen = openIndex === i;
          const total = c.impTotal ?? 0;
          const neto = c.impNeto ?? 0;
          const iva = c.impIVA ?? 0;
          const ivaPct = neto > 0 ? ((iva / neto) * 100).toFixed(2) : '0';
          const tipo = c.tipoCbte === 1 ? 'Factura A' : c.tipoCbte === 6 ? 'Factura B' : `Tipo ${c.tipoCbte}`;
          const concepto = conceptoLabels[c.concepto] ?? `Concepto ${c.concepto}`;

          return (
            <div key={c.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggle(i)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 flex items-baseline space-x-4">
                    <span>#{c.cae}</span>
                    <span className="text-blue-600">{tipo}</span>
                    <span className="text-green-600 font-bold">${total.toLocaleString()}</span>
                    <span className="text-yellow-600">({ivaPct}%)</span>
                    <span className="text-purple-600">{concepto}</span>
                    <span className="text-gray-500">{new Date(c.cbteFch).toLocaleDateString()}</span>
                  </h3>
                </div>
                <span className={`transform transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
              </button>

              <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="p-4 flex space-x-4">
                  <div className="w-3/4 space-y-2 text-gray-800">
                    <p><strong>Tipo:</strong> {tipo}</p>
                    <p><strong>Concepto:</strong> {concepto}</p>
                    <p><strong>Documento:</strong> {c.docTipo} – {c.docNro}</p>
                    <p><strong>Desde / Hasta:</strong> {c.cbteDesde} / {c.cbteHasta}</p>
                    <p><strong>Neto:</strong> ${neto.toLocaleString()}</p>
                    <p><strong>IVA:</strong> ${iva.toLocaleString()} ({ivaPct}%)</p>
                    <p><strong>Moneda:</strong> {c.monId}</p>
                    {c.cae && <p><strong>CAE:</strong> {c.cae}</p>}
                    {c.createdAt && <p><strong>Fecha CAE:</strong> {new Date(c.createdAt).toLocaleDateString()}</p>}
                  </div>
                  <div className="w-1/4 flex flex-col space-y-2 justify-start">
                    <button
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      onClick={() => handleGeneratePDF(c)}
                    >Generar PDF</button>
                    <button
                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={() => handleViewProducts(c)}
                    >Ver Productos</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Productos */}
      {showProductsModal && selectedComp && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowProductsModal(false)} />
          <div className="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Productos Comprobante #{selectedComp.id}</h3>
            </div>
            <ul className="p-4 space-y-2 max-h-60 overflow-auto text-gray-700">
              {productos.length ? productos.map((p, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{p.id_arca}</span>
                  <span>{p.descripcion}</span>
                  <span>x{p.cantidad}</span>
                  <span>${p.total.toLocaleString()}</span>
                </li>
              )) : (
                <p className="text-center text-gray-500">No hay productos.</p>
              )}
            </ul>
            <div className="p-4 border-t flex justify-end">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                onClick={() => setShowProductsModal(false)}
              >Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PDF */}
      {showPDFModal && selectedComp && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowPDFModal(false)} />
          <div className="relative bg-white w-full max-w-sm mx-4 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Generar PDF #{selectedComp.id}</h3>
            </div>
            <div className="p-4 text-center">
              <p>¿Desea generar el PDF del comprobante?</p>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                onClick={() => setShowPDFModal(false)}
                disabled={pdfGenerating}
              >Cancelar</button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={confirmGenerate}
                disabled={pdfGenerating}
              >{pdfGenerating ? 'Generando...' : 'Generar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
