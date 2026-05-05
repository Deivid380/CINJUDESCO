import { BookOpen, Sparkles, Heart, Rocket, Brain, Globe } from 'lucide-react';

const categories = [
  { name: 'Ficción', icon: Sparkles, color: 'bg-purple-100 text-purple-600', count: 12450 },
  { name: 'Romance', icon: Heart, color: 'bg-pink-100 text-pink-600', count: 5320 },
  { name: 'Ciencia Ficción', icon: Rocket, color: 'bg-blue-100 text-blue-600', count: 3890 },
  { name: 'Educación', icon: Brain, color: 'bg-green-100 text-green-600', count: 8760 },
  { name: 'Historia', icon: Globe, color: 'bg-amber-100 text-amber-600', count: 4210 },
  { name: 'General', icon: BookOpen, color: 'bg-gray-100 text-gray-600', count: 15340 },
];

export function CategoriesSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Explora por categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className={`${category.color} rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
              >
                <Icon className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm opacity-75">{category.count.toLocaleString()} libros</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
