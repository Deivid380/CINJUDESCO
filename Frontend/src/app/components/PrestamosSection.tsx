import { useState, useEffect } from 'react';
import {
  Card, CardContent, CircularProgress, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert
} from '@mui/material';
import { BookOpen, RefreshCw, AlertCircle, CheckCircle, CreditCard, User, Phone, Hash } from 'lucide-react';
import { toast } from 'sonner';

const PRESTAMOS_API = 'https://cinjudesco.onrender.com/prestamos';

// Refleja exactamente el modelo Prestamo del backend
interface Prestamo {
  id: number;
  isbn: string;
  tituloLibro: string;
  fechaPrestamo: string;       // LocalDate → "YYYY-MM-DD"
  fechaDevolucion: string | null;
  devuelto: boolean;
  numeroCarnet: string;
  nombrePrestatario: string;
  numeroIdentidad: string;
  telefono: string;
  diasTranscurridos?: number;
}

export function PrestamosSection() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarPrestamos = async () => {
    setLoading(true);
    try {
      // GET /prestamos devuelve solo los activos (devuelto = false)
      const res = await fetch(PRESTAMOS_API);
      if (!res.ok) throw new Error();

      const data: Prestamo[] = await res.json();

      const hoy = new Date();
      const enriquecidos = data.map(p => {
        const fechaPrestamo = new Date(p.fechaPrestamo);
        const dias = Math.floor(
          (hoy.getTime() - fechaPrestamo.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { ...p, diasTranscurridos: dias };
      });

      setPrestamos(enriquecidos);
    } catch {
      toast.error('No se pudo cargar los préstamos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const prestamosVencidos = prestamos.filter(p => (p.diasTranscurridos ?? 0) > 15);

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Préstamos Activos</h2>
            <p className="text-gray-600">Control de libros prestados y seguimiento de devoluciones</p>
          </div>
          <IconButton onClick={cargarPrestamos} disabled={loading} title="Recargar">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </IconButton>
        </div>

        {/* Alerta de vencidos */}
        {prestamosVencidos.length > 0 && (
          <Alert severity="warning" className="mb-6" icon={<AlertCircle className="w-5 h-5" />}>
            <strong>{prestamosVencidos.length} préstamo(s)</strong> han superado los 15 días sin devolución
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Activos</p>
                  <p className="text-3xl font-bold">{prestamos.length}</p>
                </div>
                <BookOpen className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">A Tiempo</p>
                  <p className="text-3xl font-bold text-green-600">
                    {prestamos.length - prestamosVencidos.length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Vencidos (+15 días)</p>
                  <p className="text-3xl font-bold text-orange-600">{prestamosVencidos.length}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">Listado de Préstamos</h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <CircularProgress />
            </div>
          ) : prestamos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No hay préstamos activos</p>
            </div>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                    <TableCell><strong>Libro</strong></TableCell>
                    <TableCell><strong>ISBN</strong></TableCell>
                    <TableCell><strong>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" /> N° Carnet
                      </div>
                    </strong></TableCell>
                    <TableCell><strong>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" /> Prestatario
                      </div>
                    </strong></TableCell>
                    <TableCell><strong>
                      <div className="flex items-center gap-1">
                        <Hash className="w-4 h-4" /> Identidad
                      </div>
                    </strong></TableCell>
                    <TableCell><strong>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" /> Teléfono
                      </div>
                    </strong></TableCell>
                    <TableCell><strong>Fecha Préstamo</strong></TableCell>
                    <TableCell><strong>Días</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prestamos.map((p) => {
                    const vencido = (p.diasTranscurridos ?? 0) > 15;
                    return (
                      <TableRow
                        key={p.id}
                        sx={{ backgroundColor: vencido ? '#fff7ed' : 'inherit' }}
                      >
                        <TableCell>
                          <p className="font-medium text-gray-900">{p.tituloLibro}</p>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">{p.isbn}</span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.numeroCarnet}
                            size="small"
                            variant="outlined"
                            color="primary"
                            icon={<CreditCard className="w-3 h-3" />}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-800">
                            {p.nombrePrestatario || '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {p.numeroIdentidad || '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {p.telefono || '—'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {new Date(p.fechaPrestamo).toLocaleDateString('es-ES', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold text-sm ${vencido ? 'text-orange-600' : 'text-gray-700'}`}>
                            {p.diasTranscurridos} día{p.diasTranscurridos !== 1 ? 's' : ''}
                          </span>
                        </TableCell>
                        <TableCell>
                          {vencido ? (
                            <Chip
                              label="Vencido"
                              size="small"
                              color="warning"
                            />
                          ) : (
                            <Chip
                              label="Activo"
                              size="small"
                              color="success"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </section>
  );
}
