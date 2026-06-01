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
          <div className="flex flex-col items-end gap-3 text-right">
            <div className="flex gap-1 text-brand-gold">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              ))}
            </div>
            <div className="flex items-center justify-end gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-brand-white/80">
              5 Estrellas en Google Maps <span className="text-brand-gold">(+50 Reseñas)</span>
              <div className="w-8 md:w-12 h-px bg-brand-gold/50" />
            </div>
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

        <div className="mt-20 text-center">
          <a
            href="https://www.google.com/search?sca_esv=163269b9f9bc3142&rlz=1C1CHZN_enCO1099CO1099&sxsrf=ANbL-n4W1YQ9YFzkb0-02VyqSJ1T5sRKwQ:1780337330129&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOV_-gipb0kxNjnha5gm8YQiGAB4VSkkUUDNMUEo89VQmdl4odMdEPokAJkev8xwbyDfrw2BRctSrx2hFN_AuGS8D5wxfhsN7T6MjSY6Ngm6jg3cZ7A%3D%3D&q=Velik+Beauty+House+Opiniones&sa=X&ved=2ahUKEwiw6JGx0eaUAxU7TTABHYq9Bi4Q0bkNegQIJhAF&biw=1920&bih=889&dpr=1" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-5 rounded-full bg-brand-gold text-brand-dark text-xs font-bold uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all font-sans"
          >
            Ver más reseñas →
          </a>
        </div>
      </div>
    </section>
  )
}
