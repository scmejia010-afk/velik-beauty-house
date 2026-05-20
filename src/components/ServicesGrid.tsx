import { ArrowUpRight } from "lucide-react"

const services = [
  {
    title: "Spa de Uñas",
    price: "Desde $35.000",
    desc: "Semipermanente, acrílico, polygel, press on, baby boomer y más. Arte y precisión en cada detalle.",
    image: "https://images.unsplash.com/photo-1604654894610-df490998570e?w=600&h=600&fit=crop",
  },
  {
    title: "Peluquería",
    price: "Desde $45.000",
    desc: "Alisados naturales de coco y argán, tinturas, cortes, cepillados y tratamientos capilares premium.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop",
  },
  {
    title: "Cejas & Pestañas",
    price: "Desde $20.000",
    desc: "Laminado de cejas, lifting de pestañas, extensiones pelo a pelo y depilación con hilo o cera.",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=600&fit=crop",
  },
  {
    title: "Faciales & Corporales",
    price: "Desde $100.000",
    desc: "Limpiezas faciales, masajes relajantes, piedras volcánicas, tratamiento de estrías y más.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop",
  },
  {
    title: "Maquillaje",
    price: "Desde $170.000",
    desc: "Maquillaje social, blindado y artístico aplicado por profesionales con productos de alta gama.",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=600&fit=crop",
  },
  {
    title: "Depilación",
    price: "Desde $20.000",
    desc: "Depilación con hilo, cera y técnicas especiales para rostro, cuerpo y zonas íntimas.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop",
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Todo en un lugar</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Nuestros <br />
            <span className="italic font-light text-gray-400">Servicios.</span>
          </h2>
        </div>
        <p className="text-gray-500 max-w-xs font-medium">
          Atención profesional, productos premium y un espacio diseñado para consentirte.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, i) => (
          <div
            key={service.title}
            className="group relative flex flex-col"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[40px] relative">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              {/* Floating Price */}
              <div className="absolute top-6 right-6 bg-white rounded-full px-4 py-2 shadow-xl">
                <span className="text-sm font-bold text-black">{service.price}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3 px-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold uppercase tracking-tight">{service.title}</h3>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <a
          href="https://velik.site.agendapro.com/co/sucursal/297109"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-5 rounded-full bg-black text-white text-sm uppercase tracking-[0.2em] font-black hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Reservar Cita →
        </a>
      </div>
    </section>
  )
}
