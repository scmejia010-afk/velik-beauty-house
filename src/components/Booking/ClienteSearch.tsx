import { useState, useEffect, useRef } from "react"
import { Search, X, UserPlus, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Apunta al Supabase del POS donde están todos los contactos
const supabase = createClient(
  "https://aqoztzznsxhvczkanorr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxb3p0enpuc3hodmN6a2Fub3JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTk4NzUsImV4cCI6MjA5NTYzNTg3NX0.W6cF4j3EkwwrYg7uLoE-aObwAhJUcZOZCKsewvK_8VA"
)

interface Contacto {
  id: number
  nombres: string
  apellidos: string | null
  telefono: string
  email: string | null
}

interface Props {
  nombre: string
  telefono: string
  email: string
  onChange: (field: string, val: string) => void
}

export default function ClienteSearch({ nombre, telefono, email, onChange }: Props) {
  const [query, setQuery] = useState(nombre)
  const [resultados, setResultados] = useState<Contacto[]>([])
  const [abierto, setAbierto] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [seleccionado, setSeleccionado] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click afuera
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Buscar con debounce
  useEffect(() => {
    if (seleccionado || query.length < 2) { setResultados([]); return }
    const t = setTimeout(async () => {
      setCargando(true)
      const { data } = await supabase
        .from("contactos")
        .select("*")
        .or(`nombres.ilike.%${query}%,apellidos.ilike.%${query}%,telefono.ilike.%${query}%`)
        .limit(8)
      setResultados(data || [])
      setAbierto(true)
      setCargando(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query, seleccionado])

  function seleccionar(c: Contacto) {
    const nombreCompleto = `${c.nombres} ${c.apellidos || ""}`.trim()
    setQuery(nombreCompleto)
    onChange("nombre", nombreCompleto)
    onChange("telefono", c.telefono || "")
    onChange("email", c.email || "")
    setSeleccionado(true)
    setAbierto(false)
    setResultados([])
  }

  function limpiar() {
    setQuery("")
    onChange("nombre", "")
    onChange("telefono", "")
    onChange("email", "")
    setSeleccionado(false)
    setResultados([])
  }

  function escribirManual(v: string) {
    setQuery(v)
    onChange("nombre", v)
    setSeleccionado(false)
  }

  return (
    <div ref={ref} className="space-y-4">
      {/* Campo nombre con autocompletado */}
      <div>
        <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
          Nombre completo *
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={e => escribirManual(e.target.value)}
            onFocus={() => query.length >= 2 && !seleccionado && setAbierto(true)}
            placeholder="Busca tu nombre o escribe uno nuevo"
            className="w-full pl-9 pr-9 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#DCC7B2]/50 transition-colors"
          />
          {cargando && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4 animate-spin" />
          )}
          {query && !cargando && (
            <button onClick={limpiar} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown resultados */}
        {abierto && resultados.length > 0 && (
          <div className="mt-1 bg-[#1a1612] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 relative">
            {resultados.map(c => (
              <button
                key={c.id}
                onClick={() => seleccionar(c)}
                className="w-full px-4 py-3 text-left hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-white font-medium">{c.nombres} {c.apellidos || ""}</p>
                  <p className="text-xs text-white/40 mt-0.5">{c.telefono}</p>
                </div>
                <span className="text-xs text-[#DCC7B2] ml-3 shrink-0">Seleccionar</span>
              </button>
            ))}
            <div className="px-4 py-2.5 text-xs text-white/30 flex items-center gap-1.5">
              <UserPlus className="w-3 h-3" />
              ¿No apareces? Escribe tu nombre completo
            </div>
          </div>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
          Teléfono *
        </label>
        <input
          type="tel"
          inputMode="tel"
          value={telefono}
          onChange={e => onChange("telefono", e.target.value)}
          placeholder="+57 300 000 0000"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#DCC7B2]/50 transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
          Correo electrónico
        </label>
        <input
          type="email"
          inputMode="email"
          value={email}
          onChange={e => onChange("email", e.target.value)}
          placeholder="tu@email.com"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#DCC7B2]/50 transition-colors"
        />
      </div>
    </div>
  )
}
