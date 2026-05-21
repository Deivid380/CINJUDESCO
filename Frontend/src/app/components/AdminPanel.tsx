import { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Plus, Trash2, BookCheck, BookX, Edit } from 'lucide-react';
import { obtenerLibros, crearLibro, eliminarLibro, prestarLibro, devolverLibro, type Libro } from '../services/api';
import { toast } from 'sonner';
import { BackendStatus } from './BackendStatus';

// Categorías disponibles (las mismas de CategoriesSection)
const CATEGORIAS_DISPONIBLES = [
  'Autoayuda',
  'Ciencias',
  'Historia',
  'Matemáticas',
  'Lenguaje',
  'Filosofía',
  'Literatura',
  'Novelas',
  'Cuentos',
  'Danza',
  'Musica',
  'Artes',
  'Historia Local',
  'Infantil'
];

export function AdminPanel() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [estanteria, setEstanteria] = useState('');
  const [fila, setFila] = useState('');
  const [nuevoLibro, setNuevoLibro] = useState<Libro>({
    isbn: '',
    titulo: '',
    autor: '',
    categoria: '',
    resumen: '',
    ubicacion: '',
    portadaUrl: '',
    disponible: true,
  });

  // Cargar libros al montar el componente
  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      setLoading(true);
      const data = await obtenerLibros();
      setLibros(data);
    } catch (error) {
      toast.error('Error al cargar los libros');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearLibro = async () => {
    if (!nuevoLibro.isbn || !nuevoLibro.titulo || !nuevoLibro.autor) {
      toast.error('ISBN, Título y Autor son obligatorios');
      return;
    }

    // Construir ubicación desde estantería y fila
    let ubicacionFinal = '';
    if (estanteria && fila) {
      ubicacionFinal = `Estantería ${estanteria}, Fila ${fila}`;
    } else if (estanteria) {
      ubicacionFinal = `Estantería ${estanteria}`;
    } else if (fila) {
      ubicacionFinal = `Fila ${fila}`;
    }

    try {
      await crearLibro({ ...nuevoLibro, ubicacion: ubicacionFinal });
      toast.success('Libro creado exitosamente');
      setOpenDialog(false);
      setNuevoLibro({
        isbn: '',
        titulo: '',
        autor: '',
        categoria: '',
        resumen: '',
        ubicacion: '',
        portadaUrl: '',
        disponible: true,
      });
      setEstanteria('');
      setFila('');
      cargarLibros();
    } catch (error) {
      toast.error('Error al crear el libro');
      console.error(error);
    }
  };

  const handleEliminarLibro = async (isbn: string, titulo: string) => {
    if (window.confirm(`¿Estás seguro de eliminar "${titulo}"?`)) {
      try {
        await eliminarLibro(isbn);
        toast.success('Libro eliminado');
        cargarLibros();
      } catch (error) {
        toast.error('Error al eliminar el libro');
        console.error(error);
      }
    }
  };

  const handlePrestarLibro = async (isbn: string) => {
    try {
      await prestarLibro(isbn);
      toast.success('Libro prestado');
      cargarLibros();
    } catch (error) {
      toast.error('Error al prestar el libro');
      console.error(error);
    }
  };

  const handleDevolverLibro = async (isbn: string) => {
    try {
      await devolverLibro(isbn);
      toast.success('Libro devuelto');
      cargarLibros();
    } catch (error) {
      toast.error('Error al devolver el libro');
      console.error(error);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackendStatus />
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Panel de Administración</h2>
          <Button
            variant="contained"
            startIcon={<Plus className="w-5 h-5" />}
            onClick={() => setOpenDialog(true)}
          >
            Agregar Libro
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando libros...</p>
          </div>
        ) : libros.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No hay libros registrados</p>
            <Button
              variant="outlined"
              startIcon={<Plus />}
              onClick={() => setOpenDialog(true)}
              sx={{ mt: 2 }}
            >
              Agregar primer libro
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {libros.map((libro) => (
                  <tr key={libro.isbn} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{libro.isbn}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{libro.titulo}</div>
                      {libro.resumen && (
                        <div className="text-xs text-gray-500 line-clamp-2 max-w-xs">{libro.resumen}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {libro.autor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {libro.categoria || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {libro.ubicacion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Chip
                        label={libro.disponible ? 'Disponible' : 'Prestado'}
                        size="small"
                        sx={{
                          backgroundColor: libro.disponible ? '#10b981' : '#ef4444',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {libro.disponible ? (
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handlePrestarLibro(libro.isbn)}
                            title="Prestar libro"
                          >
                            <BookX className="w-4 h-4" />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleDevolverLibro(libro.isbn)}
                            title="Devolver libro"
                          >
                            <BookCheck className="w-4 h-4" />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleEliminarLibro(libro.isbn, libro.titulo)}
                          title="Eliminar libro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Dialog para agregar libro */}
        <Dialog open={openDialog} onClose={() => {
          setOpenDialog(false);
          setEstanteria('');
          setFila('');
        }} maxWidth="sm" fullWidth>
          <DialogTitle>Agregar Nuevo Libro</DialogTitle>
          <DialogContent>
            <div className="space-y-4 pt-2">
              <TextField
                fullWidth
                label="ISBN *"
                value={nuevoLibro.isbn}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, isbn: e.target.value })}
                placeholder="978-3-16-148410-0"
              />
              <TextField
                fullWidth
                label="Título *"
                value={nuevoLibro.titulo}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
              />
              <TextField
                fullWidth
                label="Autor *"
                value={nuevoLibro.autor}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={nuevoLibro.categoria || ''}
                  label="Categoría"
                  onChange={(e) => setNuevoLibro({ ...nuevoLibro, categoria: e.target.value })}
                >
                  <MenuItem value="">
                    <em>Seleccionar categoría</em>
                  </MenuItem>
                  {CATEGORIAS_DISPONIBLES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Resumen"
                multiline
                rows={3}
                value={nuevoLibro.resumen}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, resumen: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Estantería"
                  type="number"
                  value={estanteria}
                  onChange={(e) => setEstanteria(e.target.value)}
                  placeholder="1"
                  inputProps={{ min: 1 }}
                />
                <TextField
                  label="Fila"
                  type="number"
                  value={fila}
                  onChange={(e) => setFila(e.target.value)}
                  placeholder="1"
                  inputProps={{ min: 1 }}
                />
              </div>
              {(estanteria || fila) && (
                <div className="text-sm text-gray-500 -mt-2">
                  Vista previa: <strong className="text-gray-700">
                    {estanteria && fila
                      ? `Estantería ${estanteria}, Fila ${fila}`
                      : estanteria
                      ? `Estantería ${estanteria}`
                      : `Fila ${fila}`}
                  </strong>
                </div>
              )}
              <TextField
                fullWidth
                label="URL de Portada"
                value={nuevoLibro.portadaUrl}
                onChange={(e) => setNuevoLibro({ ...nuevoLibro, portadaUrl: e.target.value })}
                placeholder="https://ejemplo.com/portada.jpg"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenDialog(false);
              setEstanteria('');
              setFila('');
            }}>Cancelar</Button>
            <Button variant="contained" onClick={handleCrearLibro}>
              Crear Libro
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
}
