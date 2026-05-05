import { useState, useEffect } from 'react';
import { BookCard } from './BookCard';
import { obtenerLibros, type Libro } from '../services/api';
import { toast } from 'sonner';

export function CatalogSection() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      setLoading(true);
      const data = await obtenerLibros();
      setLibros(data);
    } catch (error) {
      toast.error('Error al cargar el catálogo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="catalogo" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Catálogo de Libros</h2>
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando catálogo...</p>
          </div>
        </div>
      </section>
    );
  }

  if (libros.length === 0) {
    return (
      <section id="catalogo" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Catálogo de Libros</h2>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No hay libros disponibles en el catálogo</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Catálogo de Libros</h2>
          <p className="text-gray-600">{libros.length} libros disponibles</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {libros.map((libro) => (
            <BookCard
              key={libro.isbn}
              title={libro.titulo}
              author={libro.autor}
              category={libro.categoria || 'General'}
              available={libro.disponible}
              rating={4.5}
              cover={libro.portadaUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
