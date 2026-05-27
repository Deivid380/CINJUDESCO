import { useState, useEffect } from 'react';
import { Search, X, BookCheck, BookX, MapPin } from 'lucide-react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert
} from '@mui/material';
import { obtenerLibros, type Libro } from '../services/api';
import { toast } from 'sonner';

export function SearchSection() {

  const [busqueda, setBusqueda] = useState('');
  const [todosLosLibros, setTodosLosLibros] = useState<Libro[]>([]);
  const [resultados, setResultados] = useState<Libro[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // 🔥 NUEVO: estados del modal
  const [modalPrestamo, setModalPrestamo] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(null);
  const [datosPrestamo, setDatosPrestamo] = useState({
    nombrePrestatario: '',
    documentoPrestatario: '',
    telefonoPrestatario: ''
  });

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

  // 🔍 BUSCAR
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
      toast.info('No se encontraron libros');
    } else {
      toast.success(`Se encontraron ${librosEncontrados.length} libro(s)`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') realizarBusqueda();
  };

  const cerrarResultados = () => {
    setMostrarResultados(false);
    setBusqueda('');
    setResultados([]);
  };

  // 📖 ABRIR MODAL
  const abrirModalPrestamo = (libro: Libro) => {
    setLibroSeleccionado(libro);
    setModalPrestamo(true);
  };

  // ✅ CONFIRMAR PRÉSTAMO
  const confirmarPrestamo = async () => {

    if (!libroSeleccionado) return;

    try {

      await fetch('https://cinjudesco.onrender.com/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isbnLibro: libroSeleccionado.isbn,
          tituloLibro: libroSeleccionado.titulo,
          nombrePrestatario: datosPrestamo.nombrePrestatario,
          documentoPrestatario: datosPrestamo.documentoPrestatario,
          telefonoPrestatario: datosPrestamo.telefonoPrestatario
        })
      });

      toast.success(`"${libroSeleccionado.titulo}" prestado`);

      setModalPrestamo(false);
      setDatosPrestamo({
        nombrePrestatario: '',
        documentoPrestatario: '',
        telefonoPrestatario: ''
      });

      cargarLibros();
      realizarBusqueda();

    } catch (error) {
      toast.error('Error al prestar');
    }
  };

  // 🔁 DEVOLVER
  const handleDevolver = async (isbn: string, titulo: string) => {

    try {

      await fetch(`https://cinjudesco.onrender.com/prestamos/devolver/${isbn}`, {
        method: 'PUT'
      });

      toast.success(`"${titulo}" devuelto`);

      cargarLibros();
      realizarBusqueda();

    } catch (error) {
      toast.error('Error al devolver');
    }
  };

  return (
    <>
      {/* 🔍 BUSCADOR */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Busca en nuestro catálogo</h2>

          <p className="mb-8">
            Más de {todosLosLibros.length} libros disponibles
          </p>

          <div className="flex gap-3">
            <TextField
              fullWidth
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />

            <Button onClick={realizarBusqueda} variant="contained">
              Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* 📚 RESULTADOS */}
      {mostrarResultados && (
        <section className="p-6">

          <div className="flex justify-between mb-4">
            <h3>Resultados: "{busqueda}"</h3>

            <IconButton onClick={cerrarResultados}>
              <X />
            </IconButton>
          </div>

          {resultados.length === 0 ? (
            <Alert severity="info">
              No se encontraron libros
            </Alert>
          ) : (

            <div className="grid md:grid-cols-3 gap-4">

              {resultados.map(libro => (

                <Card key={libro.isbn}>
                  <CardContent>

                    <h3>{libro.titulo}</h3>

                    <Chip
                      label={libro.disponible ? 'Disponible' : 'Prestado'}
                      color={libro.disponible ? 'success' : 'error'}
                    />

                    <p><b>Autor:</b> {libro.autor}</p>
                    <p><b>ISBN:</b> {libro.isbn}</p>

                    {libro.ubicacion && (
                      <p><MapPin size={14} /> {libro.ubicacion}</p>
                    )}

                    <div className="mt-3">

                      {libro.disponible ? (
                        <Button
                          fullWidth
                          onClick={() => abrirModalPrestamo(libro)}
                        >
                          Prestar
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          color="success"
                          onClick={() => handleDevolver(libro.isbn, libro.titulo)}
                        >
                          Devolver
                        </Button>
                      )}

                    </div>

                  </CardContent>
                </Card>

              ))}

            </div>
          )}
        </section>
      )}

      {/* 🪟 MODAL */}
      {modalPrestamo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h3 className="text-xl font-bold mb-4">
              Prestar: {libroSeleccionado?.titulo}
            </h3>

            <TextField
              fullWidth
              label="Nombre (opcional)"
              value={datosPrestamo.nombrePrestatario}
              onChange={(e) => setDatosPrestamo({ ...datosPrestamo, nombrePrestatario: e.target.value })}
              className="mb-3"
            />

            <TextField
              fullWidth
              label="Documento (opcional)"
              value={datosPrestamo.documentoPrestatario}
              onChange={(e) => setDatosPrestamo({ ...datosPrestamo, documentoPrestatario: e.target.value })}
              className="mb-3"
            />
            <TextField
              fullWidth
              label="Teléfono (opcional)"
              value={datosPrestamo.telefonoPrestatario}
              onChange={(e) => setDatosPrestamo({ ...datosPrestamo, telefonoPrestatario: e.target.value })}
              className="mb-3"
            />

            <div className="flex justify-end gap-2 mt-4">

              <Button onClick={() => setModalPrestamo(false)}>
                Cancelar
              </Button>

              <Button variant="contained" onClick={confirmarPrestamo}>
                Confirmar
              </Button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}