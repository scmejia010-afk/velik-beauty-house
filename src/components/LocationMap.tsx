import { MapPin, Instagram } from "lucide-react"

export function LocationMap() {
  return (
    <section id="location" className="py-24 bg-white border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Info Side */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
              Visítanos & <br />
              <span className="italic font-light text-gray-400">Conéctate.</span>
            </h2>
            <p className="text-gray-500 font-medium">
              Ven y vive la experiencia en nuestro espacio exclusivo en Laureles. Síguenos en redes sociales para inspirarte con nuestros últimos trabajos.
            </p>
            
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Nuestra Ubicación</h3>
                  <p className="text-gray-500 text-sm">Dg 75 #74-05, Laureles – Estadio<br/>Medellín, Antioquia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Instagram</h3>
                  <a 
                    href="https://www.instagram.com/velikbeautyhouse" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 text-sm hover:text-black transition-colors"
                  >
                    @velikbeautyhouse
                  </a>
                </div>
              </div>
            </div>

            <a 
              href="https://www.instagram.com/velikbeautyhouse" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all mt-4"
            >
              <Instagram className="w-4 h-4" /> Seguir en Instagram
            </a>
          </div>

          {/* Map Side */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-[40px] overflow-hidden border-8 border-gray-50 shadow-2xl">
            <iframe 
              src="https://www.google.com/maps?q=Velik+Beauty+House+Medellin+Dg+75+74-05&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
