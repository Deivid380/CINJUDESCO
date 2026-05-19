import { BookOpen, Search, User, Menu } from 'lucide-react';
import { IconButton } from '@mui/material';

interface LibraryHeaderProps {
  seccionActiva: 'biblioteca' | 'clases' | 'registro';
  onSeccionChange: (seccion: 'biblioteca' | 'clases' | 'registro') => void;
}

export function LibraryHeader({ seccionActiva, onSeccionChange }: LibraryHeaderProps) {
  const esSINJUDESCO = seccionActiva === 'clases' || seccionActiva === 'registro';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {esSINJUDESCO ? 'SINJUDESCO' : 'Biblioteca Comunitaria Manuela Beltrán'}
              </h1>
              <p className="text-xs text-gray-500">Fundación centrada en la cultura y el conocimiento</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onSeccionChange('biblioteca')}
              className={`${seccionActiva === 'biblioteca' ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:text-blue-600 transition`}
            >
              Catálogo
            </button>
            <button
              onClick={() => onSeccionChange('clases')}
              className={`${seccionActiva === 'clases' ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:text-blue-600 transition`}
            >
              Clases
            </button>
            <button
              onClick={() => onSeccionChange('registro')}
              className={`${seccionActiva === 'registro' ? 'text-blue-600 font-semibold' : 'text-gray-700'} hover:text-blue-600 transition`}
            >
              Registro
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <IconButton>
              <Search className="w-5 h-5" />
            </IconButton>
            <IconButton>
              <User className="w-5 h-5" />
            </IconButton>
            <IconButton className="md:hidden">
              <Menu className="w-5 h-5" />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  );
}
