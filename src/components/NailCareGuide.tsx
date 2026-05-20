import { BookOpen, Sparkles, Droplets } from "lucide-react"

const guides = [
  {
    title: "¿Cómo duran más mis uñas?",
    time: "5 min lectura",
    category: "Mantenimiento",
    icon: Sparkles,
  },
  {
    title: "La importancia del cuidado de cutículas",
    time: "8 min lectura",
    category: "Salud Capilar",
    icon: Droplets,
  },
  {
    title: "¿Cuál forma de uña va con mi mano?",
    time: "4 min lectura",
    category: "Guía de Estilo",
    icon: BookOpen,
  },
]

export function NailCareGuide() {
  return (
    <section id="guides" className="py-24 lg:py-32 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500">Blog de Velik</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              Consejos <br />
              <span className="italic font-light text-zinc-700">de Belleza.</span>
            </h2>
          </div>
          <a
            href="https://www.instagram.com/velikbeautyhouse"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors"
          >
            Ver en Instagram
            <div className="w-12 h-px bg-zinc-800 group-hover:w-20 group-hover:bg-white transition-all" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide, i) => (
            <div
              key={guide.title}
              className="group relative p-10 rounded-[48px] bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-500 cursor-pointer overflow-hidden"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full" />

              <div className="space-y-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                  <guide.icon className="w-6 h-6 text-zinc-400 group-hover:text-black" />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{guide.category}</p>
                  <h3 className="text-2xl font-bold uppercase tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all">
                    {guide.title}
                  </h3>
                </div>

                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{guide.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <a
            href="https://velik.site.agendapro.com/co/sucursal/297109"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all"
          >
            Agendar mi cita →
          </a>
        </div>
      </div>
    </section>
  )
}
