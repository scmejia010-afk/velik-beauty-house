import { Check } from "lucide-react"

const pillars = [
  {
    title: "Productos Premium & Seguros",
    desc: "Trabajamos exclusivamente con marcas reconocidas, fórmulas veganas y libres de componentes agresivos para proteger tu salud.",
  },
  {
    title: "Artistas Especializadas",
    desc: "Nuestras profesionales están en formación y actualización constante para ofrecerte las últimas tendencias con la mayor precisión.",
  },
  {
    title: "Un Espacio para Ti",
    desc: "Cada detalle del espacio está pensado para que te sientas tranquila, cómoda y completamente consentida desde que llegas.",
  },
]

export function Philosophy() {
  return (
    <section id="philosophy" className="py-24 lg:py-32 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Nuestra Filosofía</p>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-black">
                Belleza que <br />
                <span className="italic font-light text-gray-400">Cuida.</span>
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
                En Velik creemos que la belleza no tiene que comprometer tu salud. Combinamos las mejores técnicas con productos seguros y un ambiente que te hace sentir en casa.
              </p>
            </div>

            <div className="grid gap-10">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="space-y-2 border-b border-gray-200 pb-8 w-full group-last:border-0">
                    <h3 className="text-xl font-bold uppercase tracking-tight">{pillar.title}</h3>
                    <p className="text-gray-500 leading-relaxed max-w-xl">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/6] rounded-[100px] overflow-hidden border-8 border-white shadow-2xl relative rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1629190785520-ff3d112922ce?w=800&h=1200&fit=crop"
                alt="Velik Beauty House"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Floating Detail */}
            <div className="absolute -bottom-10 -left-10 bg-black text-white p-10 rounded-[40px] shadow-2xl max-w-xs animate-float">
              <p className="text-3xl font-black tracking-tighter italic mb-2">Laureles</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Dg 75 #74-05, Medellín</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
