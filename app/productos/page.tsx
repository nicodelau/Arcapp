export default function ProductosPage() {
    return (
        <div className="container mt-5">
            <section className="mt-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b pb-1 text-center">Productos</h2>
                <div className="flex items-center gap-4 justify-center">
                    <div className="mt-6">
                        <a type="button" href="/productos/crear-producto" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Crear productos</a>
                    </div>
                    <div className="mt-6">
                        <a type="button" href="/productos/ver-producto" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Ver productos</a>
                    </div>

                    <p className="mt-3"></p>
                    <a href="/comprobantes/ver-comprobantes" className="btn btn-secondary"></a>
                </div>
            </section>
        </div>
    );
}