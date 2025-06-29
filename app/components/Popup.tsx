import React, { useState, useEffect, useRef } from 'react';

type Producto = {
  descripcion: string;
  precioUnitario: number;
  cantidad: number;
  action: () => void;
};

interface PopupProps {
  onSelect: (producto: Producto) => void;
  onAfterSelect?: (producto: Producto) => void;
}

// Componente Popup con búsqueda, selección y cantidad
export default function Popup({ onSelect, onAfterSelect }: PopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cantidad, setCantidad] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);

  // Carga inicial de productos
  useEffect(() => {
    fetch('/api/arcapp/productos')
      .then(res => res.json())
      .then((data: Producto[]) => setProductos(data))
      .catch(err => console.error(err));
  }, []);

  // Filtrar lista cada vez que cambian productos o query
  useEffect(() => {
    setFiltered(
      productos.filter(p =>
        p.descripcion.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [productos, query]);

  // Enfocar input al abrir popup
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

  const selectProducto = (prod: Producto) => {
    const prodConCantidad: Producto = { ...prod, cantidad };
    onSelect(prodConCantidad);
    onAfterSelect?.(prodConCantidad);
    setIsOpen(false);
    setQuery('');
    setCantidad(1);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer transition w-full"
      >
        Agregar productos
      </button>

      {isOpen && (
        <div
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="fixed inset-0 flex items-center justify-center z-50 outline-none"
        >
          {/* Cerrar al clickear fuera */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setQuery(''); setCantidad(1); }}
          />

          <div className="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 gap-2 flex flex-row items-center justify-between ">
              {/* Input búsqueda */}
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
              />
              {/* Input cantidad */}
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={e => setCantidad(Math.max(1, parseInt(e.target.value, 10) || 1))}
                placeholder="Cantidad"
                className="w-15 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
              />
            </div>

            <ul className="max-h-60 overflow-auto">
              {filtered.map(p => (
                <li
                  key={p.descripcion}
                  onClick={() => selectProducto(p)}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  <span className="font-medium">{p.descripcion}</span>
                  <span className="ml-2 text-sm text-gray-500">(Precio: ${p.precioUnitario})</span>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-2 text-gray-500">No se encontró ningún producto.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
