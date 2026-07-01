import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { LayoutDashboard, Package, LogOut, Gift } from "lucide-react";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Pedidos", path: "/admin/pedidos", icon: LayoutDashboard },
    { name: "Inventario", path: "/admin/inventario", icon: Package },
    { name: "PowerShakes", path: "/admin/powershakes", icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-brand-nude flex flex-col hidden md:flex">
        <div className="p-8">
          <h2 className="text-2xl font-serif text-brand-gold">Velik Admin</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? "bg-brand-gold text-brand-dark font-bold" : "hover:bg-brand-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-sans uppercase tracking-widest text-xs">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-brand-white/10 transition-colors text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-sans uppercase tracking-widest text-xs">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-brand-dark text-brand-gold p-4 flex justify-between items-center">
          <h2 className="text-xl font-serif">Velik Admin</h2>
          <button onClick={handleLogout} className="text-red-400 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden bg-brand-dark p-2 flex gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest whitespace-nowrap ${
                  isActive ? "bg-brand-gold text-brand-dark font-bold" : "text-brand-nude border border-brand-white/20"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
