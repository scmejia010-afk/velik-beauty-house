import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const galleryItems = [
  {
    title: "Diseño Minimalista",
    artist: "Especialista Velik",
    label: "Tendencia",
    image: "https://images.unsplash.com/photo-1604654894610-df490998570e?w=800&h=1000&fit=crop",
  },
  {
    title: "Arte Abstracto",
    artist: "Especialista Velik",
    label: "Nuevo Diseño",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=1000&fit=crop",
  },
  {
    title: "Baby Boomer",
    artist: "Especialista Velik",
    label: "Clásico Velik",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&h=1000&fit=crop",
  },
  {
    title: "Press On Elaborado",
    artist: "Especialista Velik",
    label: "Edición Limitada",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&h=1000&fit=crop",
  },
]

function GalleryCard({ item }: { item: typeof galleryItems[0] }) {
  return (
    <div className="relative h-[32rem] sm:h-[45rem] rounded-[48px] overflow-hidden group cursor-pointer border border-gray-100 shadow-2xl">
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

      <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <span className="inline-block text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">
          {item.label}
        </span>
        <div>
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">{item.title}</h3>
          <p className="text-white/60 font-medium tracking-widest uppercase text-[10px] mt-1">{item.artist}</p>
        </div>
        <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <a
            href="https://velik.site.agendapro.com/co/sucursal/297109"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            Reservar este diseño
          </a>
        </div>
      </div>
    </div>
  )
}

export function GalleryCarousel() {
  const [current, setCurrent] = useState(0)
  const total = galleryItems.length - 1

  const prev = () => setCurrent((c) => (c === 0 ? total : c - 1))
  const next = () => setCurrent((c) => (c === total ? 0 : c + 1))

  return (
    <section id="gallery" className="bg-white py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Nuestro Trabajo</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              Diseños <br />
              <span className="italic font-light text-gray-300">Recientes.</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/velikbeautyhouse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-b border-gray-200 hover:border-black pb-1"
            >
              Ver más en Instagram →
            </a>
            <div className="flex gap-4">
              <button
                onClick={prev}
                className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 active:scale-90"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 active:scale-90"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ transform: `translateX(-${current * 60}%)` }}
          >
            {galleryItems.map((item, i) => (
              <div key={i} className="min-w-[85%] md:min-w-[45%] lg:min-w-[40%]">
                <GalleryCard item={item} />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-16 h-1 bg-gray-100 rounded-full max-w-sm mx-auto overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-700"
              style={{ width: `${((current + 1) / (total + 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
