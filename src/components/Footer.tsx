import { MapPin, ExternalLink } from "lucide-react"
import { Instagram } from "@/components/icons/Instagram"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

          {/* Brand */}
          <div className="space-y-8 col-span-1 md:col-span-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Velik.</h2>
            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
              Tu tienda oficial de bienestar integral. Esmaltes, cuidado capilar, faciales, herramientas y más — los mejores productos para ti.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/velikbeautyhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Navegación</h3>
            <ul className="space-y-4">
              {[
                { label: "Productos", href: "#products" },
                { label: "Galería", href: "#gallery" },
                { label: "Membresía", href: "#membership" },
                { label: "Nosotros", href: "#philosophy" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-lg font-bold uppercase tracking-tight hover:italic transition-all text-black hover:text-gray-500"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Visítanos</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Dg 75 #74-05, Laureles – Estadio
                    <br />
                    Medellín, Antioquia
                  </p>
                  <a
                    href="https://maps.app.goo.gl/uFdvEAncrizG88S5A?g_st=iw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black mt-2 transition-colors"
                  >
                    Ver en mapa <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <Instagram className="w-5 h-5 text-gray-400 shrink-0" />
                <a
                  href="https://www.instagram.com/velikbeautyhouse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  @velikbeautyhouse
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            © 2025 Velik Beauty House. Todos los derechos reservados.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
            Hecho con 🌸 en Medellín
          </p>
        </div>
      </div>
    </footer>
  )
}
