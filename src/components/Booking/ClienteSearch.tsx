interface Props {
  nombre: string
  telefono: string
  email: string
  onChange: (field: string, val: string) => void
}

// Formulario de datos del cliente para el agendamiento publico.
// IMPORTANTE: este componente NUNCA debe consultar la tabla de contactos
// desde el navegador — es una pagina publica sin autenticacion, y mostrar
// resultados de otras clientas (nombre + telefono) filtrando por lo que
// escribe cualquier visitante es una fuga de datos personales.
export default function ClienteSearch({ nombre, telefono, email, onChange }: Props) {
  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#DCC7B2]/50 transition-colors"

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
          Nombre completo *
        </label>
        <input
          type="text"
          value={nombre}
          onChange={e => onChange("nombre", e.target.value)}
          placeholder="Tu nombre completo"
          className={inputClass}
        />
      </div>

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
