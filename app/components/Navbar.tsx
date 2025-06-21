import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3 mb-6 rounded-b-xl">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold text-blue-700 hover:text-blue-900 transition-colors">AFIP App</Link>
        <Link href="/comprobantes" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Comprobantes</Link>
        <Link href="/productos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Productos</Link>
      </div>
    </nav>
  );
}
