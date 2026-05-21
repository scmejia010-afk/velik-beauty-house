import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoProps {
  src: string;
}

export function ScrollVideo({ src }: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let seekPending = false;
    let currentTarget = 0;

    const doSeek = () => {
      if (!video) return;
      if (video.seeking) {
        seekPending = true;
        return;
      }
      seekPending = false;
      // Añadimos un pequeño factor de suavizado para que no salte brusco
      video.currentTime = currentTarget;
    };

    video.addEventListener("seeked", () => {
      if (seekPending) {
        doSeek();
      }
    });

    const initVideo = () => {
      if (Hls.isSupported() && src.includes(".m3u8")) {
        hls = new Hls({
          maxBufferLength: 120,
          maxMaxBufferLength: 600,
          maxBufferSize: 200 * 1024 * 1024, // 200MB buffer
          startPosition: 0,
          capLevelToPlayerSize: false,
          startLevel: -1,
          autoStartLoad: true,
        });

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
          // Forzamos la máxima calidad para que el scrubbing se vea premium
          const maxLevel = data.levels.length - 1;
          hls!.currentLevel = maxLevel;
          hls!.startLevel = maxLevel;
        });

        hls.on(Hls.Events.FRAG_BUFFERED, () => {
          if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const duration = video.duration || 1;
            setProgress(Math.min(100, Math.round((bufferedEnd / duration) * 100)));
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl") && src.includes(".m3u8")) {
        // Safari nativo
        video.src = src;
      } else {
        // Fallback para MP4 locales
        video.src = src;
        video.addEventListener("progress", () => {
          if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const duration = video.duration || 1;
            setProgress(Math.min(100, Math.round((bufferedEnd / duration) * 100)));
          }
        });
      }

      video.addEventListener("canplay", () => {
        setIsLoaded(true);
        // Configuramos GSAP ScrollTrigger una vez que el video puede reproducirse
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5, // Suavizado mucho mayor para que los .mp4 locales no se traben
          onUpdate: (self) => {
            if (video.duration) {
              currentTarget = self.progress * video.duration;
              doSeek();
            }
          },
        });
      });
    };

    initVideo();

    return () => {
      if (hls) {
        hls.destroy();
      }
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [src]);

  // Parallax del ratón
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      gsap.to(container, {
        x: x * -30,
        y: y * -30,
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1E]">
          <p className="text-brand-nude text-xs uppercase tracking-[0.3em] font-sans">
            Cargando Experiencia... {progress}%
          </p>
        </div>
      )}
      <div 
        ref={containerRef}
        className="fixed top-0 left-0 w-full h-full z-0 origin-center scale-[1.02]"
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="w-full h-full object-cover scale-[1.02]"
        />
        {/* Overlay oscuro para legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>
    </>
  );
}
