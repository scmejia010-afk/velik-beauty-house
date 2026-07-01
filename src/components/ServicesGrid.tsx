import { ArrowUpRight } from "lucide-react"

const phoneNumber = "573016370099";

const services = [
  {
    title: "Uñas que duran 4 semanas 💅",
    price: "Desde $35.000",
    desc: "Manicure ruso, semipermanente, acrílico y baby boomer. Cutícula limpia, color al borde, cero levantamientos.",
    video: "/fotos/spadeuñas.MOV",
    wame: `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hola, quiero agendar una cita para Spa de Uñas.")}`,
  },
  {
    title: "Adiós al frizz, sin formol ✨",
    price: "Desde $45.000",
    desc: "Alisados naturales de coco y argán, color, cortes y tratamientos que sí reparan. Valoración de cabello gratis al agendar.",
    video: "/fotos/pelovideo.MOV",
    wame: `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hola, quiero agendar una cita para Peluquería.")}`,
  },
  {
    title: "Mirada despierta en 40 min 👁️",
    price: "Desde $20.000",
    desc: "Laminado de cejas, lifting de pestañas, extensiones pelo a pelo y depilación con hilo.",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=600&fit=crop",
    wame: `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hola, quiero agendar una cita para Cejas y Pestañas.")}`,
  },
  {
    title: "Reset Completo 🌿",
    price: "Desde $100.000",
    desc: "Limpieza facial profunda, masajes con piedras volcánicas y tratamiento de estrías.",
    video: "/fotos/masaje.mp4",
    wame: `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hola, quiero agendar una cita para Masajes o Faciales.")}`,
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Tú eliges, nosotras te mimamos</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Nuestros <br />
            <span className="italic font-light text-gray-400">Servicios.</span>
          </h2>
        </div>
        <p className="text-gray-500 max-w-sm font-medium text-lg leading-snug">
          Servicios pensados para que salgas sintiéndote otra — no solo viéndote otra.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-10">
        {services.map((service, i) => (
          <div
            key={service.title}
            className="group relative flex flex-col"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[40px] relative">
              {service.video ? (
                <video
                  src={service.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover grayscale-0 md:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              ) : (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale-0 md:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              {/* Floating Price */}
              <div className="absolute top-6 right-6 bg-white rounded-full px-4 py-2 shadow-xl">
                <span className="text-sm font-bold text-black">{service.price}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3 px-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2 leading-tight">{service.title}</h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6">{service.desc}</p>
              </div>
              <a 
                href={service.wame}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-6 py-4 rounded-full border-2 border-brand-light hover:border-black hover:bg-black hover:text-white transition-all duration-300 group/btn"
              >
                <span className="font-bold text-xs uppercase tracking-widest">Agendar por WhatsApp</span>
                <ArrowUpRight className="w-5 h-5 opacity-50 group-hover/btn:opacity-100" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <a
          href="/agendar"
          className="inline-block px-10 py-5 rounded-full bg-black text-white text-sm uppercase tracking-[0.2em] font-black hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Reservar Cita →
        </a>
      </div>
    </section>
  )
}
