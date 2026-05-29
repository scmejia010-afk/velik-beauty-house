import { useState } from "react"
import { X, ShoppingBag } from "lucide-react"

export type ProductCategory = "Hydrate" | "Glow" | "Amplify" | "Replenish" | "All Hair Types" | "Beyond The Hair" | "Styling";

export type ProductSize = {
  size: string;
  price: string;
};

export type Product = {
  title: string;
  category: ProductCategory;
  desc: string;
  image: string;
  sizes: ProductSize[];
}

const products: Product[] = [
  {
    "title": "Replenish Shampoo",
    "category": "Replenish",
    "desc": "Producto de la línea Replenish de Authentic Beauty Concept.",
    "image": "/productos/replenish-shampoo.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 140.990"
      }
    ]
  },
  {
    "title": "Replenish Acondicionador",
    "category": "Replenish",
    "desc": "Producto de la línea Replenish de Authentic Beauty Concept.",
    "image": "/productos/replenish-acondicionador.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 184.990"
      }
    ]
  },
  {
    "title": "Replenish Acondicionador Spray",
    "category": "Replenish",
    "desc": "Producto de la línea Replenish de Authentic Beauty Concept.",
    "image": "/productos/replenish-acondicionador-spray.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 172.990"
      }
    ]
  },
  {
    "title": "Replenish Rich Mascarilla",
    "category": "Replenish",
    "desc": "Producto de la línea Replenish de Authentic Beauty Concept.",
    "image": "/productos/replenish-rich-mascarilla.png",
    "sizes": [
      {
        "size": "200ml",
        "price": "$ 232.990"
      }
    ]
  },
  {
    "title": "Replenish Light Mascarilla",
    "category": "Replenish",
    "desc": "Producto de la línea Replenish de Authentic Beauty Concept.",
    "image": "/productos/replenish-light-mascarilla.png",
    "sizes": [
      {
        "size": "200ml",
        "price": "$ 232.990"
      }
    ]
  },
  {
    "title": "Amplify Shampoo",
    "category": "Amplify",
    "desc": "Producto de la línea Amplify de Authentic Beauty Concept.",
    "image": "/productos/amplify-shampoo.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 140.990"
      }
    ]
  },
  {
    "title": "Amplify Acondicionador",
    "category": "Amplify",
    "desc": "Producto de la línea Amplify de Authentic Beauty Concept.",
    "image": "/productos/amplify-acondicionador.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 184.990"
      }
    ]
  },
  {
    "title": "Amplify Acondicionador Spray",
    "category": "Amplify",
    "desc": "Producto de la línea Amplify de Authentic Beauty Concept.",
    "image": "/productos/amplify-acondicionador-spray.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 172.990"
      }
    ]
  },
  {
    "title": "Glow Shampoo",
    "category": "Glow",
    "desc": "Producto de la línea Glow de Authentic Beauty Concept.",
    "image": "/productos/glow-shampoo.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 140.990"
      }
    ]
  },
  {
    "title": "Glow Acondicionador",
    "category": "Glow",
    "desc": "Producto de la línea Glow de Authentic Beauty Concept.",
    "image": "/productos/glow-acondicionador.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 184.990"
      }
    ]
  },
  {
    "title": "Glow Mascarilla",
    "category": "Glow",
    "desc": "Producto de la línea Glow de Authentic Beauty Concept.",
    "image": "/productos/glow-mascarilla.png",
    "sizes": [
      {
        "size": "200ml",
        "price": "$ 232.990"
      }
    ]
  },
  {
    "title": "Glow Cool Cleanser",
    "category": "Glow",
    "desc": "Producto de la línea Glow de Authentic Beauty Concept.",
    "image": "/productos/glow-cool-cleanser.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 140.990"
      }
    ]
  },
  {
    "title": "Glow Sprayable Serum",
    "category": "Glow",
    "desc": "Producto de la línea Glow de Authentic Beauty Concept.",
    "image": "/productos/glow-sprayable-serum.png",
    "sizes": [
      {
        "size": "200ml",
        "price": "$ 193.990"
      }
    ]
  },
  {
    "title": "Hydrate Shampoo",
    "category": "Hydrate",
    "desc": "Producto de la línea Hydrate de Authentic Beauty Concept.",
    "image": "/productos/hydrate-champu.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 140.990"
      }
    ]
  },
  {
    "title": "Hydrate Acondicionador",
    "category": "Hydrate",
    "desc": "Producto de la línea Hydrate de Authentic Beauty Concept.",
    "image": "/productos/hydrate-acondicionador.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 184.990"
      }
    ]
  },
  {
    "title": "Hydrate Acondicionador Spray",
    "category": "Hydrate",
    "desc": "Producto de la línea Hydrate de Authentic Beauty Concept.",
    "image": "/productos/hydrate-spray.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 172.990"
      }
    ]
  },
  {
    "title": "Hydrate Mascarilla",
    "category": "Hydrate",
    "desc": "Producto de la línea Hydrate de Authentic Beauty Concept.",
    "image": "/productos/hydrate-tratamiento.png",
    "sizes": [
      {
        "size": "200ml",
        "price": "$ 232.990"
      }
    ]
  },
  {
    "title": "Hydrate Lotion",
    "category": "Hydrate",
    "desc": "Producto de la línea Hydrate de Authentic Beauty Concept.",
    "image": "/productos/hydrate-locion.png",
    "sizes": [
      {
        "size": "150ml",
        "price": "$ 180.990"
      }
    ]
  },
  {
    "title": "Hydrate Smoothing Serum",
    "category": "Hydrate",
    "desc": "Producto de la línea Hydrate de Authentic Beauty Concept.",
    "image": "/productos/hydrate-serum.png",
    "sizes": [
      {
        "size": "100ml",
        "price": "$ 195.990"
      }
    ]
  },
  {
    "title": "Hydrate Curl Enhancer",
    "category": "Hydrate",
    "desc": "Producto de la línea Hydrate de Authentic Beauty Concept.",
    "image": "/productos/hydrate-curl.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 180.990"
      }
    ]
  },
  {
    "title": "Hydrate Intense Treatment",
    "category": "Hydrate",
    "desc": "Producto de la línea Hydrate de Authentic Beauty Concept.",
    "image": "/productos/hydrate-intensivo.png",
    "sizes": [
      {
        "size": "200ml",
        "price": "$ 232.990"
      }
    ]
  },
  {
    "title": "Deep Cleansing Shampoo",
    "category": "All Hair Types",
    "desc": "Producto de Authentic Beauty Concept.",
    "image": "/productos/all-hair-deep-cleansing.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 140.990"
      }
    ]
  },
  {
    "title": "Indulging Fluid Oil",
    "category": "All Hair Types",
    "desc": "Producto de Authentic Beauty Concept.",
    "image": "/productos/indulging-fluid-oil.png",
    "sizes": [
      {
        "size": "100ml",
        "price": "$ 193.990"
      }
    ]
  },
  {
    "title": "Bare Cleanser",
    "category": "All Hair Types",
    "desc": "Producto de Authentic Beauty Concept.",
    "image": "/productos/bare-cleanser.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 140.990"
      }
    ]
  },
  {
    "title": "Jelly Mask",
    "category": "All Hair Types",
    "desc": "Producto de Authentic Beauty Concept.",
    "image": "/productos/jelly-mask.png",
    "sizes": [
      {
        "size": "200ml",
        "price": "$ 204.990"
      }
    ]
  },
  {
    "title": "Eau de Toilette",
    "category": "Beyond The Hair",
    "desc": "Producto de Authentic Beauty Concept.",
    "image": "/productos/beyond-eau-de-toilette.png",
    "sizes": [
      {
        "size": "50ml",
        "price": "$ 195.990"
      }
    ]
  },
  {
    "title": "Hand & Hair Light Cream",
    "category": "Beyond The Hair",
    "desc": "Producto de Authentic Beauty Concept.",
    "image": "/productos/beyond-hand-cream.png",
    "sizes": [
      {
        "size": "75ml",
        "price": "$ 86.990"
      }
    ]
  },
  {
    "title": "Enhancing Water",
    "category": "Beyond The Hair",
    "desc": "Producto de Authentic Beauty Concept.",
    "image": "/productos/beyond-enhancing-water.png",
    "sizes": [
      {
        "size": "100ml",
        "price": "$ 114.990"
      }
    ]
  },
  {
    "title": "Sensorial Cream Scrub",
    "category": "Beyond The Hair",
    "desc": "Producto de Authentic Beauty Concept.",
    "image": "/productos/sensorial-cream-scrub.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 171.990"
      }
    ]
  },
  {
    "title": "Amplify Mousse",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/amplify-mousse.png",
    "sizes": [
      {
        "size": "200ml",
        "price": "$ 144.990"
      }
    ]
  },
  {
    "title": "Flawless Primer",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/all-hair-flawless-primer.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 164.990"
      }
    ]
  },
  {
    "title": "Shaping Cream",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/shaping-cream.png",
    "sizes": [
      {
        "size": "150ml",
        "price": "$ 180.990"
      }
    ]
  },
  {
    "title": "Gritty Wax Paste",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/gritty-wax-paste.png",
    "sizes": [
      {
        "size": "85ml",
        "price": "$ 143.990"
      }
    ]
  },
  {
    "title": "Solid Pomade",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/all-hair-solid-pomade.png",
    "sizes": [
      {
        "size": "85ml",
        "price": "$ 143.990"
      }
    ]
  },
  {
    "title": "Pliable Styling Paste",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/pliable-styling-paste.png",
    "sizes": [
      {
        "size": "85ml",
        "price": "$ 143.990"
      }
    ]
  },
  {
    "title": "Working HairSpray",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/all-hair-working-hairspray.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 125.990"
      }
    ]
  },
  {
    "title": "Strong Hold Spray",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/strong-hold-spray.png",
    "sizes": [
      {
        "size": "100ml",
        "price": "$ 51.990"
      },
      {
        "size": "300ml",
        "price": "$ 125.990"
      }
    ]
  },
  {
    "title": "Airy Texture Spray",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/airy-texture-spray.png",
    "sizes": [
      {
        "size": "300ml",
        "price": "$ 125.990"
      }
    ]
  },
  {
    "title": "Dry Shampoo",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/dry-shampoo.png",
    "sizes": [
      {
        "size": "100ml",
        "price": "$ 51.990"
      },
      {
        "size": "250ml",
        "price": "$ 129.990"
      }
    ]
  },
  {
    "title": "Nude Powder SPR",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/nude-powder-spr.png",
    "sizes": [
      {
        "size": "12g",
        "price": "$ 166.990"
      }
    ]
  },
  {
    "title": "Nymph Salt Spray",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/nymph-salt-spray.png",
    "sizes": [
      {
        "size": "250ml",
        "price": "$ 164.990"
      }
    ]
  },
  {
    "title": "Cosmic Blow-Dry Jelly",
    "category": "Styling",
    "desc": "Producto de la línea Styling de Authentic Beauty Concept.",
    "image": "/productos/cosmic-blow-dry-jelly.png",
    "sizes": [
      {
        "size": "150ml",
        "price": "$ 180.990"
      }
    ]
  }
];

