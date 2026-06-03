import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas");
      setLoading(false);
    } else {
      navigate("/admin/pedidos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-brand-dark mb-2">Velik Admin</h1>
          <p className="text-sm text-brand-dark/60 font-sans">Inicia sesión para gestionar la tienda</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center mb-6 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-brand-dark text-brand-nude rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#000] transition-colors font-sans disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
