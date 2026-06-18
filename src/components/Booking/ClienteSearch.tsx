import { useState, useEffect, useRef } from "react"
import { Search, X, UserPlus, Loader2, ChevronLeft } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

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
  const [creando, setCreando] = useState(false)
  const [nuevoNombres, setNuevoNombres] = useState("")
  const [nuevoApellidos, setNuevoApellidos] = useState("")
  const [nuevoTelefono, setNuevoTelefono] = useState("")
  const [nuevoEmail, setNuevoEmail] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [errorCrear, setErrorCrear] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

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
    setCreando(false)
  }

  function escribirManual(v: string) {
    setQuery(v)
    onChange("nombre", v)
    setSeleccionado(false)
  }

  function abrirCrear() {
    const partes = query.trim().split(/\s+/)
    setNuevoNombres(partes[0] || "")
    setNuevoApellidos(partes.slice(1).join(" "))
    setNuevoTelefono(telefono || "")
    setNuevoEmail(email || "")
    setErrorCrear("")
    setCreando(true)
    setAbierto(false)
  }

  async function crearContacto() {
    const tel = nuevoTelefono.replace(/\D/g, "")
    if (!nuevoNombres.trim() || tel.length < 10) {
      setErrorCrear("Nombre y teléfono (10 dígitos) son obligatorios")
      return
    }
    setGuardando(true)
    setErrorCrear("")
    const telefonoFinal = nuevoTelefono.startsWith("+") ? nuevoTelefono : "+57" + tel

    const { data, error } = await supabase
      .from("contactos")
      .insert({
        nombres: nuevoNombres.trim(),
        apellidos: nuevoApellidos.trim() || null,
        telefono: telefonoFinal,
        email: nuevoEmail.trim() || null,
      })
      .select()
      .single()

    if (error) {
      setErrorCrear("Error al guardar: " + error.message)
      setGuardando(false)
      return
    }

    setGuardando(false)
    setCreando(false)
    seleccionar(data as Contacto)
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#DCC7B2]/50 transition-colors"

  // --- MODO CREAR ---
  if (creando) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={() => setCreando(false)} className="text-white/40 hover:text-white/70 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-xs font-medium text-[#DCC7B2] uppercase tracking-widest flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5" /> Nuevo cliente
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Nombres *</label>
            <input
              value={nuevoNombres}
              onChange={e => setNuevoNombres(e.target.value)}
              placeholder="Nombres"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Apellidos</label>
            <input
              value={nuevoApellidos}
              onChange={e => setNuevoApellidos(e.target.value)}
              placeholder="Apellidos"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Teléfono *</label>
          <input
            type="tel"
            inputMode="tel"
            value={nuevoTelefono}
            onChange={e => setNuevoTelefono(e.target.value)}
            placeholder="+57 300 000 0000"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Correo electrónico</label>
          <input
            type="email"
            inputMode="email"
            value={nuevoEmail}
            onChange={e => setNuevoEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputClass}
          />
        </div>

        {errorCrear && <p className="text-xs text-red-400">{errorCrear}</p>}

        <button
          onClick={crearContacto}
          disabled={guardando}
          className="w-full py-3 bg-[#DCC7B2] text-[#1a1612] rounded-xl text-sm font-semibold hover:bg-[#c9b09a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          {guardando ? "Guardando..." : "Crear y continuar"}
        </button>
      </div>
    )
  }

  // --- MODO BÚSQUEDA ---
  return (
    <div ref={ref} className="space-y-4">
      {/* Nombre con autocompletado */}
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

        {/* Dropdown */}
        {abierto && (
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
            <button
              onClick={abrirCrear}
              className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-2 text-sm text-[#DCC7B2]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {resultados.length === 0 ? `Crear cliente "${query}"` : "Crear nuevo cliente"}
            </button>
          </div>
        )}

        {/* Botón crear si no hay dropdown abierto pero sí texto */}
        {!abierto && query.length >= 2 && !seleccionado && (
          <button
            onClick={abrirCrear}
            className="mt-2 text-xs text-[#DCC7B2]/60 hover:text-[#DCC7B2] flex items-center gap-1 transition-colors"
          >
            <UserPlus className="w-3 h-3" /> ¿Cliente nuevo? Crear perfil
          </button>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Teléfono *</label>
        <input
          type="tel"
          inputMode="tel"
          value={telefono}
          onChange={e => onChange("telefono", e.target.value)}
          placeholder="+57 300 000 0000"
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Correo electrónico</label>
        <input
          type="email"
          inputMode="email"
          value={email}
          onChange={e => onChange("email", e.target.value)}
          placeholder="tu@email.com"
          className={inputClass}
        />
      </div>
    </div>
  )
}
