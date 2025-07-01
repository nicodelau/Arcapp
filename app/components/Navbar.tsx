'use client';

import Link from 'next/link';
import { useAuth } from '../../lib/useAuth';
import UserDropdown from './UserDropdown';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center justify-between bg-gray-400 shadow px-6 py-3 mb-6">
      <div className="flex items-center gap-4"> 
        <Link href="/" className="text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors">
          <img src="/logo_arca_blanco.svg" style={{ width: "5rem" }} alt="logo" />
        </Link>
        {isAuthenticated && (
          <>
            <Link href="/comprobantes" className="text-gray-50 hover:text-blue-600 font-medium transition-colors" style={{ fontSize: "1rem" }}>Comprobantes</Link>
            <Link href="/productos" className="text-gray-50 hover:text-blue-600 font-medium transition-colors" style={{ fontSize: "1rem" }}>Productos</Link>
            <Link href="/estadisticas" className="text-gray-50 hover:text-blue-600 font-medium transition-colors" style={{ fontSize: "1rem" }}>Estadísticas</Link>
            <Link href="/usuario" className="text-gray-50 hover:text-blue-600 font-medium transition-colors" style={{ fontSize: "1rem" }}>Usuario</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-gray-50 px-4 py-2 rounded transition-colors"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
