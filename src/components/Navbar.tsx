import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const links = [
  { label: "Productos", href: "#products" },
  { label: "Galería", href: "#gallery" },
  { label: "Membresía", href: "#membership" },
  { label: "Nosotros", href: "#philosophy" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="font-black text-2xl tracking-tighter uppercase italic text-white">
          Velik<span className="text-white/30">.</span>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-10">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#products"
          className="hidden md:inline-flex px-7 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          Comprar
        </a>

        {/* Mobile Menu */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/5 px-6 py-8 space-y-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-lg font-bold uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#products"
            onClick={() => setOpen(false)}
            className="block mt-6 px-8 py-4 rounded-full bg-white text-black text-center text-xs font-black uppercase tracking-widest"
          >
            Comprar Ahora
          </a>
        </div>
      )}
    </header>
  )
}
