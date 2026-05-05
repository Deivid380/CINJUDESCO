import { useEffect, useState } from 'react';
import {
  BookOpen, Brain, Globe, Sparkles, Heart, Rocket
} from 'lucide-react';
import { obtenerLibros, type Libro } from '../services/api';

// 🎨 iconos por categoría
const iconos: any = {
  Ciencias: Brain,
  Historia: Globe,
  Matemáticas: Brain,
  Lenguaje: BookOpen,
  Filosofía: Brain,
  Literatura: BookOpen,
  Novelas: Sparkles,
  Cuentos: Sparkles,
  Danza: Heart,
  Musica: Heart,
  Artes: Heart,
  'Historia Local': Globe,
  Infantil: Rocket
};

// 🎨 colores
const colores: any = {
  Ciencias: 'bg-blue-100 text-blue-600',
  Historia: 'bg-amber-100 text-amber-600',
  Matemáticas: 'bg-green-100 text-green-600',
  Lenguaje: 'bg-purple-100 text-purple-600',
  Filosofía: 'bg-indigo-100 text-indigo-600',
  Literatura: 'bg-gray-100 text-gray-600',
  Novelas: 'bg-pink-100 text-pink-600',
  Cuentos: 'bg-yellow-100 text-yellow-600',
  Danza: 'bg-red-100 text-red-600',
  Musica: 'bg-orange-100 text-orange-600',
  Artes: 'bg-rose-100 text-rose-600',
  'Historia Local': 'bg-teal-100 text-teal-600',
  Infantil: 'bg-lime-100 text-lime-600'
};

const categoriasBase = [
  'Ciencias',
  'Historia',
  'Matemáticas',
  'Lenguaje',
  'Filosofía',
  'Literatura',
  'Novelas',
  'Cuentos',
  'Danza',
  'Musica',
  'Artes',
  'Historia Local',
  'Infantil'
];

export function CategoriesSection() {

  const [categorias, setCategorias] = useState<any[]>([]);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {

    const libros: Libro[] = await obtenerLibros();

    // 📊 contar libros por categoría
    const conteo: any = {};

    categoriasBase.forEach(cat => {
      conteo[cat] = 0;
    });

    libros.forEach(libro => {
      if (libro.categoria && conteo.hasOwnProperty(libro.categoria)) {
        conteo[libro.categoria]++;
      }
    });

    // 🧱 construir categorías
    const categoriasFinales = categoriasBase.map(cat => ({
      name: cat,
      count: conteo[cat],
      icon: iconos[cat] || BookOpen,
      color: colores[cat] || 'bg-gray-100 text-gray-600'
    }));

    setCategorias(categoriasFinales);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold mb-8 text-center">
          Explora por categoría
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {categorias.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.name}
                className={`${category.color} rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
              >
                <Icon className="w-8 h-8 mx-auto mb-3" />

                <h3 className="font-semibold mb-1">
                  {category.name}
                </h3>

                <p className="text-sm opacity-75">
                  {category.count} libros
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}