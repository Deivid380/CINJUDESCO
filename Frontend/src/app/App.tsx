import { useState } from 'react';
import { Toaster } from 'sonner';
import { LibraryHeader } from './components/LibraryHeader';
import { SearchSection } from './components/SearchSection';
import { CategoriesSection } from './components/CategoriesSection';
import { CatalogSection } from './components/CatalogSection';
import { AdminPanel } from './components/AdminPanel';
import { ClasesSection } from './components/ClasesSection';
import { RegistroSection } from './components/RegistroSection';
import { LibraryFooter } from './components/LibraryFooter';
import { LoginSection, Usuario } from './components/LoginSection';
import { Button, Tooltip } from '@mui/material';
import { ShieldCheck, BookOpen, LogOut } from 'lucide-react';
import { toast } from 'sonner';

type Seccion = 'biblioteca' | 'clases' | 'registro';

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<Seccion>('biblioteca');

  const handleLogin = (u: Usuario) => setUsuario(u);

  const handleLogout = () => {
    setUsuario(null);
    setModoAdmin(false);
    setSeccionActiva('biblioteca');
    toast.info('Sesión cerrada');
  };

  if (!usuario) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LoginSection onLogin={handleLogin} />
      </>
    );
  }

  const renderContenido = () => {
    if (modoAdmin && seccionActiva === 'biblioteca') return <AdminPanel />;
    switch (seccionActiva) {
      case 'biblioteca':
        return (
          <>
            <SearchSection />
            <CategoriesSection />
            <CatalogSection />
          </>
        );
      case 'clases':
        return <ClasesSection />;
      case 'registro':
        return <RegistroSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      <LibraryHeader
        seccionActiva={seccionActiva}
        onSeccionChange={setSeccionActiva}
      />

      {/* Barra de herramientas */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {seccionActiva === 'biblioteca' && (
              <Button
                variant={modoAdmin ? 'contained' : 'outlined'}
                startIcon={modoAdmin ? <ShieldCheck className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                onClick={() => setModoAdmin(!modoAdmin)}
                size="small"
              >
                {modoAdmin ? 'Modo Administrador' : 'Cambiar a Admin'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Hola, <strong className="text-gray-700">{usuario.nombre ?? usuario.correo}</strong>
            </span>
            <Tooltip title="Cerrar sesión">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
              >
                Salir
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <main>{renderContenido()}</main>

      <LibraryFooter seccionActiva={seccionActiva} />
    </div>
  );
}