import { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, IconButton, Chip, CircularProgress } from '@mui/material';
import { UserPlus, Trash2, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = 'https://cinjudesco.onrender.com/ninos';

interface Nino {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  direccion: string;
  acudiente: string;
  fechaRegistro: string;
}

export function RegistroSection() {
  const [estudiantes, setEstudiantes] = useState<Nino[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    telefono: '',
    direccion: '',
    acudiente: ''
  });

  const cargarNinos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar');
      const data: Nino[] = await res.json();
      setEstudiantes(data);
    } catch {
      toast.error('No se pudo conectar al servidor. Verifica que el backend esté activo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNinos();
  }, []);

  const handleRegistrarEstudiante = async () => {
    if (!nuevoEstudiante.nombre || !nuevoEstudiante.apellido) {
      toast.error('Nombre y apellido son obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        nombre: nuevoEstudiante.nombre,
        apellido: nuevoEstudiante.apellido,
        edad: parseInt(nuevoEstudiante.edad) || 0,
        telefono: nuevoEstudiante.telefono,
        direccion: nuevoEstudiante.direccion,
        acudiente: nuevoEstudiante.acudiente,
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al guardar');
      const creado: Nino = await res.json();
      setEstudiantes(prev => [...prev, creado]);
      toast.success(`${creado.nombre} ${creado.apellido} registrado exitosamente`);
      setOpenDialog(false);
      setNuevoEstudiante({ nombre: '', apellido: '', edad: '', telefono: '', direccion: '', acudiente: '' });
    } catch {
      toast.error('No se pudo registrar el estudiante. Verifica la conexión con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setEstudiantes(prev => prev.filter(e => e.id !== id));
      toast.success('Estudiante eliminado');
    } catch {
      toast.error('No se pudo eliminar el estudiante.');
    }
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Registro de Estudiantes</h2>
            <p className="text-gray-600">Gestión de niños registrados en la fundación CINJUDESCO</p>
          </div>
          <div className="flex gap-2">
            <IconButton onClick={cargarNinos} disabled={loading} title="Recargar lista">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </IconButton>
            <Button
              variant="contained"
              size="large"
              startIcon={<UserPlus className="w-5 h-5" />}
              onClick={() => setOpenDialog(true)}
            >
              Registrar Estudiante
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Estudiantes</p>
                  <p className="text-3xl font-bold">{estudiantes.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de estudiantes */}
        {loading ? (
          <div className="flex justify-center py-16">
            <CircularProgress />
          </div>
        ) : estudiantes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">No hay estudiantes registrados</p>
            <Button
              variant="outlined"
              startIcon={<UserPlus />}
              onClick={() => setOpenDialog(true)}
            >
              Registrar primer estudiante
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estudiantes.map((estudiante) => (
              <Card key={estudiante.id}>
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">
                        {estudiante.nombre} {estudiante.apellido}
                      </h3>
                      {estudiante.edad > 0 && (
                        <Chip label={`${estudiante.edad} años`} size="small" className="mt-1" />
                      )}
                    </div>
                    <IconButton size="small" color="error" onClick={() => handleEliminar(estudiante.id, `${estudiante.nombre} ${estudiante.apellido}`)}>
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {estudiante.acudiente && (
                      <p><strong>Acudiente:</strong> {estudiante.acudiente}</p>
                    )}
                    {estudiante.telefono && (
                      <p><strong>Teléfono:</strong> {estudiante.telefono}</p>
                    )}
                    {estudiante.direccion && (
                      <p><strong>Dirección:</strong> {estudiante.direccion}</p>
                    )}
                    {estudiante.fechaRegistro && (
                      <p className="text-xs text-gray-400">
                        Registrado: {new Date(estudiante.fechaRegistro).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog para registrar estudiante */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Registrar Nuevo Estudiante</DialogTitle>
          <DialogContent>
            <div className="space-y-4 pt-2">
              <TextField
                fullWidth
                label="Nombre *"
                value={nuevoEstudiante.nombre}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, nombre: e.target.value })}
              />
              <TextField
                fullWidth
                label="Apellido *"
                value={nuevoEstudiante.apellido}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, apellido: e.target.value })}
              />
              <TextField
                fullWidth
                label="Edad"
                type="number"
                value={nuevoEstudiante.edad}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, edad: e.target.value })}
              />
              <TextField
                fullWidth
                label="Teléfono"
                value={nuevoEstudiante.telefono}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, telefono: e.target.value })}
                placeholder="+57 300 123 4567"
              />
              <TextField
                fullWidth
                label="Dirección"
                multiline
                rows={2}
                value={nuevoEstudiante.direccion}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, direccion: e.target.value })}
              />
              <TextField
                fullWidth
                label="Acudiente"
                multiline
                rows={2}
                value={nuevoEstudiante.acudiente}
                onChange={(e) => setNuevoEstudiante({ ...nuevoEstudiante, acudiente: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={guardando}>Cancelar</Button>
            <Button variant="contained" onClick={handleRegistrarEstudiante} disabled={guardando}
              startIcon={guardando ? <CircularProgress size={16} color="inherit" /> : undefined}>
              {guardando ? 'Guardando...' : 'Registrar'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
}