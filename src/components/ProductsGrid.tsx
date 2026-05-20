import { useState } from "react"
import { X, ShoppingBag } from "lucide-react"

const products = [
  {
    title: "Esmaltes Semipermanentes",
    price: "$25.000",
    desc: "Colores de alta pigmentación, larga duración y brillo extremo. Ideal para profesionales.",
    image: "/products/esmaltes.png",
    hoverImage: "https://images.unsplash.com/photo-1604654894610-df490998570e?w=600&h=600&fit=crop",
  },
  {
    title: "Aceite de Cutículas Velik",
    price: "$18.000",
    desc: "Hidratación profunda con vitamina E y aceites esenciales para uñas más sanas y fuertes.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop",
  },
  {
    title: "Kit Keratina en Casa",
    price: "$120.000",
    desc: "Tratamiento intensivo para alisar, reparar e hidratar tu cabello desde la comodidad de tu hogar.",
    image: "/products/keratina.png",
    hoverImage: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=600&fit=crop",
  },
  {
    title: "Set Pinceles Nail Art",
    price: "$45.000",
    desc: "Pinceles de ultra precisión para crear diseños increíbles. Incluye liners y brochas planas.",
    image: "/products/pinceles.png",
    hoverImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop",
  },
  {
    title: "Mascarilla Facial Glow",
    price: "$35.000",
    desc: "Fórmula antioxidante que ilumina y revitaliza el rostro cansado en solo 15 minutos.",
    image: "/products/mascarilla.png",
    hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=600&fit=crop",
  },
  {
    title: "Lámpara LED UV 48W",
    price: "$85.000",
    desc: "Secado ultrarrápido para cualquier sistema de uñas. Temporizador inteligente y sensor de movimiento.",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=600&fit=crop", // Safe fallback
  },
]

export function ProductsGrid() {
  const [checkoutProduct, setCheckoutProduct] = useState<typeof products[0] | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart")

  const handleBuyClick = (product: typeof products[0]) => {
    setCheckoutProduct(product)
    setCheckoutStep("cart")
  }

  return (
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Tienda Oficial</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Nuestros <br />
            <span className="italic font-light text-gray-400">Productos.</span>
          </h2>
        </div>
        <p className="text-gray-500 max-w-xs font-medium">
          Lleva la experiencia Velik a casa con nuestros productos premium seleccionados.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product, i) => (
          <div
            key={product.title}
            className="group relative flex flex-col cursor-pointer"
            style={{ animationDelay: `${i * 100}ms` }}
            onClick={() => handleBuyClick(product)}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[40px] relative bg-gray-100">
              {/* Default Image */}
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-105"
              />
              {/* Hover Image */}
              <img
                src={product.hoverImage}
                alt={`${product.title} alternate angle`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 scale-95 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              {/* Floating Price */}
              <div className="absolute top-6 right-6 bg-black text-white rounded-full px-4 py-2 shadow-xl z-10 transition-transform duration-500 group-hover:scale-110">
                <span className="text-sm font-bold">{product.price}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3 px-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold uppercase tracking-tight transition-colors duration-300 group-hover:text-gray-500">{product.title}</h3>
                <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:scale-110">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed transition-opacity duration-300">{product.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <a
          href="#products"
          className="inline-block px-10 py-5 rounded-full bg-black text-white text-sm uppercase tracking-[0.2em] font-black hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Ver Catálogo Completo →
        </a>
      </div>

      {/* Checkout Modal Overlay */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCheckoutProduct(null)} />
          
          <div className="relative bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-black uppercase tracking-tight">Checkout</h3>
              <button onClick={() => setCheckoutProduct(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutStep === "cart" ? (
              <div className="p-6 space-y-8">
                {/* Product Summary */}
                <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-3xl">
                  <img src={checkoutProduct.image} alt={checkoutProduct.title} className="w-20 h-20 object-cover rounded-2xl" />
                  <div>
                    <p className="font-bold uppercase text-sm">{checkoutProduct.title}</p>
                    <p className="text-xl font-black mt-1">{checkoutProduct.price}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre Completo</label>
                    <input type="text" placeholder="Ej. Ana García" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Dirección de Envío</label>
                    <input type="text" placeholder="Ej. Calle 123 #45-67" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Método de Pago</label>
                    <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none">
                      <option>Tarjeta de Crédito / Débito</option>
                      <option>PSE</option>
                      <option>Nequi / Daviplata</option>
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <button 
                  onClick={() => setCheckoutStep("success")}
                  className="w-full py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors"
                >
                  Pagar {checkoutProduct.price}
                </button>
              </div>
            ) : (
              <div className="p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">¡Pago Exitoso!</h3>
                  <p className="text-gray-500">Tu pedido de {checkoutProduct.title} está siendo procesado.</p>
                </div>
                <button 
                  onClick={() => setCheckoutProduct(null)}
                  className="px-8 py-3 bg-gray-100 text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
