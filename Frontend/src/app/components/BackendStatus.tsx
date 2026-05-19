import { useState, useEffect } from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { verificarBackend } from '../services/api';

export function BackendStatus() {
  const [conectado, setConectado] = useState<boolean | null>(null);
  const [verificando, setVerificando] = useState(false);

  const verificarConexion = async () => {
    setVerificando(true);
    const disponible = await verificarBackend();
    setConectado(disponible);
    setVerificando(false);
  };

  useEffect(() => {
    verificarConexion();
  }, []);

  if (conectado === null) {
    return null;
  }

  if (conectado) {
    return (
      <Alert severity="success" className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            <div>
              <AlertTitle>Conectado al backend</AlertTitle>
              Spring Boot funcionando en https://cinjudesco.onrender.com
            </div>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <Alert severity="warning" className="mb-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-1">
          <WifiOff className="w-5 h-5" />
          <div>
            <AlertTitle>Modo de desarrollo</AlertTitle>
            Backend no disponible. Mostrando datos de ejemplo. Para conectar al backend:
            <ol className="list-decimal ml-5 mt-2 text-sm">
              <li>Inicia tu aplicación Spring Boot</li>
              <li>Verifica que esté en https://cinjudesco.onrender.com</li>
              <li>Asegúrate de tener @CrossOrigin configurado</li>
            </ol>
          </div>
        </div>
        <Button
          size="small"
          startIcon={<RefreshCw className={`w-4 h-4 ${verificando ? 'animate-spin' : ''}`} />}
          onClick={verificarConexion}
          disabled={verificando}
        >
          Reconectar
        </Button>
      </div>
    </Alert>
  );
}
