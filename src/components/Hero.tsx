import { useState, useEffect, useRef } from "react"
import MuxPlayer from '@mux/mux-player-react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PLAYBACK_ID = "E3rAKyTB54G02a702jKVDAsRnWoRXwUss6mjjctaODp8w"

const marqueeWords = [
  "Belleza que sana", "Skin Care", "Hair Care", "Nail Care", "Experiencia Velik",
  "Authentic Beauty Concept", "Spa Boutique", "Relajación"
]

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Animaciones Framer Motion
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yMarquee = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section ref={containerRef} id="home" className="relative h-[150vh] bg-brand-white">
      {/* ── Contenedor pegajoso para el efecto Parallax ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* ── Video Background con Escala y Bordes ── */}
        <motion.div 
          style={{ scale, opacity, borderRadius }}
          className="absolute inset-0 z-0 origin-center overflow-hidden bg-brand-dark"
        >
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
            <div className="w-full h-full bg-brand-dark flex items-center justify-center">
              <p className="text-brand-nude text-xs uppercase tracking-widest font-sans">Cargando experiencia...</p>
            </div>
          )}
          {/* Overlay gradient cálido */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1E1E]/40 via-[#1E1E1E]/20 to-[#1E1E1E]/70 pointer-events-none" />
        </motion.div>

        {/* ── Main Content con Parallax ── */}
        <motion.div 
          style={{ y: yText }}
          className="relative z-10 flex flex-col justify-center items-center px-6 w-full max-w-5xl mx-auto text-center mt-12"
        >
          {/* Tag */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block text-[10px] font-accent uppercase tracking-[0.4em] text-brand-gold border border-brand-gold/30 rounded-full px-6 py-2 mb-8 backdrop-blur-md bg-brand-dark/30"
          >
            Laureles · Medellín
          </motion.p>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl sm:text-8xl md:text-[8rem] font-serif tracking-tight leading-[0.9] text-brand-white mb-6"
          >
            Belleza <br />
            <span className="italic text-brand-nude font-light">que sana.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg sm:text-xl font-sans font-light text-brand-light/90 max-w-md mx-auto mb-10"
          >
            Tu refugio de bienestar y cuidado premium con la línea oficial de Authentic Beauty Concept.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <a
              href="#products"
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-brand-white/10 text-brand-white border border-brand-white/20 font-sans text-xs uppercase tracking-[0.2em] hover:bg-brand-white hover:text-brand-dark hover:scale-105 active:scale-95 transition-all duration-500 backdrop-blur-md"
            >
              Descubrir Catálogo
            </a>
          </motion.div>
        </motion.div>

        {/* ── Scrolling Marquee Inferior ── */}
        <motion.div 
          style={{ y: yMarquee }}
          className="absolute bottom-0 w-full z-10 border-t border-brand-white/10 overflow-hidden py-4 bg-brand-dark/40 backdrop-blur-md"
        >
          <div className="flex animate-marquee gap-12 whitespace-nowrap">
            {[...marqueeWords, ...marqueeWords].map((word, i) => (
              <span
                key={i}
                className="text-[10px] font-accent uppercase tracking-[0.3em] text-brand-gold/70 flex items-center gap-6"
              >
                {word}
                <span className="w-1 h-1 rounded-full bg-brand-gold/50 inline-block" />
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
