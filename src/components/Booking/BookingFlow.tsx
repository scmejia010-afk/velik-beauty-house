import { useState, useEffect, useCallback, type JSX } from "react"
import { ChevronLeft, Clock, CheckCircle, Loader2, ChevronRight } from "lucide-react"
import { CATEGORIAS, SERVICIOS, PROFESIONALES, SLOTS_URL, CREAR_URL } from "@/data/bookingData"
import type { Servicio, Profesional } from "@/data/bookingData"

// ── Types ────────────────────────────────────────────────────────────────────

interface Slot { label: string; date: string; slot: string }

interface BookingState {
  step: 1 | 2 | 3 | 4 | 5
  categoria: string | null
  servicio: Servicio | null
  profesional: Profesional | null
  slot: Slot | null
  nombre: string
  telefono: string
  email: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const STEPS = ["Categoría", "Servicio", "Profesional", "Fecha y Hora", "Confirmación"]

const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return `${DAYS_ES[date.getDay()]} ${d} de ${MONTHS_ES[m - 1]}`
}

// ── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const num = i + 1
        const active = num === step
        const done = num < step
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                done ? "bg-[#DCC7B2] border-[#DCC7B2] text-[#1E1E1E]"
                : active ? "bg-transparent border-[#DCC7B2] text-[#DCC7B2]"
                : "bg-transparent border-white/20 text-white/30"
              }`}>
                {done ? "✓" : num}
              </div>
              <span className={`text-[9px] uppercase tracking-widest hidden sm:block ${
                active ? "text-[#DCC7B2]" : done ? "text-[#DCC7B2]/60" : "text-white/30"
              }`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 sm:w-12 h-px mx-1 mb-4 transition-all duration-300 ${done ? "bg-[#DCC7B2]/50" : "bg-white/10"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Step 1: Categoría ────────────────────────────────────────────────────────

const C = "rgba(220,199,178,0.9)"

const CAT_ICONS: Record<string, JSX.Element> = {
  "Manicure": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* Hand with polished nails */}
      <path d="M10 28 Q10 24 12 22 L12 12 Q12 10 14 10 Q16 10 16 12 L16 14 Q16 12 18 12 Q20 12 20 14 L20 15 Q20 13 22 13 Q24 13 24 15 L24 16 Q24 14.5 25.5 14.5 Q27 14.5 27 16 L27 24 Q27 28 23 30 L14 30 Q10 30 10 28 Z" stroke={C} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <rect x="12.5" y="9" width="3" height="4" rx="1.5" fill={C} opacity="0.7"/>
      <rect x="16.5" y="11" width="3" height="3.5" rx="1.5" fill={C} opacity="0.7"/>
      <rect x="20.5" y="12" width="3" height="3.5" rx="1.5" fill={C} opacity="0.7"/>
      <rect x="24.3" y="13.5" width="2.5" height="3" rx="1.25" fill={C} opacity="0.7"/>
    </svg>
  ),
  "Pedicure": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* Foot */}
      <path d="M8 20 Q8 14 14 14 L22 14 Q26 14 26 18 Q26 20 24 20 L22 20 Q24 20 24 22 Q24 24 22 24 L20 24 Q21 24 21 26 Q21 28 19 28 L14 28 Q10 28 8 24 Z" stroke={C} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <circle cx="13" cy="11" r="2" fill={C} opacity="0.7"/>
      <circle cx="17.5" cy="10" r="2" fill={C} opacity="0.7"/>
      <circle cx="22" cy="11" r="2" fill={C} opacity="0.7"/>
    </svg>
  ),
  "Manicura y Pedicura": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* Two hands / diamond */}
      <path d="M18 6 L22 14 L30 14 L24 19 L26 27 L18 22 L10 27 L12 19 L6 14 L14 14 Z" stroke={C} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <circle cx="18" cy="18" r="2.5" fill={C} opacity="0.5"/>
    </svg>
  ),
  "Cabello": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* Hair / scissors */}
      <path d="M10 8 Q14 12 18 18 Q22 24 26 28" stroke={C} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 8 Q16 13 18 18 Q20 23 24 28" stroke={C} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <path d="M8 10 Q12 14 18 18 Q24 22 28 26" stroke={C} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <circle cx="9" cy="29" r="3" stroke={C} strokeWidth="1.3" fill="none"/>
      <circle cx="27" cy="29" r="3" stroke={C} strokeWidth="1.3" fill="none"/>
      <path d="M10.5 27 L26.5 11" stroke={C} strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  "Cejas y Pestañas": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* Eye with lashes */}
      <path d="M6 18 Q12 10 18 10 Q24 10 30 18 Q24 26 18 26 Q12 26 6 18 Z" stroke={C} strokeWidth="1.4" fill="none"/>
      <circle cx="18" cy="18" r="4.5" stroke={C} strokeWidth="1.4" fill="none"/>
      <circle cx="18" cy="18" r="2" fill={C} opacity="0.6"/>
      {/* lashes */}
      <path d="M14 10 L13 7" stroke={C} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M18 9 L18 6" stroke={C} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M22 10 L23 7" stroke={C} strokeWidth="1.3" strokeLinecap="round"/>
      {/* brow */}
      <path d="M9 13 Q18 9 27 13" stroke={C} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  "Depilación": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* Feather/wax strip */}
      <path d="M18 30 Q10 22 10 14 Q10 7 18 7 Q26 7 26 14 Q26 22 18 30 Z" stroke={C} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <path d="M18 7 L18 30" stroke={C} strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
      <path d="M12 13 Q18 11 24 13" stroke={C} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M11 17 Q18 15 25 17" stroke={C} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M12 21 Q18 19 24 21" stroke={C} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
    </svg>
  ),
  "Maquillaje Profesional": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* Lipstick */}
      <rect x="14" y="8" width="8" height="13" rx="2" stroke={C} strokeWidth="1.4" fill="none"/>
      <path d="M14 12 Q18 9 22 12" stroke={C} strokeWidth="1.2" fill="none"/>
      <rect x="13" y="21" width="10" height="4" rx="1" stroke={C} strokeWidth="1.3" fill="none"/>
      <rect x="12" y="25" width="12" height="4" rx="1.5" stroke={C} strokeWidth="1.3" fill="none"/>
      <path d="M14 8 L16 4 L20 4 L22 8" stroke={C} strokeWidth="1.2" fill="none" strokeLinejoin="round" opacity="0.7"/>
      <path d="M16 4 Q18 2 20 4" stroke={C} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  "Corporal": (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* Body / lotus */}
      <ellipse cx="18" cy="22" rx="8" ry="10" stroke={C} strokeWidth="1.4" fill="none"/>
      <path d="M18 12 Q12 8 10 12 Q12 16 18 14 Q24 16 26 12 Q24 8 18 12 Z" stroke={C} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
      <path d="M18 12 L18 22" stroke={C} strokeWidth="1" opacity="0.4"/>
      <path d="M15 17 Q18 15 21 17" stroke={C} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M14 21 Q18 19 22 21" stroke={C} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  ),
}

function Step1({ onSelect }: { onSelect: (cat: string) => void }) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(220,199,178,0.45)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Reserva tu cita
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#DCC7B2]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          ¿Qué servicio estás buscando?
        </h2>
        <div style={{ width: "40px", height: "1px", background: "rgba(220,199,178,0.4)", margin: "1rem auto 0" }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="group relative flex flex-col items-center justify-center text-center rounded-2xl transition-all duration-400 hover:-translate-y-1"
            style={{
              padding: "2rem 1rem",
              border: "1px solid rgba(220,199,178,0.2)",
              background: "linear-gradient(160deg, rgba(220,199,178,0.06) 0%, rgba(220,199,178,0.02) 100%)",
              boxShadow: "0 1px 0 rgba(220,199,178,0.06)"
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(220,199,178,0.7)"
              ;(e.currentTarget as HTMLElement).style.background = "linear-gradient(160deg, rgba(220,199,178,0.12) 0%, rgba(220,199,178,0.05) 100%)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(220,199,178,0.12), 0 1px 0 rgba(220,199,178,0.2)"
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(220,199,178,0.2)"
              ;(e.currentTarget as HTMLElement).style.background = "linear-gradient(160deg, rgba(220,199,178,0.06) 0%, rgba(220,199,178,0.02) 100%)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "0 1px 0 rgba(220,199,178,0.06)"
            }}
          >
            <span className="mb-3 transition-transform duration-300 group-hover:scale-110 block">{CAT_ICONS[cat]}</span>
            <span className="font-serif text-base leading-snug transition-colors duration-300 block mb-2" style={{ color: "rgba(220,199,178,0.85)", fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem" }}>
              {cat}
            </span>
            <span className="block transition-colors duration-300" style={{ fontFamily: "Poppins, sans-serif", fontSize: "10px", letterSpacing: "0.12em", color: "rgba(220,199,178,0.35)", textTransform: "uppercase" }}>
              {SERVICIOS[cat]?.length || 0} servicios
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Servicio ─────────────────────────────────────────────────────────

function Step2({ categoria, onSelect }: { categoria: string; onSelect: (s: Servicio) => void }) {
  const servicios = SERVICIOS[categoria] || []
  return (
    <div className="animate-fade-in">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#DCC7B2] text-center mb-2">{categoria}</h2>
      <p className="text-white/40 text-center text-sm mb-10 tracking-wide">Selecciona el servicio que deseas</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1 velik-scroll">
        {servicios.map((s) => (
          <button
            key={s.calendarId}
            onClick={() => onSelect(s)}
            className="group flex items-center justify-between border border-white/10 hover:border-[#DCC7B2]/50 bg-white/3 hover:bg-[#DCC7B2]/5 rounded-xl px-5 py-4 text-left transition-all duration-300 hover:scale-[1.01]"
          >
            <div>
              <span className="block text-sm font-medium text-white/85 group-hover:text-white transition-colors">{s.nombre}</span>
              <span className="flex items-center gap-1 text-xs text-white/35 mt-1">
                <Clock className="w-3 h-3" />{s.duracion} min
              </span>
            </div>
            <span className="text-sm font-semibold text-[#DCC7B2]/80 group-hover:text-[#DCC7B2] transition-colors ml-4 whitespace-nowrap">{s.precio}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Step 3: Profesional ──────────────────────────────────────────────────────

function Step3({ servicio, onSelect }: { servicio: Servicio; onSelect: (p: Profesional) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const disponibles = servicio.profesionales
    ? PROFESIONALES.filter(p => servicio.profesionales!.includes(p.userId))
    : PROFESIONALES
  return (
    <div className="animate-fade-in">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#DCC7B2] text-center mb-2">Elige tu Profesional</h2>
      <p className="text-white/40 text-center text-sm mb-10 tracking-wide">¿Con quién te gustaría ser atendida?</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {disponibles.map((p) => {
          const isSelected = selected === p.userId
          return (
            <button
              key={p.userId}
              onClick={() => { setSelected(p.userId); setTimeout(() => onSelect(p), 220) }}
              className={`group flex flex-col items-center gap-4 rounded-2xl overflow-hidden border transition-all duration-300 ${
                isSelected
                  ? "border-[#DCC7B2] bg-[#DCC7B2]/8 scale-[1.02]"
                  : "border-white/10 hover:border-[#DCC7B2]/40 bg-white/3 hover:bg-white/5 hover:scale-[1.01]"
              }`}
            >
              {/* Foto grande */}
              <div className="w-full aspect-[3/4] overflow-hidden">
                {p.foto ? (
                  <img src={p.foto} alt={p.nombre} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-4xl font-bold transition-all duration-300 ${
                    isSelected ? "text-[#DCC7B2]" : "text-white/30 group-hover:text-[#DCC7B2]/60"
                  }`} style={{ background: "rgba(220,199,178,0.04)" }}>
                    {p.iniciales}
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="text-center pb-5 px-4">
                <p className={`font-semibold text-sm transition-colors ${isSelected ? "text-[#DCC7B2]" : "text-white/85 group-hover:text-white"}`}>{p.nombre}</p>
                <p className="text-xs text-white/40 mt-1">{p.especialidad}</p>
                {isSelected && <CheckCircle className="w-4 h-4 text-[#DCC7B2] mx-auto mt-2" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 4: Fecha y Hora ─────────────────────────────────────────────────────

function Step4({ servicio, profesional, onSelect }: { servicio: Servicio; profesional: Profesional; onSelect: (slot: Slot) => void }) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [monthOffset, setMonthOffset] = useState(0)

  const fetchSlots = useCallback(async () => {
    setLoading(true); setError("")
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(start); end.setDate(end.getDate() + 30)
    const url = `${SLOTS_URL}?calendarId=${servicio.calendarId}&startDate=${start.getTime()}&endDate=${end.getTime()}&userId=${profesional.userId}`
    try {
      const r = await fetch(url)
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      setSlots(data.slots || [])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(`Error: ${msg}`)
    } finally {
      setLoading(false)
    }
  }, [servicio.calendarId, profesional.userId])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  // Build calendar for current displayed month
  const today = new Date()
  const displayMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()

  const availableDates = new Set(slots.map(s => s.date))

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const calendarCells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const slotsForDate = selectedDate ? slots.filter(s => s.date === selectedDate) : []

  const canGoPrev = monthOffset > 0
  const canGoNext = monthOffset < 3

  return (
    <div className="animate-fade-in">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#DCC7B2] text-center mb-2">Fecha y Hora</h2>
      <p className="text-white/40 text-center text-sm mb-8 tracking-wide">Disponibilidad de {profesional.nombre}</p>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 text-white/40">
          <Loader2 className="w-8 h-8 animate-spin text-[#DCC7B2]" />
          <span className="text-sm">Cargando disponibilidad...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-white/50 mb-4">{error}</p>
          <button onClick={fetchSlots} className="text-[#DCC7B2] text-sm underline underline-offset-4">Reintentar</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="border border-white/10 rounded-2xl p-5 bg-white/2">
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => canGoPrev && setMonthOffset(o => o - 1)} className={`p-1 rounded-full transition-colors ${canGoPrev ? "text-white/60 hover:text-[#DCC7B2]" : "text-white/15 cursor-default"}`}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-white/80">{MONTHS_ES[month]} {year}</span>
              <button onClick={() => canGoNext && setMonthOffset(o => o + 1)} className={`p-1 rounded-full transition-colors ${canGoNext ? "text-white/60 hover:text-[#DCC7B2]" : "text-white/15 cursor-default"}`}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_ES.map(d => <div key={d} className="text-center text-[10px] text-white/30 uppercase tracking-wider py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((day, i) => {
                if (!day) return <div key={i} />
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                const hasSlots = availableDates.has(dateStr)
                const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                const isSelected = selectedDate === dateStr
                return (
                  <button
                    key={i}
                    onClick={() => hasSlots && !isPast && setSelectedDate(dateStr)}
                    disabled={!hasSlots || isPast}
                    className={`aspect-square rounded-lg text-xs font-medium transition-all duration-200 ${
                      isSelected ? "bg-[#DCC7B2] text-[#1E1E1E] font-bold"
                      : hasSlots && !isPast ? "text-white/85 hover:bg-[#DCC7B2]/15 hover:text-[#DCC7B2] cursor-pointer"
                      : "text-white/15 cursor-default"
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          <div>
            {!selectedDate ? (
              <div className="flex items-center justify-center h-full text-white/30 text-sm text-center p-8">
                Selecciona un día del calendario para ver los horarios disponibles
              </div>
            ) : slotsForDate.length === 0 ? (
              <div className="flex items-center justify-center h-full text-white/30 text-sm text-center p-8">
                No hay disponibilidad para este día.<br />Por favor elige otra fecha.
              </div>
            ) : (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-4">{formatDate(selectedDate)}</p>
                <div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1 velik-scroll">
                  {slotsForDate.map((s) => (
                    <button
                      key={s.slot}
                      onClick={() => onSelect(s)}
                      className="border border-white/15 hover:border-[#DCC7B2]/70 hover:bg-[#DCC7B2]/8 rounded-lg py-3 text-sm text-white/75 hover:text-[#DCC7B2] transition-all duration-200"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Step 5: Confirmación ─────────────────────────────────────────────────────

function Step5({
  servicio, profesional, slot, nombre, telefono, email,
  onChange, onConfirm, loading, success
}: {
  servicio: Servicio; profesional: Profesional; slot: Slot
  nombre: string; telefono: string; email: string
  onChange: (field: string, val: string) => void
  onConfirm: () => void; loading: boolean; success: boolean
}) {
  if (success) {
    return (
      <div className="animate-fade-in flex flex-col items-center gap-6 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-[#DCC7B2]/10 border border-[#DCC7B2]/40 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-[#DCC7B2]" />
        </div>
        <div>
          <h2 className="font-serif text-3xl text-[#DCC7B2] mb-2">¡Cita Confirmada!</h2>
          <p className="text-white/50 text-sm">Te esperamos en Velik Beauty House</p>
        </div>
        <div className="border border-[#DCC7B2]/20 rounded-2xl p-6 bg-[#DCC7B2]/4 w-full max-w-sm text-left space-y-3">
          <Row label="Servicio" value={servicio.nombre} />
          <Row label="Profesional" value={profesional.nombre} />
          <Row label="Fecha" value={formatDate(slot.date)} />
          <Row label="Hora" value={slot.label} />
          <Row label="Duración" value={`${servicio.duracion} min`} />
          <Row label="Precio" value={servicio.precio} />
        </div>
        <p className="text-white/30 text-xs">Recibirás confirmación si dejaste tu correo electrónico.</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <h2 className="font-serif text-3xl sm:text-4xl text-[#DCC7B2] text-center mb-2">Confirma tu Cita</h2>
      <p className="text-white/40 text-center text-sm mb-8 tracking-wide">Revisa los detalles y completa tus datos</p>

      {/* Resumen */}
      <div className="border border-[#DCC7B2]/20 rounded-2xl p-5 bg-[#DCC7B2]/4 mb-6 space-y-2">
        <Row label="Servicio" value={servicio.nombre} />
        <Row label="Profesional" value={profesional.nombre} />
        <Row label="Fecha" value={formatDate(slot.date)} />
        <Row label="Hora" value={slot.label} />
        <Row label="Duración" value={`${servicio.duracion} min`} />
        <Row label="Precio" value={servicio.precio} gold />
      </div>

      {/* Formulario */}
      <div className="space-y-4">
        <Field label="Nombre completo *" value={nombre} onChange={v => onChange("nombre", v)} placeholder="Tu nombre" />
        <Field label="Teléfono *" value={telefono} onChange={v => onChange("telefono", v)} placeholder="+57 300 000 0000" type="tel" />
        <Field label="Correo electrónico" value={email} onChange={v => onChange("email", v)} placeholder="tu@email.com" type="email" />
      </div>

      <button
        onClick={onConfirm}
        disabled={loading || !nombre.trim() || !telefono.trim()}
        className="w-full mt-6 py-4 rounded-xl font-semibold text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #DCC7B2, #BFA15A)", color: "#1E1E1E" }}
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Agendando...</> : "Confirmar Cita"}
      </button>
    </div>
  )
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/40">{label}</span>
      <span className={gold ? "text-[#DCC7B2] font-semibold" : "text-white/80"}>{value}</span>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 focus:border-[#DCC7B2]/50 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors"
      />
    </div>
  )
}

// ── Main BookingFlow ──────────────────────────────────────────────────────────

export function BookingFlow() {
  const [state, setState] = useState<BookingState>({
    step: 1, categoria: null, servicio: null, profesional: null,
    slot: null, nombre: "", telefono: "", email: "",
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const set = (patch: Partial<BookingState>) => setState(s => ({ ...s, ...patch }))

  const goBack = () => {
    if (state.step === 1) return
    const prev = (state.step - 1) as BookingState["step"]
    if (prev === 1) set({ step: 1, categoria: null, servicio: null, profesional: null, slot: null })
    else if (prev === 2) set({ step: 2, servicio: null, profesional: null, slot: null })
    else if (prev === 3) set({ step: 3, profesional: null, slot: null })
    else if (prev === 4) set({ step: 4, slot: null })
    else set({ step: prev })
  }

  const handleConfirm = async () => {
    if (!state.servicio || !state.profesional || !state.slot) return
    setSubmitLoading(true); setSubmitError("")
    try {
      const r = await fetch(CREAR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarId: state.servicio.calendarId,
          slot: state.slot.slot,
          nombre: state.nombre,
          telefono: state.telefono,
          email: state.email,
          servicio: state.servicio.nombre,
          duracion: state.servicio.duracion,
          precio: state.servicio.precio || '',
          userId: state.profesional.userId,
        }),
      })
      const data = await r.json()
      if (data.ok || data.id || data.status === 'booked') setSubmitSuccess(true)
      else setSubmitError("No se pudo crear la cita. Intenta de nuevo.")
    } catch {
      setSubmitError("Error de conexión. Intenta de nuevo.")
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ background: "#1E1E1E" }}>
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-5 flex items-center justify-between">
        <a href="/" className="font-black text-xl tracking-tighter uppercase italic text-white">
          Velik<span className="text-white/30">.</span>
        </a>
        {state.step > 1 && !submitSuccess && (
          <button onClick={goBack} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {!submitSuccess && <Stepper step={state.step} />}

        {state.step === 1 && (
          <Step1 onSelect={cat => set({ categoria: cat, step: 2 })} />
        )}
        {state.step === 2 && state.categoria && (
          <Step2 categoria={state.categoria} onSelect={s => set({ servicio: s, step: 3 })} />
        )}
        {state.step === 3 && state.servicio && (
          <Step3 servicio={state.servicio} onSelect={p => set({ profesional: p, step: 4 })} />
        )}
        {state.step === 4 && state.servicio && state.profesional && (
          <Step4
            servicio={state.servicio}
            profesional={state.profesional}
            onSelect={slot => set({ slot, step: 5 })}
          />
        )}
        {state.step === 5 && state.servicio && state.profesional && state.slot && (
          <>
            <Step5
              servicio={state.servicio}
              profesional={state.profesional}
              slot={state.slot}
              nombre={state.nombre}
              telefono={state.telefono}
              email={state.email}
              onChange={(f, v) => set({ [f]: v } as Partial<BookingState>)}
              onConfirm={handleConfirm}
              loading={submitLoading}
              success={submitSuccess}
            />
            {submitError && <p className="text-red-400/70 text-xs text-center mt-3">{submitError}</p>}
          </>
        )}
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .velik-scroll::-webkit-scrollbar { width: 4px; }
        .velik-scroll::-webkit-scrollbar-track { background: transparent; }
        .velik-scroll::-webkit-scrollbar-thumb { background: rgba(220,199,178,0.2); border-radius: 2px; }
        .font-serif { font-family: "Cormorant Garamond", serif; }
      `}</style>
    </div>
  )
}
