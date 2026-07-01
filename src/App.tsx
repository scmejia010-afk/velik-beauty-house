import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { ProductsGrid } from "@/components/ProductsGrid"
import { Philosophy } from "@/components/Philosophy"
import { FAQ } from "@/components/FAQ"
import { Reviews } from "@/components/Reviews"
import { LocationMap } from "@/components/LocationMap"
import { Footer } from "@/components/Footer"
import { BookingFlow } from "@/components/Booking/BookingFlow"
import { ServicesGrid } from "@/components/ServicesGrid"
import { Login } from "@/pages/admin/Login"
import { AdminLayout } from "@/pages/admin/AdminLayout"
import { Pedidos } from "@/pages/admin/Pedidos"
import { Inventario } from "@/pages/admin/Inventario"
import { PowerShakes as PowerShakesAdmin } from "@/pages/admin/PowerShakes"
import { ProtectedRoute } from "@/components/Admin/ProtectedRoute"
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { PowerShakes } from "@/pages/PowerShakes"

function MainSite() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductsGrid />
        <ServicesGrid />
        <Philosophy />
        <FAQ />
        <LocationMap />
        <Reviews />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/agendar" element={<BookingFlow />} />
          <Route path="/powershakes" element={<PowerShakes />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="powershakes" element={<PowerShakesAdmin />} />
          </Route>
        </Routes>
        <WhatsAppButton />
      </div>
    </Router>
  )
}

export default App
