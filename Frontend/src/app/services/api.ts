import axios from 'axios';

// Configurar la URL base de tu API Spring Boot
const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 segundos timeout
});

// Modo de desarrollo: detectar si el backend está disponible
let backendDisponible = true;

// Datos de ejemplo para modo sin backend
const librosEjemplo: Libro[] = [
  {
    isbn: '978-958-42-0076-1',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    resumen: 'La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.',
    categoria: 'Ficción',
    disponible: true,
    ubicacion: 'Estante A1, Nivel 2',
    portadaUrl: '',
  },
  {
    isbn: '978-84-376-0494-7',
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    resumen: 'Las aventuras de un hidalgo que pierde la razón y decide hacerse caballero andante.',
    categoria: 'Clásicos',
    disponible: false,
    ubicacion: 'Estante B3, Nivel 1',
    portadaUrl: '',
  },
  {
    isbn: '978-84-08-04649-5',
    titulo: 'La sombra del viento',
    autor: 'Carlos Ruiz Zafón',
    resumen: 'Un misterio ambientado en la Barcelona de la posguerra sobre libros olvidados.',
    categoria: 'Misterio',
    disponible: true,
    ubicacion: 'Estante C2, Nivel 1',
    portadaUrl: '',
  },
  {
    isbn: '978-950-07-2778-9',
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    resumen: 'Una novela experimental que puede ser leída en diferentes órdenes.',
    categoria: 'Ficción',
    disponible: true,
    ubicacion: 'Estante A2, Nivel 3',
    portadaUrl: '',
  },
];

export interface Libro {
  isbn: string;
  titulo: string;
  autor: string;
  resumen?: string;
  categoria?: string;
  disponible: boolean;
  ubicacion?: string;
  portadaUrl?: string;
}

// 📚 Obtener todos los libros
export const obtenerLibros = async (): Promise<Libro[]> => {
  try {
    const response = await api.get('/libros');
    backendDisponible = true;
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend no disponible, usando datos de ejemplo');
    backendDisponible = false;
    return librosEjemplo;
  }
};

// ➕ Crear libro nuevo
export const crearLibro = async (libro: Libro): Promise<Libro> => {
  if (!backendDisponible) {
    // Simular creación en modo sin backend
    librosEjemplo.push(libro);
    return libro;
  }
  const response = await api.post('/libros', libro);
  return response.data;
};

// 📖 Prestar libro
export const prestarLibro = async (isbn: string): Promise<Libro> => {
  if (!backendDisponible) {
    const libro = librosEjemplo.find(l => l.isbn === isbn);
    if (libro) {
      libro.disponible = false;
      return libro;
    }
    throw new Error('Libro no encontrado');
  }
  const response = await api.put(`/libros/${isbn}/prestar`);
  return response.data;
};

// 📚 Devolver libro
export const devolverLibro = async (isbn: string): Promise<Libro> => {
  if (!backendDisponible) {
    const libro = librosEjemplo.find(l => l.isbn === isbn);
    if (libro) {
      libro.disponible = true;
      return libro;
    }
    throw new Error('Libro no encontrado');
  }
  const response = await api.put(`/libros/${isbn}/devolver`);
  return response.data;
};

// ❌ Eliminar libro
export const eliminarLibro = async (isbn: string): Promise<void> => {
  if (!backendDisponible) {
    const index = librosEjemplo.findIndex(l => l.isbn === isbn);
    if (index > -1) {
      librosEjemplo.splice(index, 1);
    }
    return;
  }
  await api.delete(`/libros/${isbn}`);
};

// Verificar conexión con el backend
export const verificarBackend = async (): Promise<boolean> => {
  try {
    await api.get('/libros');
    return true;
  } catch (error) {
    return false;
  }
};

export default api;
