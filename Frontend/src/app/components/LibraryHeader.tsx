import { useState } from 'react';
import { BookOpen, Search, User, Menu, X } from 'lucide-react';
import { IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

interface LibraryHeaderProps {
  seccionActiva: 'biblioteca' | 'clases' | 'registro';
  onSeccionChange: (seccion: 'biblioteca' | 'clases' | 'registro') => void;
}

export function LibraryHeader({ seccionActiva, onSeccionChange }: LibraryHeaderProps) {
  const esSINJUDESCO = seccionActiva === 'clases' || seccionActiva === 'registro';
  const [menuAbierto, setMenuAbierto] = useState(false);

  const menuOpciones = [
    { id: 'biblioteca' as const, label: 'Catálogo' },
    { id: 'clases' as const, label: 'Clases' },
    { id: 'registro' as const, label: 'Registro' },
  ];

  const handleMenuClick = (seccion: 'biblioteca' | 'clases' | 'registro') => {
    onSeccionChange(seccion);
    setMenuAbierto(false);
  };

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

          {/* Menú desktop */}
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
            <IconButton className="md:hidden" onClick={() => setMenuAbierto(true)}>
              <Menu className="w-5 h-5" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <Drawer
        anchor="right"
        open={menuAbierto}
        onClose={() => setMenuAbierto(false)}
      >
        <div className="w-64">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-lg">Menú</h2>
            <IconButton onClick={() => setMenuAbierto(false)}>
              <X className="w-5 h-5" />
            </IconButton>
          </div>
          <List>
            {menuOpciones.map((opcion) => (
              <ListItem key={opcion.id} disablePadding>
                <ListItemButton
                  selected={seccionActiva === opcion.id}
                  onClick={() => handleMenuClick(opcion.id)}
                >
                  <ListItemText primary={opcion.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </header>
  );
}
