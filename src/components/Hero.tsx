import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScrollFloat({ text }: { text: string }) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const chars = textRef.current.querySelectorAll(".char");

    gsap.fromTo(
      chars,
      { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, transformOrigin: "50% 0%" },
      {
        opacity: 0,
        yPercent: 250,
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: 0.05,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=1500", // El texto desaparece al llegar a los 1500px de scroll
          scrub: 1.5,
        },
      }
    );
  }, []);

  const lines = text.split("\n");
  return (
    <div
      ref={textRef}
      className="fixed inset-0 flex flex-col justify-end p-6 md:p-12 pointer-events-none z-10 pb-24"
    >
      {lines.map((line, i) => (
        <span key={i} style={{ display: "block" }}>
          {line.split(" ").map((word, j) => (
            <span key={j} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {word.split("").map((char, k) => (
                <span
                  key={k}
                  className="char inline-block font-serif text-brand-white"
                  style={{
                    fontSize: "clamp(3rem, 12vw, 220px)",
                    lineHeight: 0.85,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {char}
                </span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}

function GlassPanel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !panelRef.current) return;

    // Animación de Slide-up del panel cuando llegamos al final del Hero (500vh)
    gsap.fromTo(
      wrapperRef.current,
      { y: "100%" },
      {
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: "#hero-container",
          start: "bottom bottom", // Cuando el final del hero toca el final de la pantalla
          end: "bottom+=400 bottom",
          scrub: 1.5,
        },
      }
    );

    // Parallax 3D con el ratón sobre el panel de cristal
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;

      gsap.to(panelRef.current, {
        x: x * 20,
        y: y * 20,
        rotationY: x * 4,
        rotationX: -y * 4,
        ease: "power3.out",
        duration: 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const marqueeBrands = ["HYDRATE", "GLOW", "AMPLIFY", "REPLENISH", "BARE"];
  const phoneNumber = "573016370099";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hola, me gustaría agendar una cita.")}`;

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-0 left-0 w-full h-screen pointer-events-auto flex justify-center items-end pb-8 z-20"
      style={{ perspective: "1000px" }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-[1250px] h-[900px] max-h-[85vh] flex flex-col justify-between rounded-3xl relative overflow-hidden"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(220, 199, 178, 0.5)", // Borde color Nude
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Contenido Centrado */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center mt-12">
          <p className="font-accent text-brand-gold tracking-[0.2em] uppercase text-xs md:text-sm mb-4 font-bold">
            ⭐ 5.0 en Google · +50 reseñas · A 3 min del parque de Laureles
          </p>
          <h1 className="font-serif text-brand-dark text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight w-full max-w-[900px] mx-auto mb-6">
            Uñas, cabello y facial de spa en <span className="italic text-brand-gold">Laureles</span>.
          </h1>
          <p className="text-brand-dark/70 text-lg md:text-xl max-w-[800px] mx-auto mb-10 font-medium">
            Sin frizz, sin dolor, sin lugares fríos. En Velik cuidamos tu belleza como si fuera nuestra — con productos veganos premium y artistas que sí saben lo que hacen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-brand-dark text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-black transition-colors shadow-xl"
            >
              💬 Agenda por WhatsApp en 30s
            </a>
            <a 
              href="#services" 
              className="w-full sm:w-auto bg-transparent border border-brand-dark/20 text-brand-dark px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-brand-light transition-colors"
            >
              Ver servicios y precios ↓
            </a>
          </div>
        </div>

        {/* Marquee Inferior */}
        <div className="border-t border-brand-nude/10 py-6 overflow-hidden flex">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-16 px-8">
                {marqueeBrands.map((brand) => (
                  <span
                    key={brand}
                    className="text-brand-dark opacity-30 hover:opacity-100 transition-opacity duration-300 uppercase font-sans font-semibold text-sm tracking-[0.3em]"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="hero-container" className="relative h-[250vh] bg-[#1E1E1E]">
      {/* Imagen estática de fondo del salón */}
      <img
        src="/fotos/salon.jpg"
        alt="Velik Beauty House Salón"
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="fixed inset-0 bg-black/40 pointer-events-none z-0" />
      <ScrollFloat text={"Belleza\nQue Sana"} />
      <GlassPanel />
    </section>
  );
}
