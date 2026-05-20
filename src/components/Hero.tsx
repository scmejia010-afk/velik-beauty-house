import { useState, useEffect } from "react"
import MuxPlayer from '@mux/mux-player-react'

// ======================================================
// HERO VIDEO — El video ahora se carga desde Mux
// Playback ID de Mux: E3rAKyTB54G02a702jKVDAsRnWoRXwUss6mjjctaODp8w
// ======================================================
const PLAYBACK_ID = "E3rAKyTB54G02a702jKVDAsRnWoRXwUss6mjjctaODp8w"

const marqueeWords = [
  "Esmaltes", "Aceite de Cutículas", "Cremas Faciales", "Keratina", "Shampoo",
  "Mascarillas", "Serums", "Limpiadores", "Pinceles", "Acrílico",
  "Kits de Spa", "Herramientas", "Belleza", "Cuidado en Casa", "Velik",
]

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0">
        {mounted && PLAYBACK_ID ? (
          <MuxPlayer
            playbackId={PLAYBACK_ID}
            autoPlay="muted"
            loop
            muted
            playsInline
            streamType="on-demand"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        ) : (
          /* Placeholder mientras carga el video */
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <div className="text-center space-y-4 opacity-20">
              <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white text-xs uppercase tracking-widest font-bold">Cargando video...</p>
            </div>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none" />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 pt-32 pb-20">
        <div className="text-center space-y-8 max-w-6xl mx-auto">
          {/* Tag */}
          <p className="inline-block text-[10px] font-black uppercase tracking-[0.5em] text-white/50 border border-white/10 rounded-full px-6 py-2">
            Laureles · Medellín
          </p>

          {/* Main Title */}
          <h1 className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-black tracking-tighter uppercase leading-[0.85] text-white">
            Velik
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-light italic text-white/70 max-w-xl mx-auto">
            Tu espacio para sentirte completamente bien.
          </p>

          {/* Tagline chips */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {["Nail Care", "Hair Care", "Skin Care", "Herramientas", "Kits Exclusivos"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-widest text-white/60 border border-white/10 rounded-full px-5 py-2 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-6 justify-center pt-6">
            <a
              href="#products"
              className="px-10 py-5 rounded-full bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
            >
              Comprar Ahora
            </a>
            <a
              href="#products"
              className="px-10 py-5 rounded-full border border-white/20 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm"
            >
              Ver productos
            </a>
          </div>
        </div>
      </div>

      {/* ── Scrolling Marquee ── */}
      <div className="relative z-10 border-t border-white/10 overflow-hidden py-5 bg-black/50 backdrop-blur-sm">
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 flex items-center gap-6"
            >
              {word}
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-bounce">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  )
}
