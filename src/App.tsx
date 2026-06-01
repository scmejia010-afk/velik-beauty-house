import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { ProductsGrid } from "@/components/ProductsGrid"
import { Philosophy } from "@/components/Philosophy"
import { FAQ } from "@/components/FAQ"
import { NailCareGuide } from "@/components/NailCareGuide"
import { Footer } from "@/components/Footer"
import { BookingFlow } from "@/components/Booking/BookingFlow"
import { ServicesGrid } from "@/components/ServicesGrid"

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
        <NailCareGuide />
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
        </Routes>
      </div>
    </Router>
  )
}

export default App
