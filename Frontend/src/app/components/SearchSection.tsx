import { useState, useEffect } from 'react';
import { Search, X, BookCheck, BookX, MapPin } from 'lucide-react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { obtenerLibros, crearLibro, eliminarLibro, prestarLibro, devolverLibro, type Libro} from '../services/api';
import { toast } from 'sonner';

export function SearchSection() {

  const [busqueda, setBusqueda] = useState('');
  const [todosLosLibros, setTodosLosLibros] = useState<Libro[]>([]);
  const [resultados, setResultados] = useState<Libro[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  // Estados del modal de préstamo
  const [modalPrestamo, setModalPrestamo] = useState(false);
  const [guardandoPrestamo, setGuardandoPrestamo] = useState(false);
  const [buscandoCarnet, setBuscandoCarnet] = useState(false);
  const [carnetEncontrado, setCarnetEncontrado] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState<Libro | null>(null);
  const [numeroCarnet, setNumeroCarnet] = useState('');
  const [datosCarnet, setDatosCarnet] = useState({
    numeroCarnet: '',
    nombre: '',
    numeroIdentidad: '',
    telefono: '',
    fechaNacimiento: '',
    direccion: ''
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
    setNumeroCarnet('');
    setCarnetEncontrado(false);
    setDatosCarnet({
      numeroCarnet: '',
      nombre: '',
      numeroIdentidad: '',
      telefono: '',
      fechaNacimiento: '',
      direccion: ''
    });
  };

  // 🔍 BUSCAR CARNET
  const buscarCarnet = async () => {
    if (!numeroCarnet.trim()) {
      toast.error('Ingresa un número de carnet');
      return;
    }

    setBuscandoCarnet(true);
    try {
      const res = await fetch(`https://cinjudesco.onrender.com/carnets/${numeroCarnet}`);

      if (res.ok) {
        const carnet = await res.json();
        setDatosCarnet({
          numeroCarnet: carnet.numeroCarnet,
          nombre: carnet.nombre,
          numeroIdentidad: carnet.numeroIdentidad,
          telefono: carnet.telefono,
          fechaNacimiento: carnet.fechaNacimiento,
          direccion: carnet.direccion
        });
        setCarnetEncontrado(true);
        toast.success('Carnet encontrado');
      } else if (res.status === 404) {
        setDatosCarnet({
          numeroCarnet: numeroCarnet,
          nombre: '',
          numeroIdentidad: '',
          telefono: '',
          fechaNacimiento: '',
          direccion: ''
        });
        setCarnetEncontrado(false);
        toast.info('Carnet no encontrado. Completa los datos para crear uno nuevo.');
      } else {
        throw new Error();
      }
    } catch {
      toast.error('Error al buscar el carnet');
    } finally {
      setBuscandoCarnet(false);
    }
  };

  // ✅ CONFIRMAR PRÉSTAMO
  const confirmarPrestamo = async () => {
    if (!libroSeleccionado) return;
    if (!datosCarnet.numeroCarnet || !datosCarnet.nombre || !datosCarnet.numeroIdentidad || !datosCarnet.telefono) {
      toast.error('Completa todos los campos obligatorios (número de carnet, nombre, identidad y teléfono)');
      return;
    }

    setGuardandoPrestamo(true);
    try {
      // Si el carnet no existe, crearlo primero
      if (!carnetEncontrado) {
        const resCarnet = await fetch('https://cinjudesco.onrender.com/carnets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosCarnet),
        });

        if (!resCarnet.ok) {
          toast.error('Error al crear el carnet');
          return;
        }
        toast.success('Carnet creado exitosamente');
      }

      // Registrar préstamo
      const resPrestamo = await fetch('https://cinjudesco.onrender.com/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isbn: libroSeleccionado.isbn,
          tituloLibro: libroSeleccionado.titulo,
          numeroCarnet: datosCarnet.numeroCarnet
        }),
      });

      if (!resPrestamo.ok) throw new Error();

      // Marcar libro como prestado
      await prestarLibro(libroSeleccionado.isbn);

      toast.success(`Libro prestado a ${datosCarnet.nombre}`);
      setModalPrestamo(false);
      setNumeroCarnet('');
      setCarnetEncontrado(false);
      setDatosCarnet({
        numeroCarnet: '',
        nombre: '',
        numeroIdentidad: '',
        telefono: '',
        fechaNacimiento: '',
        direccion: ''
      });
      setLibroSeleccionado(null);
      cargarLibros();
    } catch (error) {
      toast.error('Error al registrar el préstamo');
      console.error(error);
    } finally {
      setGuardandoPrestamo(false);
    }
  };

  // 🔁 DEVOLVER
  const handleDevolver = async (isbn: string, titulo: string) => {
    try {
      // Buscar el préstamo activo y marcarlo como devuelto (devuelto=true + fechaDevolucion)
      const resPrestamos = await fetch('https://cinjudesco.onrender.com/prestamos');
      if (resPrestamos.ok) {
        const prestamos: { id: number; isbn: string }[] = await resPrestamos.json();
        const prestamoActivo = prestamos.find(p => p.isbn === isbn);
        if (prestamoActivo) {
          await fetch(`https://cinjudesco.onrender.com/prestamos/devolver/${prestamoActivo.id}`, {
            method: 'PUT',
          });
        }
      }

      // Marcar el libro como disponible
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl w-[480px] max-h-[90vh] overflow-y-auto">

            <h3 className="text-xl font-bold mb-4">
              Prestar: {libroSeleccionado?.titulo}
            </h3>

            {/* Buscar carnet */}
            <div className="flex gap-2 mb-4">
              <TextField
                fullWidth
                label="Número de Carnet *"
                value={numeroCarnet}
                onChange={(e) => setNumeroCarnet(e.target.value)}
                placeholder="C-001"
                disabled={buscandoCarnet || carnetEncontrado}
              />
              {!carnetEncontrado && (
                <Button
                  variant="outlined"
                  onClick={buscarCarnet}
                  disabled={buscandoCarnet || !numeroCarnet.trim()}
                  sx={{ minWidth: '100px' }}
                >
                  {buscandoCarnet ? <CircularProgress size={20} /> : 'Buscar'}
                </Button>
              )}
            </div>

            {(numeroCarnet && !buscandoCarnet) && (
              <div className="space-y-3">
                {carnetEncontrado && (
                  <div className="p-3 bg-green-50 rounded border border-green-200 mb-3">
                    <p className="text-sm text-green-800 font-medium">✓ Carnet encontrado</p>
                  </div>
                )}

                <TextField
                  fullWidth
                  label="Nombre Completo *"
                  value={datosCarnet.nombre}
                  onChange={(e) => setDatosCarnet({ ...datosCarnet, nombre: e.target.value })}
                  placeholder="Juan Pérez"
                  disabled={carnetEncontrado}
                />
                <TextField
                  fullWidth
                  label="Número de Identidad *"
                  value={datosCarnet.numeroIdentidad}
                  onChange={(e) => setDatosCarnet({ ...datosCarnet, numeroIdentidad: e.target.value })}
                  placeholder="1234567890"
                  disabled={carnetEncontrado}
                />
                <TextField
                  fullWidth
                  label="Teléfono *"
                  value={datosCarnet.telefono}
                  onChange={(e) => setDatosCarnet({ ...datosCarnet, telefono: e.target.value })}
                  placeholder="+57 300 123 4567"
                  disabled={carnetEncontrado}
                />
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  type="date"
                  value={datosCarnet.fechaNacimiento}
                  onChange={(e) => setDatosCarnet({ ...datosCarnet, fechaNacimiento: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  disabled={carnetEncontrado}
                />
                <TextField
                  fullWidth
                  label="Dirección"
                  multiline
                  rows={2}
                  value={datosCarnet.direccion}
                  onChange={(e) => setDatosCarnet({ ...datosCarnet, direccion: e.target.value })}
                  placeholder="Calle 123 #45-67"
                  disabled={carnetEncontrado}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={() => setModalPrestamo(false)} disabled={guardandoPrestamo}>
                Cancelar
              </Button>

              <Button
                variant="contained"
                onClick={confirmarPrestamo}
                disabled={guardandoPrestamo || !numeroCarnet || !datosCarnet.nombre}
                startIcon={guardandoPrestamo ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                {guardandoPrestamo ? 'Registrando...' : 'Confirmar'}
              </Button>
            </div>

          </div>

        </div>
      )}
    </>
  );
}