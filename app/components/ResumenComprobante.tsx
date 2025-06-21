import React from "react";

interface ResumenProps {
  tipoCbte: number;
  concepto: number;
  impIVA: number;
  impTotal: number;
}

export default function ResumenComprobante({ tipoCbte, concepto, impIVA, impTotal }: ResumenProps) {
  return (
    
    <div className="sticky top-0 z-50 bg-white shadow-md p-4 mb-6 rounded-xl border border-gray-200 transition-all">
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-medium text-gray-700">
        <div>
          <p className="text-gray-500">Tipo de Comprobante</p>
          <p className="text-blue-600 text-base font-semibold">
            {tipoCbte === 1 ? "Factura A" : "Factura B"}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Concepto</p>
          <p className="text-purple-600 text-base font-semibold">
            {{
              1: "Productos",
              2: "Servicios",
              3: "Prod. y Serv."
            }[concepto]}
          </p>
        </div>
        <div>
          <p className="text-gray-500">IVA</p>
          <p className="text-yellow-600 text-base font-semibold">
            ${Number(impIVA).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Importe Total</p>
          <p className="text-green-600 text-base font-semibold">
            ${Number(impTotal).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
