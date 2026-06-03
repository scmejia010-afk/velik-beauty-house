import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Package } from "lucide-react";

type InventarioItem = {
  id: string;
  producto_nombre: string;
  talla: string;
  stock: number;
};

export function Inventario() {
  const [items, setItems] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchInventario = async () => {
    const { data } = await supabase
      .from('inventario')
      .select('*')
      .order('producto_nombre', { ascending: true });
    
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const updateStock = async (id: string, newStock: number) => {
    setSavingId(id);
    const { error } = await supabase
      .from('inventario')
      .update({ stock: newStock })
      .eq('id', id);
    
    if (!error) {
      setItems(items.map(i => i.id === id ? { ...i, stock: newStock } : i));
    } else {
      alert("Error actualizando stock");
    }
    setSavingId(null);
  };

  if (loading) return <div>Cargando inventario...</div>;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-brand-light rounded-xl">
          <Package className="w-6 h-6 text-brand-dark" />
        </div>
        <h1 className="text-2xl font-serif text-brand-dark">Control de Inventario</h1>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-brand-light text-brand-dark/60 uppercase tracking-widest text-[10px]">
              <th className="pb-4 font-bold">Producto</th>
              <th className="pb-4 font-bold">Tamaño / Talla</th>
              <th className="pb-4 font-bold">Unidades Disponibles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light">
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-brand-dark/60">No hay productos en el inventario.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="text-brand-dark">
                  <td className="py-4 pr-4 font-bold">{item.producto_nombre}</td>
                  <td className="py-4 pr-4">{item.talla}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        value={item.stock}
                        onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                        className="w-24 bg-brand-light border-none rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-gold"
                      />
                      {savingId === item.id && <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Guardado</span>}
                    </div>
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
