import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    q: "¿Cuánto dura el semipermanente?",
    a: "Nuestros esmaltados semipermanentes duran entre 3 y 4 semanas con el cuidado adecuado. Te recomendamos aplicar aceite de cutículas a diario para prolongar la duración y mantener la salud de tu uña.",
  },
  {
    q: "¿Qué es el Russian Manicure o Manicure con e-file?",
    a: "Es una técnica especializada que utiliza una fresa eléctrica para limpiar y retirar el exceso de piel alrededor del borde de la uña. Permite aplicar el color más cerca de la cutícula, logrando un acabado más limpio y una duración de hasta 4 semanas.",
  },
  {
    q: "¿El precio de las uñas es por uña o por el servicio completo?",
    a: "Todos nuestros precios corresponden al servicio completo de mano o pie 💖 Nunca cobramos por uña individual, excepto en reparaciones sueltas ($10.000 c/u).",
  },
  {
    q: "¿Cómo funciona la valoración de cabello?",
    a: "La valoración tiene un valor de $30.000 y es necesaria para servicios como color, alisados o tratamientos especiales. Nuestra especialista evalúa tu cabello, te asesora y define el precio exacto. Si decides hacer el servicio con nosotras, ese valor se descuenta del precio final 🌸",
  },
  {
    q: "¿Cómo agendo mi cita?",
    a: "Puedes agendar directamente en nuestro portal en línea: velik.site.agendapro.com — Allí eliges la fecha, la hora y la profesional de tu preferencia. También puedes escribirnos por WhatsApp y con muchísimo gusto te ayudamos.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-gray-400">Preguntas Frecuentes</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">¿Dudas?</h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border-2 rounded-[32px] overflow-hidden transition-all duration-500 ${
                openIndex === i ? "border-black bg-zinc-50" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-8 text-left"
              >
                <span className="text-xl font-bold uppercase tracking-tight pr-4">{faq.q}</span>
                <div className={`flex-shrink-0 transition-transform duration-500 ${openIndex === i ? "rotate-180" : "rotate-0"}`}>
                  {openIndex === i ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out ${
                  openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-8 pb-8 text-gray-500 font-medium leading-relaxed max-w-2xl">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-black text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-xl font-bold uppercase tracking-tight">¿Más preguntas?</p>
          <a
            href="https://www.instagram.com/velikbeautyhouse"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            Escríbenos en Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
