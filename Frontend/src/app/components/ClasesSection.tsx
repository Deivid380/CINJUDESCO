import { useState, useEffect, useMemo } from 'react';
import {
  Button, Card, CardContent, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField,
  CircularProgress, IconButton, Checkbox
} from '@mui/material';
import { Users, CheckCircle, Calendar, Search, X, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const NINOS_API = 'https://cinjudesco.onrender.com/ninos';
const ASISTENCIAS_API = 'https://cinjudesco.onrender.com/asistencias';

interface Nino {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
}

interface Asistencia {
  id: number;
  fecha: string;
  clase: string;
  estudiantes: Nino[];
  cantidadAsistentes: number;
  comentario: string;
}

const CLASES_DISPONIBLES = [
  'Biblioteca',
  'Rap niños',
  'Rap jóvenes',
  'Danza niños',
  'Danza jóvenes',
  'Hip Hop',
  'Musica',
];

export function ClasesSection() {
  const [claseSeleccionada, setClaseSeleccionada] = useState<string>('');
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [ninos, setNinos] = useState<Nino[]>([]);
  const [loadingNinos, setLoadingNinos] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [comentario, setComentario] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarNinos = async () => {
    setLoadingNinos(true);
    try {
      const res = await fetch(NINOS_API);
      if (!res.ok) throw new Error();
      const data: Nino[] = await res.json();
      setNinos(data);
    } catch {
      toast.error('No se pudo cargar la lista de estudiantes.');
    } finally {
      setLoadingNinos(false);
    }
  };

  const cargarHistorial = async () => {
    setLoadingHistorial(true);
    try {
      const res = await fetch(ASISTENCIAS_API);
      if (!res.ok) throw new Error();
      const data: Asistencia[] = await res.json();
      setAsistencias(data.reverse());
    } catch {
      toast.error('No se pudo cargar el historial de asistencias.');
    } finally {
      setLoadingHistorial(false);
    }
  };

  useEffect(() => {
    cargarNinos();
    cargarHistorial();
  }, []);

  const ninosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return ninos;
    return ninos.filter(
      (n) =>
        n.nombre.toLowerCase().includes(q) ||
        n.apellido.toLowerCase().includes(q)
    );
  }, [ninos, busqueda]);

  const toggleSeleccion = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSeleccionarClase = (clase: string) => {
    setClaseSeleccionada(clase);
    setSeleccionados([]);
    setBusqueda('');
    setComentario('');
  };

  const handleRegistrarAsistencia = async () => {
    if (!claseSeleccionada) {
      toast.error('Selecciona una clase primero');
      return;
    }
    if (seleccionados.length === 0) {
      toast.error('Selecciona al menos un estudiante');
      return;
    }

    setGuardando(true);
    try {
      const estudiantesPresentes = ninos.filter((n) => seleccionados.includes(n.id));
      const payload = {
        clase: claseSeleccionada,
        estudiantes: estudiantesPresentes.map(({ id, nombre, apellido, edad }) => ({ id, nombre, apellido, edad })),
        comentario,
      };

      const res = await fetch(ASISTENCIAS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      const guardada: Asistencia = await res.json();
      setAsistencias((prev) => [guardada, ...prev]);
      toast.success(`Asistencia registrada: ${estudiantesPresentes.length} estudiante(s) en ${claseSeleccionada}`);
      setSeleccionados([]);
      setBusqueda('');
      setComentario('');
    } catch {
      toast.error('No se pudo guardar la asistencia. Verifica la conexión con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Registro de Asistencia - Clases</h2>
          <p className="text-gray-600">Sistema de control de asistencia para las clases de CINJUDESCO</p>
        </div>

        {/* Tarjetas de clases */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {CLASES_DISPONIBLES.map((clase) => (
            <Card
              key={clase}
              className={`cursor-pointer transition-all ${
                claseSeleccionada === clase
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleSeleccionarClase(clase)}
            >
              <CardContent className="text-center py-4 px-2">
                <Users className={`w-8 h-8 mx-auto mb-2 ${claseSeleccionada === clase ? 'text-blue-600' : 'text-gray-400'}`} />
                <h3 className="font-semibold text-sm leading-tight">{clase}</h3>
                {claseSeleccionada === clase && (
                  <Chip label="Activa" size="small" color="primary" className="mt-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Panel de asistencia */}
        {claseSeleccionada && (
          <div className="mb-8 bg-white rounded-lg shadow">
            {/* Header del panel */}
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{claseSeleccionada}</h3>
                <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('es-ES', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {seleccionados.length > 0 && (
                  <Chip
                    label={`${seleccionados.length} seleccionado(s)`}
                    color="primary"
                    variant="outlined"
                  />
                )}
                <IconButton onClick={cargarNinos} disabled={loadingNinos} title="Recargar estudiantes" size="small">
                  <RefreshCw className={`w-4 h-4 ${loadingNinos ? 'animate-spin' : ''}`} />
                </IconButton>
              </div>
            </div>

            <div className="p-6">
              {/* Buscador */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar estudiante por nombre o apellido..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  InputProps={{
                    startAdornment: <span className="w-5" />,
                    endAdornment: busqueda ? (
                      <IconButton size="small" onClick={() => setBusqueda('')}>
                        <X className="w-4 h-4" />
                      </IconButton>
                    ) : null,
                  }}
                  sx={{ '& .MuiInputBase-root': { paddingLeft: '2.25rem' } }}
                />
              </div>

              {/* Lista de estudiantes */}
              {loadingNinos ? (
                <div className="flex justify-center py-8">
                  <CircularProgress size={32} />
                </div>
              ) : ninosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">
                    {busqueda ? `Sin resultados para "${busqueda}"` : 'No hay estudiantes registrados'}
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden mb-5">
                  <div className="max-h-64 overflow-y-auto divide-y">
                    {ninosFiltrados.map((nino) => {
                      const seleccionado = seleccionados.includes(nino.id);
                      return (
                        <div
                          key={nino.id}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                            seleccionado ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleSeleccion(nino.id)}
                        >
                          <Checkbox
                            checked={seleccionado}
                            size="small"
                            color="primary"
                            onChange={() => toggleSeleccion(nino.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              {nino.nombre} {nino.apellido}
                            </p>
                            {nino.edad > 0 && (
                              <p className="text-xs text-gray-400">{nino.edad} años</p>
                            )}
                          </div>
                          {seleccionado && (
                            <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chips de seleccionados */}
              {seleccionados.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Asistentes marcados</p>
                  <div className="flex flex-wrap gap-2">
                    {seleccionados.map((id) => {
                      const nino = ninos.find((n) => n.id === id);
                      if (!nino) return null;
                      return (
                        <Chip
                          key={id}
                          label={`${nino.nombre} ${nino.apellido}`}
                          size="small"
                          onDelete={() => toggleSeleccion(id)}
                          color="primary"
                          variant="outlined"
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Campo de comentario */}
              <div className="mb-5">
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Comentario (opcional)"
                  placeholder="Ej: Clase muy activa, se trabajó el tema de ritmo..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-1 self-start" />
                    ),
                  }}
                />
              </div>

              {/* Botón registrar */}
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={guardando ? <CircularProgress size={18} color="inherit" /> : <CheckCircle className="w-5 h-5" />}
                  onClick={handleRegistrarAsistencia}
                  disabled={guardando || seleccionados.length === 0}
                >
                  {guardando ? 'Registrando...' : `Registrar Asistencia (${seleccionados.length})`}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Historial de asistencias */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-xl font-semibold">Historial de Asistencias</h3>
            <IconButton onClick={cargarHistorial} disabled={loadingHistorial} title="Recargar historial" size="small">
              <RefreshCw className={`w-4 h-4 ${loadingHistorial ? 'animate-spin' : ''}`} />
            </IconButton>
          </div>

          {loadingHistorial ? (
            <div className="flex justify-center py-12">
              <CircularProgress />
            </div>
          ) : asistencias.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No hay asistencias registradas aún</p>
              <p className="text-sm mt-2">Selecciona una clase, marca los estudiantes y registra la asistencia</p>
            </div>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Clase</strong></TableCell>
                    <TableCell><strong>Estudiantes</strong></TableCell>
                    <TableCell><strong>Comentario</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asistencias.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-sm capitalize">
                        {a.fecha
                          ? new Date(a.fecha).toLocaleDateString('es-ES', {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            })
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Chip label={a.clase} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-sm font-medium text-gray-700 mr-1">
                            {a.estudiantes.length}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {a.estudiantes.map((e) => (
                              <Chip
                                key={e.id}
                                label={`${e.nombre} ${e.apellido}`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 max-w-xs">
                        {a.comentario || <span className="text-gray-300 italic">Sin comentario</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </section>
  );
}
