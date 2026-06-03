import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Pedido = {
  id: string;
  creado_el: string;
  nombre: string;
  correo: string;
  celular: string;
  departamento: string;
  ciudad: string;
  direccion: string;
  apartamento: string;
  producto: string;
  talla: string;
  precio: string;
  referencia_wompi: string;
  estado_envio: string;
};

export function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async () => {
    const { data } = await supabase
      .from('pedidos')
      .select('*')
      .order('creado_el', { ascending: false });
    
    if (data) setPedidos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const updateEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado_envio: nuevoEstado })
      .eq('id', id);
    
    if (!error) {
      setPedidos(pedidos.map(p => p.id === id ? { ...p, estado_envio: nuevoEstado } : p));
    } else {
      alert("Error actualizando estado");
    }
  };

  if (loading) return <div>Cargando pedidos...</div>;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <h1 className="text-2xl font-serif text-brand-dark mb-6">Gestión de Pedidos</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-brand-light text-brand-dark/60 uppercase tracking-widest text-[10px]">
              <th className="pb-4 font-bold">Fecha</th>
              <th className="pb-4 font-bold">Cliente</th>
              <th className="pb-4 font-bold">Envío</th>
              <th className="pb-4 font-bold">Producto</th>
              <th className="pb-4 font-bold">Ref. Wompi</th>
              <th className="pb-4 font-bold">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light">
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-brand-dark/60">No hay pedidos registrados.</td>
              </tr>
            ) : (
              pedidos.map((pedido) => (
                <tr key={pedido.id} className="text-brand-dark">
                  <td className="py-4 pr-4">
                    {new Date(pedido.creado_el).toLocaleDateString()}<br/>
                    <span className="text-xs text-brand-dark/50">{new Date(pedido.creado_el).toLocaleTimeString()}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-bold">{pedido.nombre}</p>
                    <p className="text-xs">{pedido.celular}</p>
                    <p className="text-xs">{pedido.correo}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p>{pedido.ciudad}, {pedido.departamento}</p>
                    <p className="text-xs">{pedido.direccion}</p>
                    <p className="text-xs">{pedido.apartamento}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-bold">{pedido.producto}</p>
                    <p className="text-xs">{pedido.talla}</p>
                    <p className="text-xs text-brand-gold">{pedido.precio}</p>
                  </td>
                  <td className="py-4 pr-4 text-xs font-mono">
                    {pedido.referencia_wompi}
                  </td>
                  <td className="py-4 pr-4">
                    <select
                      value={pedido.estado_envio || "Pendiente"}
                      onChange={(e) => updateEstado(pedido.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border outline-none ${
                        pedido.estado_envio === 'Enviado' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        pedido.estado_envio === 'Entregado' ? 'bg-green-50 text-green-600 border-green-200' :
                        'bg-yellow-50 text-yellow-600 border-yellow-200'
                      }`}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
