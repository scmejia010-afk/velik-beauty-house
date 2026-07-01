import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SEDES_POWERSHAKES, normalizarCodigo } from "@/lib/powershakes";

type Bono = {
  id: number;
  codigo: string;
  nombre: string;
  cedula: string;
  celular: string;
  correo: string | null;
  instagram: string | null;
  estado: "activo" | "redimido";
  sede_redencion: string | null;
  redimido_el: string | null;
  creado_el: string;
};

export function PowerShakes() {
  const [bonos, setBonos] = useState<Bono[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | "activo" | "redimido">("todos");
  const [busqueda, setBusqueda] = useState("");

  const [codigoInput, setCodigoInput] = useState("");
  const [sedeInput, setSedeInput] = useState<string>(SEDES_POWERSHAKES[0]);
  const [canjeando, setCanjeando] = useState(false);
  const [mensajeCanje, setMensajeCanje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const fetchBonos = async () => {
    const { data } = await supabase
      .from("powershakes_bonos")
      .select("*")
      .order("creado_el", { ascending: false });

    if (data) setBonos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBonos();
  }, []);

  const handleCanjear = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeCanje(null);
    const codigo = normalizarCodigo(codigoInput);
    if (!codigo) return;

    setCanjeando(true);

    const { data: actualizado, error } = await supabase
      .from("powershakes_bonos")
      .update({ estado: "redimido", sede_redencion: sedeInput, redimido_el: new Date().toISOString() })
      .eq("codigo", codigo)
      .eq("estado", "activo")
      .select();

    if (error) {
      setMensajeCanje({ tipo: "error", texto: "Error al canjear. Intenta de nuevo." });
      setCanjeando(false);
      return;
    }

    if (actualizado && actualizado.length > 0) {
      const bono = actualizado[0] as Bono;
      setMensajeCanje({ tipo: "ok", texto: `✅ Canjeado: ${bono.nombre} (C.C. ${bono.cedula})` });
      setBonos((prev) => prev.map((b) => (b.id === bono.id ? bono : b)));
      setCodigoInput("");
    } else {
      // No se actualizó nada: el código no existe o ya estaba redimido.
      const { data: existente } = await supabase
        .from("powershakes_bonos")
        .select("*")
        .eq("codigo", codigo)
        .maybeSingle();

      if (!existente) {
        setMensajeCanje({ tipo: "error", texto: "❌ Código no encontrado." });
      } else {
        const fecha = existente.redimido_el ? new Date(existente.redimido_el).toLocaleString("es-CO") : "";
        setMensajeCanje({
          tipo: "error",
          texto: `❌ Este bono ya fue canjeado el ${fecha} en ${existente.sede_redencion}.`,
        });
      }
    }

    setCanjeando(false);
  };

  const bonosFiltrados = useMemo(() => {
    return bonos.filter((b) => {
      if (filtro !== "todos" && b.estado !== filtro) return false;
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        return (
          b.nombre.toLowerCase().includes(q) ||
          b.cedula.toLowerCase().includes(q) ||
          b.codigo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [bonos, filtro, busqueda]);

  const exportarCSV = () => {
    const encabezados = ["Código", "Nombre", "Cédula", "Celular", "Correo", "Instagram", "Estado", "Sede", "Redimido el", "Creado el"];
    const filas = bonosFiltrados.map((b) => [
      b.codigo,
      b.nombre,
      b.cedula,
      b.celular,
      b.correo || "",
      b.instagram || "",
      b.estado,
      b.sede_redencion || "",
      b.redimido_el || "",
      b.creado_el,
    ]);

    const csv = [encabezados, ...filas]
      .map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `powershakes_bonos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Cargando bonos...</div>;

  const activos = bonos.filter((b) => b.estado === "activo").length;
  const redimidos = bonos.filter((b) => b.estado === "redimido").length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h1 className="text-2xl font-serif text-brand-dark mb-1">PowerShakes — Canjear bono</h1>
        <p className="text-sm text-brand-dark/60 font-sans mb-6">
          {bonos.length} registrados · {activos} activos · {redimidos} redimidos
        </p>

        {mensajeCanje && (
          <div
            className={`p-3 rounded-lg text-sm mb-4 font-sans ${
              mensajeCanje.tipo === "ok" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
            }`}
          >
            {mensajeCanje.texto}
          </div>
        )}

        <form onSubmit={handleCanjear} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Código del bono (ej. PS-7K4QXA)"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value)}
            className="flex-1 bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-mono uppercase"
            required
          />
          <select
            value={sedeInput}
            onChange={(e) => setSedeInput(e.target.value)}
            className="bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
          >
            {SEDES_POWERSHAKES.map((sede) => (
              <option key={sede} value={sede}>
                {sede}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={canjeando}
            className="px-8 py-3 bg-brand-dark text-brand-nude rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-colors font-sans disabled:opacity-50"
          >
            {canjeando ? "Canjeando..." : "Canjear"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-serif text-brand-dark">Seguimiento</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre, cédula o código"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-brand-light border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-gold outline-none font-sans"
            />
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as "todos" | "activo" | "redimido")}
              className="bg-brand-light border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-gold outline-none font-sans"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="redimido">Redimidos</option>
            </select>
            <button
              onClick={exportarCSV}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-brand-dark/20 hover:bg-brand-light transition-colors font-sans"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="border-b border-brand-light text-brand-dark/60 uppercase tracking-widest text-[10px]">
                <th className="pb-4 font-bold">Código</th>
                <th className="pb-4 font-bold">Cliente</th>
                <th className="pb-4 font-bold">Estado</th>
                <th className="pb-4 font-bold">Sede</th>
                <th className="pb-4 font-bold">Registrado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light">
              {bonosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-brand-dark/60">
                    No hay bonos que coincidan.
                  </td>
                </tr>
              ) : (
                bonosFiltrados.map((b) => (
                  <tr key={b.id} className="text-brand-dark">
                    <td className="py-4 pr-4 font-mono">{b.codigo}</td>
                    <td className="py-4 pr-4">
                      <p className="font-bold">{b.nombre}</p>
                      <p className="text-xs">C.C. {b.cedula}</p>
                      <p className="text-xs">{b.celular}</p>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                          b.estado === "redimido"
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {b.estado}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      {b.sede_redencion || "—"}
                      {b.redimido_el && (
                        <p className="text-xs text-brand-dark/50">
                          {new Date(b.redimido_el).toLocaleString("es-CO")}
                        </p>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-xs">
                      {new Date(b.creado_el).toLocaleDateString("es-CO")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
