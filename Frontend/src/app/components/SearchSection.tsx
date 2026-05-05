import { useState, useEffect } from 'react';
import { Search, X, BookCheck, BookX, MapPin } from 'lucide-react';
import { TextField, Button, Card, CardContent, Chip, IconButton, Alert } from '@mui/material';
import { obtenerLibros, prestarLibro, devolverLibro, type Libro } from '../services/api';
import { toast } from 'sonner';

export function SearchSection() {
  const [busqueda, setBusqueda] = useState('');
  const [todosLosLibros, setTodosLosLibros] = useState<Libro[]>([]);
  const [resultados, setResultados] = useState<Libro[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      const libros = await obtenerLibros();
      setTodosLosLibros(libros);
    } catch (error) {
      console.error('Error al cargar libros:', error);
    }
  };

  const realizarBusqueda = () => {
    if (!busqueda.trim()) {
      toast.error('Por favor ingresa un término de búsqueda');
      return;
    }

    setBuscando(true);
    const termino = busqueda.toLowerCase().trim();

    const librosEncontrados = todosLosLibros.filter(libro =>
      libro.titulo.toLowerCase().includes(termino) ||
      libro.autor.toLowerCase().includes(termino) ||
      libro.isbn.toLowerCase().includes(termino) ||
      (libro.categoria && libro.categoria.toLowerCase().includes(termino))
    );

    setResultados(librosEncontrados);
    setMostrarResultados(true);
    setBuscando(false);

    if (librosEncontrados.length === 0) {
      toast.info('No se encontraron libros con ese criterio');
    } else {
      toast.success(`Se encontraron ${librosEncontrados.length} libro(s)`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      realizarBusqueda();
    }
  };

  const cerrarResultados = () => {
    setMostrarResultados(false);
    setBusqueda('');
    setResultados([]);
  };

  const handlePrestar = async (isbn: string, titulo: string) => {
    try {
      await prestarLibro(isbn);
      toast.success(`"${titulo}" prestado exitosamente`);
      cargarLibros();
      realizarBusqueda();
    } catch (error) {
      toast.error('Error al prestar el libro');
    }
  };

  const handleDevolver = async (isbn: string, titulo: string) => {
    try {
      await devolverLibro(isbn);
      toast.success(`"${titulo}" devuelto exitosamente`);
      cargarLibros();
      realizarBusqueda();
    } catch (error) {
      toast.error('Error al devolver el libro');
    }
  };

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Busca en nuestro catálogo</h2>
          <p className="text-lg mb-8 text-blue-100">Más de {todosLosLibros.length} libros disponibles para ti</p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <TextField
              fullWidth
              placeholder="Buscar por título, autor, ISBN..."
              variant="outlined"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={realizarBusqueda}
              disabled={buscando}
              sx={{
                backgroundColor: 'white',
                color: '#2563eb',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
                minWidth: '120px',
              }}
              startIcon={<Search className="w-5 h-5" />}
            >
              Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* Resultados de búsqueda */}
      {mostrarResultados && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                Resultados de búsqueda: "{busqueda}"
              </h3>
              <IconButton onClick={cerrarResultados} size="small">
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            {resultados.length === 0 ? (
              <Alert severity="info" className="max-w-2xl mx-auto">
                <div>
                  <strong>No se encontraron resultados</strong>
                  <p className="mt-2">
                    No hay libros que coincidan con "{busqueda}".
                    Intenta buscar por:
                  </p>
                  <ul className="list-disc ml-5 mt-2">
                    <li>Título del libro</li>
                    <li>Nombre del autor</li>
                    <li>Código ISBN</li>
                    <li>Categoría</li>
                  </ul>
                </div>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resultados.map((libro) => (
                  <Card key={libro.isbn} className="hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-lg line-clamp-2">{libro.titulo}</h4>
                        <Chip
                          label={libro.disponible ? 'Disponible' : 'Prestado'}
                          size="small"
                          sx={{
                            backgroundColor: libro.disponible ? '#10b981' : '#ef4444',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      </div>

                      <div className="space-y-2 text-sm">
                        <p className="text-gray-700">
                          <strong>Autor:</strong> {libro.autor}
                        </p>
                        <p className="text-gray-700">
                          <strong>ISBN:</strong> {libro.isbn}
                        </p>
                        {libro.categoria && (
                          <p className="text-gray-700">
                            <strong>Categoría:</strong> {libro.categoria}
                          </p>
                        )}
                        {libro.ubicacion && (
                          <p className="text-gray-700 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {libro.ubicacion}
                          </p>
                        )}
                        {libro.resumen && (
                          <p className="text-gray-600 text-xs line-clamp-3 mt-2">
                            {libro.resumen}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t">
                        {libro.disponible ? (
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<BookX className="w-4 h-4" />}
                            onClick={() => handlePrestar(libro.isbn, libro.titulo)}
                          >
                            Prestar libro
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<BookCheck className="w-4 h-4" />}
                            onClick={() => handleDevolver(libro.isbn, libro.titulo)}
                          >
                            Devolver libro
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
