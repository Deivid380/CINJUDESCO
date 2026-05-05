import { Search } from 'lucide-react';
import { TextField, Button } from '@mui/material';

export function SearchSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">Busca en nuestro catálogo</h2>
        <p className="text-lg mb-8 text-blue-100">Más de 50,000 libros disponibles para ti</p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <TextField
            fullWidth
            placeholder="Buscar por título, autor, ISBN..."
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
          />
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: '#2563eb',
              '&:hover': {
                backgroundColor: '#f3f4f6',
              },
              minWidth: '120px',
            }}
            startIcon={<Search className="w-5 h-5" />}
          >
            Buscar
          </Button>
        </div>
      </div>
    </section>
  );
}
