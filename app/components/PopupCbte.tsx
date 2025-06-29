import React, { useState, useEffect, useRef } from 'react';

type Comprobante = {
  id?: number;
  cantReg?: number;
  puntoVenta?: number;
  tipoCbte?: number;
  concepto?: number;
  docTipo?: number;
  docNro?: string | number;
  cbteDesde?: number;
  cbteHasta?: number;
  cbteFch?: string;
  impTotal?: number;
  impTotConc?: number;
  impNeto?: number;
  impOpEx?: number;
  impIVA?: number;
  impTrib?: number;
  monId?: string;
  monCotiz?: number;
  createdAt?: string;
  cae: string;
  ivaItems?: { Id: number; BaseImp: number; Importe: number }[];
  productos?: any[];
};

interface PopupProps {
  onSelect: (comprobante: Comprobante) => void;
  onAfterSelect?: (comprobante: Comprobante) => void;
  CbteTipo?: number;
}

export default function Popup({ onSelect, onAfterSelect, CbteTipo }: PopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cantidad, setCantidad] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [comprobante, setComprobante] = useState<Comprobante[]>([]);
  const [filtered, setFiltered] = useState<Comprobante[]>([]);

  useEffect(() => {
    fetch(`/api/arcapp/comprobantes?CbteTipo=${CbteTipo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
      .then(res => {
        if(res.status === 204) {
          return [];
        } else {
          return res.json()
        }
      })
      .then((data: any) => {
        let comprobantes: Comprobante[] = [];
        
        if (Array.isArray(data)) {
          comprobantes = data;
        } else if (data && Array.isArray(data.comprobantes)) {
          comprobantes = data.comprobantes;
        } else if (data && Array.isArray(data.data)) {
          comprobantes = data.data;
        } else if (data && typeof data === 'object' && data.id) {
          comprobantes = [data];
        } else if (data && typeof data === 'object') {
          const arrayProperty = Object.values(data).find(value => Array.isArray(value));
          if (arrayProperty) {
            comprobantes = arrayProperty as Comprobante[];
          }
        }
        
        if (!comprobantes || comprobantes.length === 0) {
          setComprobante([]);
          return;
        }
        setComprobante(comprobantes);
      })
      .catch(err => console.error(err));
  }, [CbteTipo]);

  useEffect(() => {
    if (!Array.isArray(comprobante) || comprobante.length === 0) {
      setFiltered([]);
      return;
    }
    
    const filtered = comprobante.filter(p => {
      const hasCAE = p.cae && typeof p.cae === 'string';
      if (!hasCAE) {
        return false;
      }
      
      const searchTerm = query.toLowerCase();
      const caeMatch = p.cae.toLowerCase().includes(searchTerm);
      const nroMatch = p.cbteHasta && p.cbteHasta.toString().includes(searchTerm);
      const totalMatch = p.impTotal && p.impTotal.toString().includes(searchTerm);
      
      return caeMatch || nroMatch || totalMatch;
    });
    
    setFiltered(filtered);
  }, [comprobante, query]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setCantidad(1);
    }
  };

  const selectComprobante = (comp: Comprobante) => {
    const comprobante: Comprobante = { ...comp };
    onSelect(comprobante);
    onAfterSelect?.(comprobante);
    setIsOpen(false);
    setQuery('');
    setCantidad(1);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 cursor-pointer transition w-full"
      >
        Agregar comprobante
      </button>

      {isOpen && (
        <div
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="fixed inset-0 flex items-center justify-center z-50 outline-none"
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setQuery(''); setCantidad(1); }}
          />

          <div className="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 gap-2 flex flex-row items-center justify-between ">
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar comprobante..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
              />
            </div>

            <ul className="max-h-60 overflow-auto">
              {filtered.map(p => (
                <li
                  key={p.cae}
                  onClick={() => selectComprobante(p)}
                  className="px-4 py-2 hover:bg-amber-100 cursor-pointer"
                >
                  <span className="font-medium">Nro: {p.cbteHasta}</span>
                  <span className="font-medium"> | </span>
                  <span className="font-medium">Total: ${p.impTotal}</span>
                  <span className="ml-2 text-sm text-gray-500">(Fecha: {p.cbteFch})</span>
                  <div className="text-xs text-gray-400">CAE: {p.cae}</div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No se encontró ningún comprobante.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
