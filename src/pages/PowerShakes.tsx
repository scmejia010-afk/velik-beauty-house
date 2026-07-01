import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  SEDES_POWERSHAKES,
  campanaActiva,
  generarCodigo,
  CAMPANA_INICIO,
  CAMPANA_FIN,
} from "@/lib/powershakes";

const OPCIONES_FECHA: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", timeZone: "America/Bogota" };
const rangoFechas = `${CAMPANA_INICIO.toLocaleDateString("es-CO", OPCIONES_FECHA)} al ${CAMPANA_FIN.toLocaleDateString("es-CO", OPCIONES_FECHA)}`;

export function PowerShakes() {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [instagram, setInstagram] = useState("");
  const [autorizo, setAutorizo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [copiado, setCopiado] = useState(false);

  const activa = campanaActiva();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!autorizo) {
      setError("Debes autorizar el tratamiento de datos para continuar.");
      return;
    }

    setLoading(true);

    let intentos = 0;
    let ultimoError: { code?: string; message: string } | null = null;

    while (intentos < 5) {
      const codigo = generarCodigo();
      const { error: insertError } = await supabase.from("powershakes_bonos").insert({
        codigo,
        nombre: nombre.trim(),
        cedula: cedula.trim(),
        celular: celular.trim(),
        correo: correo.trim() || null,
        instagram: instagram.trim() || null,
        autorizo_datos: autorizo,
      });

      if (!insertError) {
        setCodigoGenerado(codigo);
        setLoading(false);
        return;
      }

      // Colisión de código (muy improbable): generamos otro e intentamos de nuevo.
      if (insertError.code === "23505" && insertError.message.includes("codigo")) {
        intentos += 1;
        ultimoError = insertError;
        continue;
      }

      // Cédula ya registrada: no reintentamos, es un caso esperado.
      if (insertError.code === "23505" && insertError.message.includes("cedula")) {
        setError(
          "Ya existe un bono registrado con esta cédula. Si no recibiste tu código, escríbenos por Instagram o WhatsApp."
        );
        setLoading(false);
        return;
      }

      ultimoError = insertError;
      break;
    }

    setError(ultimoError?.message || "Ocurrió un error al registrar tus datos. Intenta de nuevo.");
    setLoading(false);
  };

  const handleCopiar = async () => {
    await navigator.clipboard.writeText(codigoGenerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (!activa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-3xl font-serif text-brand-dark mb-2">PowerShakes</h1>
          <p className="text-sm text-brand-dark/60 font-sans">
            Esta promoción es válida del {rangoFechas}. ¡Vuelve pronto!
          </p>
        </div>
      </div>
    );
  }

  if (codigoGenerado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-2xl font-serif text-brand-dark mb-1">¡Listo, {nombre.split(" ")[0]}!</h1>
          <p className="text-sm text-brand-dark/60 font-sans mb-6">
            Este es tu código para reclamar tu helado gratis. Guárdalo, no se puede volver a generar.
          </p>

          <div className="bg-brand-light rounded-xl py-6 mb-4">
            <p className="text-3xl font-mono font-bold tracking-widest text-brand-dark">{codigoGenerado}</p>
          </div>

          <button
            onClick={handleCopiar}
            className="w-full py-3 mb-6 bg-brand-dark text-brand-nude rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors font-sans"
          >
            {copiado ? "¡Copiado!" : "Copiar código"}
          </button>

          <p className="text-xs text-brand-dark/60 font-sans mb-2">
            Preséntalo junto con tu cédula, del {rangoFechas}, en cualquiera de nuestras sedes participantes:
          </p>
          <p className="text-xs text-brand-dark/80 font-sans font-semibold">
            {SEDES_POWERSHAKES.join(" · ")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-brand-dark mb-2">PowerShakes</h1>
          <p className="text-sm text-brand-dark/60 font-sans">
            Regístrate y reclama tu helado gratis. Válido del {rangoFechas}.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center mb-6 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">
              Cédula
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">
              Celular
            </label>
            <input
              type="tel"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">
              Instagram
            </label>
            <input
              type="text"
              placeholder="@usuario"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
            />
          </div>

          <label className="flex items-start gap-3 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autorizo}
              onChange={(e) => setAutorizo(e.target.checked)}
              className="mt-1"
              required
            />
            <span className="text-xs text-brand-dark/70 font-sans">
              Autorizo el tratamiento de mis datos personales para fines de esta promoción.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-brand-dark text-brand-nude rounded-full font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors font-sans disabled:opacity-50"
          >
            {loading ? "Generando código..." : "Reclamar mi helado"}
          </button>
        </form>
      </div>
    </div>
  );
}
