import { BookOpen, Search, User, Menu } from 'lucide-react';
import { IconButton } from '@mui/material';

export function LibraryHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Biblioteca Comunuraria Manuela Beltran</h1>
              <p className="text-xs text-gray-500">Fundación centrada en la cultura y el Conocimineto</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#catalogo" className="text-gray-700 hover:text-blue-600 transition">Catálogo</a>
            <a href="#novedades" className="text-gray-700 hover:text-blue-600 transition">Novedades</a>
            <a href="#eventos" className="text-gray-700 hover:text-blue-600 transition">Eventos</a>
            <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition">Servicios</a>
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
