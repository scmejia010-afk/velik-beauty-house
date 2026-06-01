import { Star, MessageSquareQuote } from "lucide-react"

const reviews = [
  {
    name: "Yegnive Valero",
    text: "En Velik encontrarás belleza, muy buena atención y Laura realiza unas uñitas espectaculares a mi me fascinaron y por lo general conozco muchos lugares pero acá me quedo! Luz Ramírez te atiende con los brazos abiertos y súper responsable !",
    rating: 5,
    date: "Hace 3 semanas"
  },
  {
    name: "Liliana Paola Perez",
    text: "Amé mil! Son muy organizados, la atención es excelente y el ambiente es muy agradable! La manicurista muy pulida y amable, el masaje de los pies fue muy relajante, yo disfruté mucho de mi cita de manos y pies. Los recomiendo!",
    rating: 5,
    date: "Hace 4 meses"
  },
  {
    name: "Nani L",
    text: "Para sentirse como una reina hay que visitar a Velik studios en Medellin. Servicios: Cortes de cabello, Pedicura y Manicura.",
    rating: 5,
    date: "Hace un mes"
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="py-24 lg:py-32 bg-brand-dark text-brand-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-gold font-accent">Lo que dicen de nosotros</p>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-[0.9]">
              Nuestras <br />
              <span className="italic text-brand-gold">Reseñas.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-brand-white/60">
            En Google Maps
            <div className="w-12 h-px bg-brand-light/20" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={review.name}
              className="group relative p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-gold/50 transition-all duration-500 cursor-default"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-gold/10 to-transparent rounded-bl-[48px]" />

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center">
                    <span className="text-xl font-serif text-brand-dark font-bold">{review.name.charAt(0)}</span>
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-brand-gold/40" />
                </div>
                
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-sans leading-relaxed text-brand-white/80">
                    "{review.text}"
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold font-accent">
                    {review.name} <span className="text-brand-white/40 ml-2 normal-case tracking-normal">{review.date}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <a
            href="https://g.page/r/velikbeauty" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 rounded-full bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all font-sans"
          >
            Dejar una reseña →
          </a>
        </div>
      </div>
    </section>
  )
}
