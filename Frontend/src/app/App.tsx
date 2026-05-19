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
import { Button } from '@mui/material';
import { ShieldCheck, BookOpen } from 'lucide-react';

type Seccion = 'biblioteca' | 'clases' | 'registro';

export default function App() {
  const [modoAdmin, setModoAdmin] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<Seccion>('biblioteca');

  const renderContenido = () => {
    if (modoAdmin && seccionActiva === 'biblioteca') {
      return <AdminPanel />;
    }

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

      {/* Botón para cambiar entre modo usuario y admin (solo en biblioteca) */}
      {seccionActiva === 'biblioteca' && (
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Button
              variant={modoAdmin ? 'contained' : 'outlined'}
              startIcon={modoAdmin ? <ShieldCheck className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              onClick={() => setModoAdmin(!modoAdmin)}
              size="small"
            >
              {modoAdmin ? 'Modo Administrador' : 'Cambiar a Admin'}
            </Button>
          </div>
        </div>
      )}

      <main>
        {renderContenido()}
      </main>

      <LibraryFooter />
    </div>
  );
}