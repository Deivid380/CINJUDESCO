import { useState } from 'react';
import {
    TextField,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment
} from '@mui/material';

import {
    Eye,
    EyeOff,
    LogIn,
    BookOpen
} from 'lucide-react';

import { toast } from 'sonner';

const LOGIN_API = 'https://cinjudesco.onrender.com/usuarios/login';

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

            console.log({
                correo: correo.trim(),
                contrasena: contrasena.trim(),
            });

            const res = await fetch(LOGIN_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    correo: correo.trim(),
                    contrasena: contrasena.trim(),
                }),
            });

            console.log("STATUS:", res.status);

            const text = await res.text();

            console.log("RESPUESTA:", text);

            if (res.status === 401 || res.status === 403) {
                toast.error('Correo o contraseña incorrectos');
                return;
            }

            if (!res.ok) {
                toast.error('Error del servidor');
                return;
            }

            const data: Usuario = JSON.parse(text);

            console.log("USUARIO LOGUEADO:", data);

            toast.success(`Bienvenido, ${data.nombre}`);

            onLogin(data);

        } catch (error) {

            console.error("ERROR LOGIN:", error);

            toast.error('No se pudo conectar al servidor.');

        } finally {

            setCargando(false);

        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-10">

                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-5 ring-2 ring-white/20">
                        <BookOpen className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        CINJUDESCO
                    </h1>

                    <p className="text-blue-200 mt-2 text-sm">
                        Sistema de gestión cultural
                    </p>

                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        Iniciar sesión
                    </h2>

                    <p className="text-gray-400 text-sm mb-7">
                        Ingresa con tu cuenta autorizada
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Correo */}
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

                        {/* Password */}
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

                                            {
                                                mostrarPassword
                                                    ? <EyeOff className="w-4 h-4 text-gray-400" />
                                                    : <Eye className="w-4 h-4 text-gray-400" />
                                            }

                                        </IconButton>

                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Botón */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={cargando}
                            startIcon={
                                cargando
                                    ? <CircularProgress size={18} color="inherit" />
                                    : <LogIn className="w-5 h-5" />
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600
                            }}
                        >

                            {
                                cargando
                                    ? 'Verificando...'
                                    : 'Ingresar'
                            }

                        </Button>

                    </form>

                    <p className="text-center text-xs text-gray-300 mt-8">
                        Solo usuarios autorizados pueden acceder al sistema
                    </p>

                </div>
            </div>
        </div>
    );
}