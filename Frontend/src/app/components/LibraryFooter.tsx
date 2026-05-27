import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

interface LibraryFooterProps {
  seccionActiva: 'biblioteca' | 'clases' | 'registro' | 'prestamos';
}

export function LibraryFooter({ seccionActiva }: LibraryFooterProps) {
  const esCINJUDESCO = seccionActiva === 'clases' || seccionActiva === 'registro' || seccionActiva === 'prestamos';
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <span className="font-semibold text-white">
                {esCINJUDESCO ? 'CINJUDESCO' : 'Biblioteca Comunitaria Manuela Beltrán'}
              </span>
            </div>
            <p className="text-sm">
              Fundación centrada en la cultura. Tu espacio de
              conocimiento y aprendizaje.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">
              Enlaces rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Catálogo
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Novedades
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Eventos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Servicios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">
              Servicios
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Préstamo de libros
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Sala de lectura
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Computadoras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition"
                >
                  Talleres
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Calle Principal 123</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+34 912 345 678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@biblioteca.es</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} {esCINJUDESCO ? 'CINJUDESCO' : 'Biblioteca Comunitaria Manuela Beltrán'}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}