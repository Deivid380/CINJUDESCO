import { useState } from 'react';
import { TextField, Button, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const LOGIN_API = 'https://cinjudesco.onrender.com/auth/login';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

interface Props {
  onLogin: (usuario: Usuario) => void;
}

export function LoginSection({ onLogin }: Props) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo.trim() || !contrasena.trim()) {
      toast.error('Ingresa correo y contraseña');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(LOGIN_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correo.trim(), password: contrasena.trim() }),
      });

      if (res.status === 401 || res.status === 403) {
        toast.error('Correo o contraseña incorrectos');
        return;
      }
      if (!res.ok) throw new Error();

      const data: Usuario = await res.json();
      toast.success(`Bienvenido, ${data.nombre ?? data.correo}`);
      onLogin(data);
    } catch {
      toast.error('No se pudo conectar al servidor. Verifica que el backend esté activo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / título */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-5 ring-2 ring-white/20">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">CINJUDESCO</h1>
          <p className="text-blue-200 mt-2 text-sm">Sistema de gestión cultural</p>
        </div>

        {/* Card del formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Iniciar sesión</h2>
          <p className="text-gray-400 text-sm mb-7">Ingresa con tu cuenta autorizada</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextField
              fullWidth
              label="Correo"
              variant="outlined"
              autoComplete="email"
              autoFocus
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={cargando}
            />

            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type={mostrarPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              disabled={cargando}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setMostrarPassword((v) => !v)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {mostrarPassword
                        ? <EyeOff className="w-4 h-4 text-gray-400" />
                        : <Eye className="w-4 h-4 text-gray-400" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={cargando}
              startIcon={cargando
                ? <CircularProgress size={18} color="inherit" />
                : <LogIn className="w-5 h-5" />}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 600 }}
            >
              {cargando ? 'Verificando...' : 'Ingresar'}
            </Button>
          </form>

          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">O</span>
              </div>
            </div>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => onLogin({ id: 0, nombre: 'Invitado', correo: '' })}
              disabled={cargando}
              sx={{ mt: 3, py: 1.5, borderRadius: 2, fontWeight: 600, borderColor: '#d1d5db', color: '#6b7280' }}
            >
              Continuar como Invitado
            </Button>
          </div>

          <p className="text-center text-xs text-gray-300 mt-8">
            Solo usuarios autorizados pueden acceder al sistema completo
          </p>
        </div>
      </div>
    </div>
  );
}
