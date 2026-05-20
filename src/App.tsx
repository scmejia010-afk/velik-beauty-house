import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { ProductsGrid } from "@/components/ProductsGrid"
import { Membership } from "@/components/Membership"
import { GalleryCarousel } from "@/components/GalleryCarousel"
import { Philosophy } from "@/components/Philosophy"
import { FAQ } from "@/components/FAQ"
import { NailCareGuide } from "@/components/NailCareGuide"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <ProductsGrid />
        <Membership />
        <GalleryCarousel />
        <Philosophy />
        <FAQ />
        <NailCareGuide />
      </main>
      <Footer />
    </div>
  )
}

export default App
