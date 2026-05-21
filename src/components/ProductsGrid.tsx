import { useState } from "react"
import { X, ShoppingBag } from "lucide-react"

type Product = {
  title: string
  price: string
  desc: string
  image: string
  hoverImage: string
  category: string
  size: string
}

const products: Product[] = [
  // HYDRATE
  { category: "Hydrate", title: "Champú Hydrate", size: "50ml", price: "Consultar", desc: "Champú hidratante para cabello seco y sin vida. Fórmula con ingredientes de origen vegetal.", image: "https://images.unsplash.com/photo-1631730486784-74757f8ca8ff?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Champú Hydrate", size: "300ml", price: "Consultar", desc: "Champú hidratante para cabello seco y sin vida. Fórmula con ingredientes de origen vegetal.", image: "https://images.unsplash.com/photo-1631730486784-74757f8ca8ff?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Champú Hydrate", size: "1L", price: "Consultar", desc: "Champú hidratante para cabello seco. Formato profesional 1 litro.", image: "https://images.unsplash.com/photo-1631730486784-74757f8ca8ff?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Acondicionador Hydrate", size: "250ml", price: "Consultar", desc: "Acondicionador que devuelve la suavidad y el brillo al cabello deshidratado.", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1631730486784-74757f8ca8ff?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Acondicionador Hydrate", size: "1L", price: "Consultar", desc: "Acondicionador profesional que devuelve la suavidad y el brillo. Formato 1 litro.", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1631730486784-74757f8ca8ff?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Spray Acondicionador Hydrate", size: "250ml", price: "Consultar", desc: "Spray acondicionador sin aclarado para hidratación instantánea entre lavados.", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1631730486784-74757f8ca8ff?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Tratamiento Hydrate", size: "30ml", price: "Consultar", desc: "Mascarilla de tratamiento intensivo para cabello muy seco. Tamaño viaje.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Tratamiento Hydrate", size: "200ml", price: "Consultar", desc: "Mascarilla de tratamiento intensivo para restaurar la hidratación del cabello.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Tratamiento Hydrate", size: "500ml", price: "Consultar", desc: "Mascarilla de tratamiento intensivo profesional para restaurar la hidratación.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Tratamiento Intensivo Hydrate", size: "200ml", price: "Consultar", desc: "Tratamiento intensivo especial para cabello crespo. Sella puntas y reduce el frizz.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Hydrate Loción", size: "150ml", price: "Consultar", desc: "Loción hidratante ligera para mantener el cabello suave y manejable todo el día.", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1631730486784-74757f8ca8ff?w=600&h=750&fit=crop" },
  { category: "Hydrate", title: "Sérum Suavizante Hydrate", size: "100ml", price: "Consultar", desc: "Sérum de acabado para suavizar y dar brillo sin apelmazar el cabello.", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1631730486784-74757f8ca8ff?w=600&h=750&fit=crop" },

  // GLOW
  { category: "Glow", title: "Champú Glow", size: "300ml", price: "Consultar", desc: "Champú que activa el brillo natural del cabello con ingredientes de origen vegetal.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Glow", title: "Champú Glow", size: "1L", price: "Consultar", desc: "Champú que activa el brillo natural del cabello. Formato profesional 1 litro.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Glow", title: "Champú Cool Glow", size: "300ml", price: "Consultar", desc: "Champú especial para potenciar el brillo en cabellos con color o tratados.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Glow", title: "Acondicionador Glow", size: "250ml", price: "Consultar", desc: "Acondicionador que sella la cutícula y potencia el brillo del cabello.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Glow", title: "Glow Conditioner", size: "1L", price: "Consultar", desc: "Acondicionador profesional que sella la cutícula y potencia el brillo. Formato 1 litro.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Glow", title: "Tratamiento Glow", size: "30ml", price: "Consultar", desc: "Mascarilla de tratamiento para máximo brillo. Tamaño viaje.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Glow", title: "Tratamiento Glow", size: "200ml", price: "Consultar", desc: "Mascarilla para potenciar el brillo y la suavidad del cabello.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Glow", title: "Tratamiento Glow", size: "500ml", price: "Consultar", desc: "Mascarilla profesional para potenciar el brillo y la suavidad. Formato 500ml.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Glow", title: "Glow Spray Serum", size: "200ml", price: "Consultar", desc: "Sérum en spray que aporta brillo y ligereza al cabello sin apelmazarlo.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },

  // AMPLIFY
  { category: "Amplify", title: "Champú Amplify", size: "50ml", price: "Consultar", desc: "Champú para dar volumen y cuerpo al cabello fino sin apelmazarlo.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Amplify", title: "Champú Amplify", size: "300ml", price: "Consultar", desc: "Champú para dar volumen y cuerpo al cabello fino sin apelmazarlo.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Amplify", title: "Champú Amplify", size: "1L", price: "Consultar", desc: "Champú profesional para dar volumen y cuerpo al cabello fino. Formato 1 litro.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Amplify", title: "Acondicionador Amplify", size: "1000ml", price: "Consultar", desc: "Acondicionador ligero que da cuerpo y volumen sin pesar el cabello fino.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Amplify", title: "Espuma Amplificadora", size: "200ml", price: "Consultar", desc: "Espuma de acabado para amplificar el volumen y dar movimiento al cabello.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },

  // REPLENISH
  { category: "Replenish", title: "Replenish Champú", size: "50ml", price: "Consultar", desc: "Champú nutritivo con Manteca de Karité y Agua de Arroz para cabello dañado.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Champú", size: "300ml", price: "Consultar", desc: "Champú nutritivo con Manteca de Karité y Agua de Arroz para cabello dañado.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Champú", size: "1000ml", price: "Consultar", desc: "Champú nutritivo profesional con Manteca de Karité y Agua de Arroz. Formato 1 litro.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Acondicionador", size: "250ml", price: "Consultar", desc: "Acondicionador nutritivo que sella las puntas abiertas y reduce la rotura.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Acondicionador", size: "1000ml", price: "Consultar", desc: "Acondicionador nutritivo profesional. Sella las puntas abiertas. Formato 1 litro.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Spray Acond.", size: "250ml", price: "Consultar", desc: "Spray acondicionador sin aclarado para nutrición instantánea entre lavados.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Tratamiento Light", size: "30ml", price: "Consultar", desc: "Tratamiento ligero nutritivo para cabello dañado. Tamaño viaje.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Tratamiento Light", size: "200ml", price: "Consultar", desc: "Tratamiento ligero nutritivo para cabello dañado. Sella puntas abiertas.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Tratamiento Light", size: "500ml", price: "Consultar", desc: "Tratamiento ligero nutritivo profesional para cabello dañado. Formato 500ml.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Tratamiento Rich", size: "30ml", price: "Consultar", desc: "Tratamiento rico e intensivo para cabello muy dañado. Nutrición profunda.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Tratamiento Rich", size: "200ml", price: "Consultar", desc: "Tratamiento rico e intensivo para cabello muy dañado. Nutrición profunda.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Replenish", title: "Replenish Tratamiento Rich", size: "500ml", price: "Consultar", desc: "Tratamiento rico e intensivo profesional para cabello muy dañado. Formato 500ml.", image: "https://images.unsplash.com/photo-1573461160327-3d44f57b9e6d?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },

  // BARE
  { category: "Bare", title: "Champú Bare", size: "1000ml", price: "Consultar", desc: "Champú suave con fórmula minimalista. Sin sulfatos agresivos, ideal para uso frecuente.", image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Bare", title: "Bare Cleanser", size: "300ml", price: "Consultar", desc: "Limpiador suave que purifica el cuero cabelludo sin resecar las puntas.", image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Bare", title: "Mascarilla de Gel Hidratante", size: "500ml", price: "Consultar", desc: "Mascarilla en gel de textura ligera que hidrata profundamente sin residuo.", image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Bare", title: "Champú Purificante", size: "1L", price: "Consultar", desc: "Champú purificante que elimina impurezas y el exceso de sebo del cuero cabelludo.", image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Bare", title: "Champú Deep Cleansing", size: "300ml", price: "Consultar", desc: "Champú de limpieza profunda para eliminar acumulación de productos y sebo.", image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },

  // TRATAMIENTOS
  { category: "Tratamientos", title: "Indulging Oil", size: "100ml", price: "Consultar", desc: "Aceite ligero para cabellos finos. Aporta brillo y suavidad sin apelmazar.", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Tratamientos", title: "Aceite Embellecedor", size: "100ml", price: "Consultar", desc: "Aceite embellecedor que aporta brillo, suavidad y facilita el peinado.", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Tratamientos", title: "Laca de Fijación Fuerte", size: "300ml", price: "Consultar", desc: "Laca de fijación fuerte para peinados duraderos con acabado natural.", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Tratamientos", title: "Cosmic Blow-Dry Jelly", size: "30ml", price: "Consultar", desc: "Jalea de acabado para secado con secador. Define y protege del calor.", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Tratamientos", title: "Poción Belleza", size: "50ml", price: "Consultar", desc: "Tratamiento multiusos que aporta suavidad, brillo y protección en un solo paso.", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Tratamientos", title: "Sensorial Cream Scrub", size: "250ml", price: "Consultar", desc: "Exfoliante cremoso para el cuero cabelludo que elimina impurezas y estimula la circulación.", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Tratamientos", title: "Crema para Manos y Cabello", size: "30ml", price: "Consultar", desc: "Crema multiusos para hidratar manos y dar forma al cabello al mismo tiempo.", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Tratamientos", title: "Mini Crema de Forma", size: "30ml", price: "Consultar", desc: "Crema de forma para definir y moldear el cabello con acabado natural.", image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=750&fit=crop" },
  { category: "Tratamientos", title: "Eau de Toilette", size: "50ml", price: "Consultar", desc: "Fragancia exclusiva con la esencia de la marca ABC. Perfume profesional.", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&h=750&fit=crop" },

  // ACCESORIOS
  { category: "Accesorios", title: "Aplicador Poción Belleza", size: "", price: "Consultar", desc: "Aplicador oficial para la Poción Belleza ABC. Distribución precisa del producto.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Accesorios", title: "Mandil Glow", size: "x24", price: "Consultar", desc: "Mandil profesional de la línea Glow. Pack de 24 unidades.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Accesorios", title: "Set de Tools Bol/Espátula/Paletina", size: "", price: "Consultar", desc: "Set completo de herramientas profesionales: bol mezclador, espátula y paletina.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Accesorios", title: "Toallas ABC", size: "Pack x5", price: "Consultar", desc: "Pack de 5 toallas profesionales suaves y absorbentes para uso en salón.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
  { category: "Accesorios", title: "Dosificador", size: "1000ml", price: "Consultar", desc: "Dosificador profesional para dispensar productos de litro de forma precisa.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=750&fit=crop", hoverImage: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&h=750&fit=crop" },
]

const categories = ["Todas", "Hydrate", "Glow", "Amplify", "Replenish", "Bare", "Tratamientos", "Accesorios"]

export function ProductsGrid() {
  const [activeCategory, setActiveCategory] = useState("Todas")
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart")

  const filtered = activeCategory === "Todas" ? products : products.filter(p => p.category === activeCategory)

  const handleBuyClick = (product: Product) => {
    setCheckoutProduct(product)
    setCheckoutStep("cart")
  }

  return (
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Tienda Oficial</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            Nuestros <br />
            <span className="italic font-light text-gray-400">Productos.</span>
          </h2>
        </div>
        <p className="text-gray-500 max-w-xs font-medium">
          Línea profesional ABC — Authentic Beauty Concept by Schwarzkopf.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeCategory === cat
                ? "bg-black text-white scale-105"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-400 mb-10">{filtered.length} productos</p>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((product, i) => (
          <div
            key={`${product.title}-${product.size}-${i}`}
            className="group relative flex flex-col cursor-pointer"
            style={{ animationDelay: `${i * 100}ms` }}
            onClick={() => handleBuyClick(product)}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[40px] relative bg-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-105"
              />
              <img
                src={product.hoverImage}
                alt={`${product.title} alternate`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 scale-95 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              {product.size && (
                <div className="absolute top-6 left-6 bg-white/90 text-black rounded-full px-3 py-1 shadow z-10 text-xs font-bold">
                  {product.size}
                </div>
              )}
              <div className="absolute top-6 right-6 bg-black text-white rounded-full px-4 py-2 shadow-xl z-10 transition-transform duration-500 group-hover:scale-110">
                <span className="text-sm font-bold">{product.price}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{product.category}</p>
                  <h3 className="text-xl font-bold uppercase tracking-tight transition-colors duration-300 group-hover:text-gray-500">{product.title}</h3>
                </div>
                <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:scale-110 flex-shrink-0 ml-2">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{product.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCheckoutProduct(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-black uppercase tracking-tight">Checkout</h3>
              <button onClick={() => setCheckoutProduct(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutStep === "cart" ? (
              <div className="p-6 space-y-8">
                <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-3xl">
                  <img src={checkoutProduct.image} alt={checkoutProduct.title} className="w-20 h-20 object-cover rounded-2xl" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">{checkoutProduct.category}</p>
                    <p className="font-bold uppercase text-sm">{checkoutProduct.title} {checkoutProduct.size}</p>
                    <p className="text-xl font-black mt-1">{checkoutProduct.price}</p>
                  </div>
                </div>
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
                <button
                  onClick={() => setCheckoutStep("success")}
                  className="w-full py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-gray-900 transition-colors"
                >
                  Confirmar Pedido
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
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">¡Pedido Recibido!</h3>
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
