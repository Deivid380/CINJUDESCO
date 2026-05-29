import { useState, useEffect } from 'react';
import {
  Card, CardContent, CircularProgress, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert
} from '@mui/material';
import { BookOpen, RefreshCw, AlertCircle, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';

const BASE_API = 'https://cinjudesco.onrender.com';

interface Carnet {
  numeroCarnet: string;
  nombre: string;
  numeroIdentidad: string;
  telefono: string;
  fechaNacimiento?: string;
  direccion?: string;
}

interface Prestamo {
  id: number;
  isbn: string;
  tituloLibro: string;
  numeroCarnet: string;
  fechaPrestamo: string;
  diasTranscurridos?: number;
  carnet?: Carnet;
}

export function PrestamosSection() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarPrestamos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API}/prestamos`);
      if (!res.ok) throw new Error();
      const data: Prestamo[] = await res.json();

      const hoy = new Date();
      const prestamosConDias = data.map(p => {
        const fechaPrestamo = new Date(p.fechaPrestamo);
        const dias = Math.floor((hoy.getTime() - fechaPrestamo.getTime()) / (1000 * 60 * 60 * 24));
        return { ...p, diasTranscurridos: dias };
      });

      // Enriquecer con datos de carnets en paralelo
      const numerosCarnet = [...new Set(prestamosConDias.map(p => p.numeroCarnet).filter(Boolean))];
      const carnetMap: Record<string, Carnet> = {};

      await Promise.allSettled(
        numerosCarnet.map(async (num) => {
          try {
            const r = await fetch(`${BASE_API}/carnets/${num}`);
            if (r.ok) {
              carnetMap[num] = await r.json();
            }
          } catch {
            // carnet no encontrado, continuar
          }
        })
      );

      const prestamosEnriquecidos = prestamosConDias.map(p => ({
        ...p,
        carnet: carnetMap[p.numeroCarnet],
      }));

      setPrestamos(prestamosEnriquecidos);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Préstamos Activos</h2>
            <p className="text-gray-600">Control de libros prestados y seguimiento</p>
          </div>
          <IconButton onClick={cargarPrestamos} disabled={loading} title="Recargar">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </IconButton>
        </div>

        {prestamosVencidos.length > 0 && (
          <Alert severity="warning" className="mb-6" icon={<AlertCircle className="w-5 h-5" />}>
            <strong>{prestamosVencidos.length} préstamo(s)</strong> han superado los 15 días
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Préstamos</p>
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
                  <p className="text-gray-600 text-sm">Préstamos a Tiempo</p>
                  <p className="text-3xl font-bold text-green-600">{prestamos.length - prestamosVencidos.length}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Préstamos Vencidos</p>
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
                  <TableRow>
                    <TableCell><strong>Libro</strong></TableCell>
                    <TableCell><strong>ISBN</strong></TableCell>
                    <TableCell><strong>N° Carnet</strong></TableCell>
                    <TableCell><strong>Prestatario</strong></TableCell>
                    <TableCell><strong>Identidad</strong></TableCell>
                    <TableCell><strong>Teléfono</strong></TableCell>
                    <TableCell><strong>Fecha Préstamo</strong></TableCell>
                    <TableCell><strong>Días</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prestamos.map((p) => {
                    const vencido = (p.diasTranscurridos ?? 0) > 15;
                    return (
                      <TableRow key={p.id} className={vencido ? 'bg-orange-50' : ''}>
                        <TableCell className="font-medium">{p.tituloLibro}</TableCell>
                        <TableCell className="text-sm text-gray-500">{p.isbn}</TableCell>
                        <TableCell>
                          <Chip label={p.numeroCarnet} size="small" variant="outlined" color="primary" />
                        </TableCell>
                        <TableCell>
                          {p.carnet ? (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-gray-400" />
                              <span className="font-medium">{p.carnet.nombre}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {p.carnet?.numeroIdentidad || '—'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {p.carnet?.telefono || '—'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(p.fechaPrestamo).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${vencido ? 'text-orange-600' : 'text-gray-700'}`}>
                            {p.diasTranscurridos} días
                          </span>
                        </TableCell>
                        <TableCell>
                          {vencido ? (
                            <Chip label="Vencido" size="small" color="warning" icon={<AlertCircle className="w-3 h-3" />} />
                          ) : (
                            <Chip label="Activo" size="small" color="success" />
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
