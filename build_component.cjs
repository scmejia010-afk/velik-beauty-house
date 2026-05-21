const fs = require('fs');

const productsJson = fs.readFileSync('parsed_products.json', 'utf-8');

const componentCode = `import { useState } from "react"
import { X, ShoppingBag } from "lucide-react"

export type ProductCategory = "Hydrate" | "Glow" | "Amplify" | "Replenish" | "Bare" | "Tratamientos" | "Accesorios";

export type Product = {
  title: string;
  category: ProductCategory;
  price: string;
  desc: string;
  size: string;
  image: string;
  hoverImage: string;
}

const products: Product[] = ${productsJson};

const categories = ["Todas", "Hydrate", "Glow", "Amplify", "Replenish", "Bare", "Tratamientos", "Accesorios"];

export function ProductsGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart")

  const handleBuyClick = (product: Product) => {
    setCheckoutProduct(product)
    setCheckoutStep("cart")
  }

  const filteredProducts = selectedCategory === "Todas" 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-brand-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-gold font-accent">Tienda Oficial</p>
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-[0.9] text-brand-dark">
            Nuestros <br />
            <span className="italic text-brand-gold">Productos.</span>
          </h2>
        </div>
        <p className="text-brand-dark/70 max-w-xs font-medium font-sans">
          Lleva la experiencia Velik a casa con nuestros productos premium seleccionados de Authentic Beauty Concept.
        </p>
      </div>

      {/* Filters & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={\`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 font-sans \${
                selectedCategory === cat 
                  ? "bg-brand-dark text-brand-nude shadow-xl scale-105" 
                  : "bg-brand-light text-brand-dark hover:bg-[#DCC7B2]/30"
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-sm font-sans text-brand-dark/60 italic">
          Mostrando <strong className="text-brand-dark">{filteredProducts.length}</strong> productos en {selectedCategory}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map((product, i) => (
          <div
            key={product.title + i}
            className="group relative flex flex-col cursor-pointer animate-in fade-in zoom-in-95 duration-500"
            style={{ animationDelay: \`\${(i % 12) * 50}ms\` }}
            onClick={() => handleBuyClick(product)}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[40px] relative bg-brand-light">
              {/* Default Image */}
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-105"
              />
              {/* Hover Image */}
              <img
                src={product.hoverImage}
                alt={\`\${product.title} alternate angle\`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 scale-95 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-brand-dark/5 group-hover:bg-transparent transition-colors duration-500" />
              
              {/* Size Label (Top Left) */}
              {product.size && product.size !== "-" && (
                <div className="absolute top-6 left-6 bg-brand-white/90 backdrop-blur text-brand-dark rounded-full px-3 py-1 shadow-sm z-10 transition-transform duration-500 group-hover:scale-110">
                  <span className="text-[10px] font-bold uppercase tracking-widest font-sans">{product.size}</span>
                </div>
              )}

              {/* Floating Price */}
              <div className="absolute top-6 right-6 bg-brand-dark text-brand-white rounded-full px-4 py-2 shadow-xl z-10 transition-transform duration-500 group-hover:scale-110">
                <span className="text-sm font-bold font-sans">{product.price}</span>
              </div>
            </div>

            <div className="mt-8 space-y-2 px-4">
              <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-accent">{product.category}</p>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif tracking-tight transition-colors duration-300 group-hover:text-brand-gold line-clamp-1">{product.title}</h3>
                <button className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:scale-110 group-hover:bg-brand-gold shrink-0 ml-4">
                  <ShoppingBag className="w-4 h-4 text-brand-white" />
                </button>
              </div>
              <p className="text-brand-dark/60 text-sm leading-relaxed transition-opacity duration-300 line-clamp-2 font-sans">{product.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Modal Overlay */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" onClick={() => setCheckoutProduct(null)} />
          
          <div className="relative bg-brand-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-light shrink-0">
              <h3 className="text-xl font-accent font-bold uppercase tracking-widest text-brand-dark">Checkout</h3>
              <button onClick={() => setCheckoutProduct(null)} className="p-2 hover:bg-brand-light rounded-full transition-colors">
                <X className="w-5 h-5 text-brand-dark" />
              </button>
            </div>

            <div className="overflow-y-auto">
              {checkoutStep === "cart" ? (
                <div className="p-6 space-y-8">
                  {/* Product Summary */}
                  <div className="flex gap-4 items-center bg-brand-light p-4 rounded-3xl">
                    <img src={checkoutProduct.image} alt={checkoutProduct.title} className="w-20 h-20 object-cover rounded-2xl" />
                    <div>
                      <p className="text-[10px] font-accent text-brand-gold uppercase tracking-widest">{checkoutProduct.category}</p>
                      <p className="font-serif text-xl text-brand-dark line-clamp-1">{checkoutProduct.title}</p>
                      <p className="text-xl font-bold font-sans text-brand-dark mt-1">{checkoutProduct.price}</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">Nombre Completo</label>
                      <input type="text" placeholder="Ej. Ana García" className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">Dirección de Envío</label>
                      <input type="text" placeholder="Ej. Calle 123 #45-67" className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">Método de Pago</label>
                      <select className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans">
                        <option>Tarjeta de Crédito / Débito</option>
                        <option>PSE</option>
                        <option>Nequi / Daviplata</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit */}
                  <button 
                    onClick={() => setCheckoutStep("success")}
                    className="w-full py-4 bg-brand-dark text-brand-nude rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#000] transition-colors font-sans"
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
                    <h3 className="text-3xl font-serif text-brand-dark mb-2">¡Pago Exitoso!</h3>
                    <p className="text-brand-dark/60 font-sans">Tu pedido de {checkoutProduct.title} está siendo procesado.</p>
                  </div>
                  <button 
                    onClick={() => setCheckoutProduct(null)}
                    className="px-8 py-3 bg-brand-light text-brand-dark rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#DCC7B2]/30 transition-colors font-sans"
                  >
                    Seguir Comprando
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
`;

fs.writeFileSync('src/components/ProductsGrid.tsx', componentCode);
console.log('Successfully wrote src/components/ProductsGrid.tsx');
