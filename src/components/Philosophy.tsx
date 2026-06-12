import { Check, X } from "lucide-react"
import { useState } from "react"

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
          <div className="lg:col-span-5 relative flex gap-3 sm:gap-4 items-center mt-12 lg:mt-0">
            {/* Image 1: Carolina */}
            <div 
              className="w-1/4 aspect-[4/6] rounded-[20px] sm:rounded-[30px] overflow-hidden border-2 sm:border-4 border-white shadow-xl relative -rotate-12 hover:rotate-0 translate-y-4 hover:translate-y-0 transition-transform duration-700 cursor-pointer"
              onClick={() => setSelectedImage("/fotos/carolina.jpg")}
            >
              <img src="/fotos/carolina.jpg" alt="Carolina Paz" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/5" />
            </div>
            
            {/* Image 2: Laura */}
            <div 
              className="w-1/4 aspect-[4/6] rounded-[20px] sm:rounded-[30px] overflow-hidden border-2 sm:border-4 border-white shadow-xl relative -translate-y-6 -rotate-3 hover:rotate-0 hover:-translate-y-10 transition-transform duration-700 z-10 cursor-pointer"
              onClick={() => setSelectedImage("/fotos/laura.jpg")}
            >
              <img src="/fotos/laura.jpg" alt="Laura Vanessa" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Image 3: Luz */}
            <div 
              className="w-1/4 aspect-[4/6] rounded-[20px] sm:rounded-[30px] overflow-hidden border-2 sm:border-4 border-white shadow-xl relative -translate-y-6 rotate-3 hover:rotate-0 hover:-translate-y-10 transition-transform duration-700 z-10 cursor-pointer"
              onClick={() => setSelectedImage("/fotos/luz.jpg")}
            >
              <img src="/fotos/luz.jpg" alt="Luz Aida" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Image 4: Geraldin */}
            <div 
              className="w-1/4 aspect-[4/6] rounded-[20px] sm:rounded-[30px] overflow-hidden border-2 sm:border-4 border-white shadow-xl relative rotate-12 hover:rotate-0 translate-y-4 hover:translate-y-0 transition-transform duration-700 cursor-pointer"
              onClick={() => setSelectedImage("/fotos/geraldin.jpg")}
            >
              <img src="/fotos/geraldin.jpg" alt="Geraldin Rendon" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* Floating Detail */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-black text-white p-5 sm:p-6 rounded-[25px] sm:rounded-[30px] shadow-2xl animate-float z-20 w-max text-center">
              <p className="text-lg sm:text-2xl font-black tracking-tighter italic mb-1">Nuestro Equipo</p>
              <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Artistas Especializadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer animate-fade-in backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Profesional" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
