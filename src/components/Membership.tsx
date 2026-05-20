export function Membership() {
  return (
    <section id="membership" className="bg-black text-white py-24 lg:py-32 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#84a9fa] blur-[150px] opacity-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fb6fec] blur-[150px] opacity-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-500">The Beauty Club</p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                Promos <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84a9fa] via-[#fb6fec] to-[#fba69e]">Activas.</span>
              </h2>
              <p className="text-gray-500 font-medium max-w-md leading-relaxed">
                Tenemos experiencias especiales diseñadas para que saques el mayor provecho de tu visita a Velik.
              </p>
            </div>

            <div className="grid gap-8">
              {[
                {
                  title: "Uñas + Masaje Especial 💅💆‍♀️",
                  desc: "Toma tu diseño de uñas con sistema y desbloquea acceso a masaje relajante con 20% descuento. Solo para las primeras 10 clientas del mes.",
                },
                {
                  title: "Renueva tu Color + Make Over 💇‍♀️💅",
                  desc: "Servicio de coloración con diagnóstico, bebida de cortesía ☕ y make over básico de uñas incluido.",
                },
                {
                  title: "Color + Masaje Relajante 💆‍♀️",
                  desc: "Renueva tu color y desestréate. Incluye masaje relajante para que salgas renovada por fuera y por dentro.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-6 group border-b border-zinc-800 pb-8 last:border-0">
                  <div className="space-y-1">
                    <p className="text-lg font-bold uppercase tracking-tight">{title}</p>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <a
                href="https://velik.site.agendapro.com/co/sucursal/297109"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Reservar Ahora
              </a>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden border border-zinc-800 shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&h=1000&fit=crop"
                alt="Velik Beauty Experience"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

              {/* Floating Stat */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-[32px] p-8 shadow-2xl text-black">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Cupos limitados</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black tracking-tighter italic">10</p>
                  <p className="text-sm font-bold text-gray-400">/ mes</p>
                </div>
              </div>
            </div>

            {/* Geometric accents */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border border-zinc-800 rounded-full opacity-20" />
            <div className="absolute top-1/2 -right-20 w-60 h-60 border border-zinc-800 rounded-full opacity-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
