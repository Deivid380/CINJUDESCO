import { useState, useEffect } from 'react';
import { Button, Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Users, CheckCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Asistencia {
  fecha: string;
  clase: string;
  estudiantes: string[];
}

const CLASES_DISPONIBLES = [
  'Biblioteca',
  'Rap niños',
  'Rap jóvenes',
  'Danza niños',
  'Danza jóvenes'
];

export function ClasesSection() {
  const [claseSeleccionada, setClaseSeleccionada] = useState<string>('');
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);

  const registrarAsistencia = () => {
    if (!claseSeleccionada) {
      toast.error('Selecciona una clase primero');
      return;
    }

    const nuevaAsistencia: Asistencia = {
      fecha: new Date().toLocaleDateString('es-ES'),
      clase: claseSeleccionada,
      estudiantes: [] // Se llenarían con los niños que asistieron
    };

    setAsistencias([...asistencias, nuevaAsistencia]);
    toast.success(`Asistencia registrada para ${claseSeleccionada}`);
  };

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Registro de Asistencia - Clases</h2>
          <p className="text-gray-600">Sistema de control de asistencia para las clases de SINJUDESCO</p>
        </div>

        {/* Tarjetas de clases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {CLASES_DISPONIBLES.map((clase) => (
            <Card
              key={clase}
              className={`cursor-pointer transition-all ${
                claseSeleccionada === clase
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setClaseSeleccionada(clase)}
            >
              <CardContent className="text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">{clase}</h3>
                {claseSeleccionada === clase && (
                  <Chip
                    label="Seleccionada"
                    size="small"
                    color="primary"
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botón de registro */}
        {claseSeleccionada && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Clase: {claseSeleccionada}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckCircle className="w-5 h-5" />}
                onClick={registrarAsistencia}
              >
                Registrar Asistencia
              </Button>
            </div>
          </div>
        )}

        {/* Historial de asistencias */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">Historial de Asistencias</h3>
          </div>

          {asistencias.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No hay asistencias registradas aún</p>
              <p className="text-sm mt-2">Selecciona una clase y registra la asistencia del día</p>
            </div>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Clase</strong></TableCell>
                    <TableCell><strong>Estudiantes</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asistencias.map((asistencia, index) => (
                    <TableRow key={index}>
                      <TableCell>{asistencia.fecha}</TableCell>
                      <TableCell>
                        <Chip label={asistencia.clase} size="small" />
                      </TableCell>
                      <TableCell>{asistencia.estudiantes.length} asistentes</TableCell>
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