const categories = ["Todas", "Hydrate", "Glow", "Amplify", "Replenish", "All Hair Types", "Beyond The Hair", "Styling"];

export function ProductsGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart")

  const handleBuyClick = (product: Product) => {
    setCheckoutProduct(product)
    setSelectedSize(product.sizes[0] || null)
    setCheckoutStep("cart")
  }

  // Determine which categories to display based on the selected filter
  const displayCategories = selectedCategory === "Todas" 
    ? categories.filter(c => c !== "Todas")
    : [selectedCategory];

  return (
    <section id="products" className="w-full bg-brand-white">
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

      {/* Filters (Sticky & Horizontally Scrollable) */}
      <div className="sticky top-0 md:top-[80px] z-30 bg-brand-white/95 backdrop-blur-md py-4 mb-12 border-b border-brand-light">
        <div className="flex items-center justify-between gap-6">
          <div className="flex overflow-x-auto gap-3 pb-2 w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 font-sans shrink-0 ${
                  selectedCategory === cat 
                    ? "bg-brand-dark text-brand-nude shadow-xl scale-105" 
                    : "bg-brand-light text-brand-dark hover:bg-[#DCC7B2]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grouped Product Grid */}
      <div className="space-y-20">
        {displayCategories.map(categoryName => {
          const catProducts = products.filter(p => p.category === categoryName);
          if (catProducts.length === 0) return null;

          return (
            <div key={categoryName} className="animate-in fade-in duration-500">
              {selectedCategory === "Todas" && (
                <div className="mb-8 border-b border-brand-light pb-4">
                  <h3 className="text-3xl font-serif text-brand-dark">{categoryName}</h3>
                  <p className="text-sm font-sans text-brand-dark/60 mt-1">{catProducts.length} productos</p>
                </div>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {catProducts.map((product, i) => (
                  <div
                    key={product.title + i}
                    className="group relative flex flex-col cursor-pointer bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500 border border-brand-dark/5"
                    onClick={() => handleBuyClick(product)}
                  >
                    <div className="aspect-square overflow-hidden rounded-2xl relative bg-brand-light/40 mb-6 flex items-center justify-center p-4">
                      {/* Default Image */}
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-md"
                      />
                      
                      {/* Sizes Label */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="absolute top-2 left-2 bg-brand-white/90 backdrop-blur text-brand-dark rounded-full px-3 py-1 shadow-sm z-10 transition-transform duration-500 group-hover:scale-105">
                          <span className="text-[10px] font-bold uppercase tracking-widest font-sans">
                            {product.sizes.length > 1 ? "Varios Tamaños" : product.sizes[0].size}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-accent mb-2">{product.category}</p>
                      <h3 className="text-2xl font-serif tracking-tight text-brand-dark transition-colors duration-300 group-hover:text-brand-gold line-clamp-1">{product.title}</h3>
                      <p className="text-xl font-sans font-semibold text-brand-dark mt-2 mb-4">
                        {product.sizes[0]?.price} {product.sizes.length > 1 && <span className="text-sm font-normal text-brand-dark/60 italic font-serif">desde</span>}
                      </p>
                      
                      {/* Gradient Border Button */}
                      <div className="mt-auto pt-4">
                        <div className="relative p-[2px] rounded-full overflow-hidden group/btn bg-gradient-to-r from-[#DCC7B2] via-[#E6D5C3] to-[#DCC7B2] bg-[length:200%_auto] bg-[0%] hover:bg-[100%] transition-all duration-700">
                          <div className="relative bg-brand-white rounded-full py-3 px-6 flex items-center justify-center gap-2 group-hover/btn:bg-brand-light transition-colors">
                            <ShoppingBag className="w-4 h-4 text-brand-dark" />
                            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark font-sans">Añadir al Carrito</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
                    <img src={checkoutProduct.image} alt={checkoutProduct.title} className="w-20 h-20 object-cover rounded-2xl bg-white" />
                    <div>
                      <p className="text-[10px] font-accent text-brand-gold uppercase tracking-widest">{checkoutProduct.category}</p>
                      <p className="font-serif text-xl text-brand-dark line-clamp-1">{checkoutProduct.title}</p>
                      <p className="text-xl font-bold font-sans text-brand-dark mt-1">{selectedSize?.price || "Por definir"}</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    {checkoutProduct.sizes.length > 1 && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 mb-2 font-sans">Selecciona el Tamaño</label>
                        <select 
                          className="w-full bg-brand-light border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-gold outline-none font-sans"
                          value={selectedSize?.size || ""}
                          onChange={(e) => setSelectedSize(checkoutProduct.sizes.find(s => s.size === e.target.value) || null)}
                        >
                          {checkoutProduct.sizes.map(s => (
                            <option key={s.size} value={s.size}>{s.size} - {s.price}</option>
                          ))}
                        </select>
                      </div>
                    )}
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
                    Pagar {selectedSize?.price || "Por definir"}
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
      </div>
    </section>
  )
}
