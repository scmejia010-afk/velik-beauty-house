export interface Servicio {
  nombre: string
  calendarId: string
  duracion: number
  precio: string
}

export interface Profesional {
  nombre: string
  userId: string
  especialidad: string
  iniciales: string
}

export const CATEGORIAS = [
  "Manicure", "Pedicure", "Manicura y Pedicura",
  "Cabello", "Cejas y Pestañas", "Depilación",
  "Maquillaje Profesional", "Corporal",
]

export const SERVICIOS: Record<string, Servicio[]> = {
  "Manicure": [
    { nombre: "Manos Semipermanente", calendarId: "EDiqwAb54xY6nID5yzB8", duracion: 60, precio: "$60.000" },
    { nombre: "Manos Tradicional", calendarId: "ItIbYfgFYYvZYQ6Oje0B", duracion: 45, precio: "$45.000" },
    { nombre: "Manos Evolution", calendarId: "uyBy6KxStea3tyJXkxvE", duracion: 45, precio: "$45.000" },
    { nombre: "Builder Gel", calendarId: "58aCvkqxbMBcFFPgZmyk", duracion: 120, precio: "$120.000" },
    { nombre: "Baby Boomer", calendarId: "HhrSGv6kTKZOtLwLtLaO", duracion: 170, precio: "$170.000" },
    { nombre: "Base Rubber Manos", calendarId: "yVTJ5MuqOiTIG6aW4Zzu", duracion: 60, precio: "$60.000" },
    { nombre: "Uñas Esculpidas Polygel/Acrílico", calendarId: "5FzBoBw7GCdwViMPesPC", duracion: 150, precio: "$150.000" },
    { nombre: "Recubrimiento Polygel/Acrílico", calendarId: "MmI8fIlxThj3dg3qXB5E", duracion: 150, precio: "$150.000" },
    { nombre: "Retoque Esculpidas Polygel/Acrílico", calendarId: "JuHPG8vMNXKSOiyVNzjR", duracion: 110, precio: "$110.000" },
    { nombre: "Retoque Recubrimiento Poly/Acrílico", calendarId: "g7a3uGcoBdAdrffowsY1", duracion: 100, precio: "$100.000" },
    { nombre: "Uñas Dip Powder + Semipermanente", calendarId: "DIDIge2ItuyDQU3hfjqA", duracion: 70, precio: "$70.000" },
    { nombre: "Uñas Press On", calendarId: "CwNB6YUweNhSrYOTFElB", duracion: 90, precio: "$90.000" },
    { nombre: "Retoque Press On", calendarId: "rSP0C1qAAvA82qSGwSsz", duracion: 80, precio: "$80.000" },
    { nombre: "Esmaltado Semipermanente Manos", calendarId: "UdfCTzTMPNhYuemDnWsb", duracion: 20, precio: "$20.000" },
    { nombre: "Esmaltado Tradicional Manos", calendarId: "54RoAHSPDVzWjfk4N2cR", duracion: 30, precio: "$30.000" },
    { nombre: "Retiro Semipermanente Manos", calendarId: "CUY39YrfaRmiHvMdGTol", duracion: 15, precio: "$15.000" },
    { nombre: "Retiro Rubber/Dipping", calendarId: "KDdZgv19rQYsaxXNeIMB", duracion: 20, precio: "$20.000" },
    { nombre: "Retiro Polygel/Acrílico", calendarId: "NbDO7tF3rTsVlsNAqweR", duracion: 30, precio: "$30.000" },
    { nombre: "Limpieza Manos", calendarId: "yENMASOfLO8JTFgjW23z", duracion: 30, precio: "$30.000" },
    { nombre: "Masaje Relajante de Manos", calendarId: "74JOMcKwGJTEqfgqo2Ra", duracion: 7, precio: "$7.000" },
    { nombre: "Diseño", calendarId: "ZIeJPQLAeo3bM3tLDL8z", duracion: 10, precio: "$10.000" },
    { nombre: "Garantías", calendarId: "Oi2Dn1v3MpIR3wn06LyY", duracion: 30, precio: "$0" },
  ],
  "Pedicure": [
    { nombre: "Pies Semipermanente", calendarId: "szaDqVWMTKAFCVcYjgTh", duracion: 60, precio: "$60.000" },
    { nombre: "Pedicura Tradicional + Pedi Spa", calendarId: "MPv75km6l8sal1NKHqtV", duracion: 60, precio: "$60.000" },
    { nombre: "Pedicura Semi + Pedi Spa", calendarId: "1OpkJJuQoNlATF5hd9Zi", duracion: 70, precio: "$70.000" },
    { nombre: "Pies Evolution", calendarId: "tKn5Hy3A7pKqg7nhVpgC", duracion: 40, precio: "$40.000" },
    { nombre: "Tradicional Pies", calendarId: "XbxF4HF4VH3KNB16sNBU", duracion: 45, precio: "$45.000" },
    { nombre: "Retiro Semipermanente Pies", calendarId: "FJDuHD0L2DqBLPUeYsqM", duracion: 20, precio: "$20.000" },
    { nombre: "Solo Limpieza Pies", calendarId: "rcuBG3bPRNwG11VFqgH2", duracion: 30, precio: "$30.000" },
  ],
  "Manicura y Pedicura": [
    { nombre: "Uñas Semipermanente (Manos y Pies)", calendarId: "0jYIRtI8bl33hIyhVJC1", duracion: 90, precio: "$90.000" },
    { nombre: "Manos Semipermanentes y Pies Tradicional", calendarId: "xpyrWObNXPeV2kMJtlIy", duracion: 120, precio: "$120.000" },
    { nombre: "Manos Evolution y Pies Semipermanentes", calendarId: "zfKlMG4wsoLWam1yRQCl", duracion: 100, precio: "$100.000" },
    { nombre: "Uñas Esmaltado Tradicional (Manos y Pies)", calendarId: "OYVNrcCxrbSYEd1SbV3f", duracion: 100, precio: "$100.000" },
    { nombre: "Manos Semipermanente y Pies Evo", calendarId: "z6VLaBzxm2hxO4JglzOI", duracion: 120, precio: "$120.000" },
    { nombre: "Evolution (Manos y Pies)", calendarId: "ZLEVvENlOAsJdUVyyLGf", duracion: 80, precio: "$80.000" },
    { nombre: "Manos Tradicionales + Pies Semipermanente", calendarId: "iAOrgphopFSqRQt5dxTm", duracion: 120, precio: "$120.000" },
    { nombre: "Solo Limpieza Manos y Pies", calendarId: "FMTaDks9JBTh1hXZ9k2U", duracion: 60, precio: "$60.000" },
    { nombre: "Retiro Semipermanente Manos y Pies", calendarId: "fcpxmqMktM3vzoyrhumR", duracion: 30, precio: "$30.000" },
  ],
  "Cabello": [
    { nombre: "Alisado Natural Argán y Coco (Corto)", calendarId: "tYgB9RKWsWnAY6yzHbzo", duracion: 300, precio: "$300.000" },
    { nombre: "Alisado Natural Argán y Coco (Medio)", calendarId: "YsyBC5BKtrnN8YQYRDBm", duracion: 300, precio: "$300.000" },
    { nombre: "Alisado Natural Argán y/o Coco Largo", calendarId: "aO1pbT4UQDyqLJwXnPqX", duracion: 300, precio: "$300.000" },
    { nombre: "Alisado Natural Argán y/o Coco Extra Largo", calendarId: "NFFYkmfD3gwaVACAOBxq", duracion: 300, precio: "$300.000" },
    { nombre: "Color Cabello Corto", calendarId: "tdu7sEKcoUaJGN6TS5dR", duracion: 60, precio: "$60.000" },
    { nombre: "Color Cabello Medio", calendarId: "XEmC3LZdNFLzri44z5fe", duracion: 60, precio: "$60.000" },
    { nombre: "Color Cabello Largo", calendarId: "SZnHg7E8gOsBB0CxxpAk", duracion: 90, precio: "$90.000" },
    { nombre: "Color Cabello Extra Largo", calendarId: "HXfDgBJXCdD5xD7rqgmW", duracion: 90, precio: "$90.000" },
    { nombre: "Cepillado Cabello Corto", calendarId: "AFzeRInudMfQvytS7rYI", duracion: 30, precio: "$30.000" },
    { nombre: "Cepillado Cabello Medio", calendarId: "BhjqV08NlQwTyAer5Rah", duracion: 40, precio: "$40.000" },
    { nombre: "Cepillado Cabello Largo", calendarId: "zxVN8YcfF9nQh3uOhLcD", duracion: 45, precio: "$45.000" },
    { nombre: "Cepillado Cabello Extralargo", calendarId: "IM2RYaBSfWNytuAmACml", duracion: 60, precio: "$60.000" },
    { nombre: "Planchado de Cabello", calendarId: "eSmQWFTgnrsIhICBidoF", duracion: 40, precio: "$40.000" },
    { nombre: "Ondas", calendarId: "pyw2lCLu7OmMz5i1Xj0i", duracion: 45, precio: "$45.000" },
    { nombre: "Corte en Capas", calendarId: "cYESJstUsKOBcrKLfI61", duracion: 35, precio: "$35.000" },
    { nombre: "Corte de Puntas", calendarId: "4aMo5CLViO46g2Q6jnip", duracion: 30, precio: "$30.000" },
    { nombre: "Corte Caballero", calendarId: "6V88WbxYuumHKt5RBfGO", duracion: 30, precio: "$30.000" },
    { nombre: "Terapia Capilar de L'Oréal", calendarId: "gJhd4efPJ7Zs7Ogybq95", duracion: 20, precio: "$20.000" },
    { nombre: "Toxina Botulínica", calendarId: "7G42EdlizK39sGWSRTWO", duracion: 20, precio: "$20.000" },
  ],
  "Cejas y Pestañas": [
    { nombre: "Lifting de Pestañas", calendarId: "Z7WKPMSF94iQoA8Mf9ne", duracion: 60, precio: "$60.000" },
    { nombre: "Laminado de Cejas", calendarId: "JGZXM08wqm28dl4qfp9T", duracion: 50, precio: "$50.000" },
    { nombre: "Laminado de Cejas y Lifting de Pestañas", calendarId: "KuZ6tseSF1WIC3wmAwGj", duracion: 70, precio: "$70.000" },
    { nombre: "Extensión de Pestañas Efecto Clásica", calendarId: "dry2VkC24zeouSdN4VEm", duracion: 70, precio: "$70.000" },
    { nombre: "Extensión de Pestañas Efecto Híbrido", calendarId: "dbxPJAla6tTHNv73eo1l", duracion: 90, precio: "$90.000" },
    { nombre: "Extensión de Pestañas Efecto Tecnológico", calendarId: "4O1RVMdKaXEUaHqQqVP1", duracion: 90, precio: "$90.000" },
    { nombre: "Retoque Pestañas", calendarId: "yuikssBrbkVHsArQoe65", duracion: 60, precio: "$60.000" },
    { nombre: "Pestañas Punto a Punto", calendarId: "zT9oLreL1DCiwWDmO1Dx", duracion: 45, precio: "$45.000" },
    { nombre: "Depilación de Cejas con Cera", calendarId: "VYpzK2GHuBJ63aO2lSaV", duracion: 10, precio: "$10.000" },
    { nombre: "Depilación de Cejas con Hilo", calendarId: "ozLRNZ5V55zBOpGxcygz", duracion: 15, precio: "$15.000" },
    { nombre: "Depilación de Cejas con Henna", calendarId: "n49lc4VkUvtvdtCRcgTB", duracion: 10, precio: "$10.000" },
    { nombre: "Depilación Perfilado/Cuchilla Cejas", calendarId: "GcGJ59uvGEDf3LZCyrg2", duracion: 25, precio: "$25.000" },
  ],
  "Depilación": [
    { nombre: "Depilación Pierna Completa", calendarId: "cmyFlDKVr8UemAn9N71W", duracion: 90, precio: "$90.000" },
    { nombre: "Depilación Media Pierna", calendarId: "eRj3f8o8CLcD7i0rIgm3", duracion: 60, precio: "$60.000" },
    { nombre: "Depilación Línea del Bikini", calendarId: "mfXJuW1bdCIPV4GgCSx3", duracion: 45, precio: "$45.000" },
    { nombre: "Depilación de Pubis Completo", calendarId: "1vn5jyzI6R8TstZCZhOI", duracion: 60, precio: "$60.000" },
    { nombre: "Depilación de Axilas", calendarId: "mSw9Swdz68i0hC5cqNme", duracion: 18, precio: "$18.000" },
    { nombre: "Depilación Espalda Baja", calendarId: "9HqMBn6P9DBAsMqZmFit", duracion: 60, precio: "$60.000" },
    { nombre: "Depilación de Glúteos", calendarId: "woQv67dSOZkRipYxGaXm", duracion: 20, precio: "$20.000" },
    { nombre: "Depilación Bigote", calendarId: "UKZG99bvj0QCeFJaLNk7", duracion: 10, precio: "$10.000" },
    { nombre: "Depilación Bigote con Hilo", calendarId: "eHXH3nwnTLLoacCnQKeh", duracion: 10, precio: "$10.000" },
    { nombre: "Depilación Barbilla con Hilo", calendarId: "9M1FFJKZmz9tPhwEitAb", duracion: 10, precio: "$10.000" },
    { nombre: "Depilación Orejas", calendarId: "whI104AHCNJGaV35yii2", duracion: 20, precio: "$20.000" },
    { nombre: "Depilación Nariz", calendarId: "ZdfgP31Jmj4hWCEezhda", duracion: 20, precio: "$20.000" },
    { nombre: "Depilación Rostro Completo con Hilo", calendarId: "hKENNyPe7hZhcz5HGHny", duracion: 30, precio: "$30.000" },
  ],
  "Maquillaje Profesional": [
    { nombre: "Maquillaje Social", calendarId: "71J4eTC3TIEuDXfsP1Iw", duracion: 60, precio: "$60.000" },
    { nombre: "Maquillaje Blindado", calendarId: "hdrmUKbZXwO4tbNVsIkb", duracion: 60, precio: "$60.000" },
    { nombre: "Maquillaje Halloween", calendarId: "PelRqVASPHp0QEu7P5Xs", duracion: 60, precio: "$60.000" },
    { nombre: "Baño de Novia Brazos", calendarId: "OybBhb6gij304Vromp7n", duracion: 15, precio: "$15.000" },
  ],
  "Corporal": [
    { nombre: "Drenaje Linfático", calendarId: "wAwK46EAzP7OMVbVZ4Na", duracion: 60, precio: "$60.000" },
    { nombre: "Masaje Relajación Piedras Volcánicas + Velas", calendarId: "q2Iz4gfTyoB3JkRNZ4CZ", duracion: 60, precio: "$60.000" },
    { nombre: "Paquete 1 Masaje Reductor", calendarId: "kjgB0Whm8mjpYv8I075K", duracion: 45, precio: "$45.000" },
    { nombre: "Paquete 2 Masaje Reductor", calendarId: "8iU9qGnCM5nT6816pEAh", duracion: 45, precio: "$45.000" },
    { nombre: "Paquete 3 Masaje Reductor", calendarId: "uajeiWuAmnwZ9BPA4RlT", duracion: 45, precio: "$45.000" },
    { nombre: "Reestructuración de Estrías", calendarId: "9PiZEDHNec91qK58o3de", duracion: 40, precio: "$40.000" },
    { nombre: "Camuflaje de Estrías", calendarId: "xU7HfkiIbhZwHo1EnrTz", duracion: 120, precio: "$120.000" },
    { nombre: "Limpieza Facial Especial", calendarId: "vxUBF94v8PKqobjUBeZc", duracion: 90, precio: "$90.000" },
    { nombre: "Limpieza Facial Tradicional", calendarId: "fz9614uqbCIz8bLDXYNR", duracion: 60, precio: "$60.000" },
    { nombre: "Cosmetología Facial", calendarId: "6Gq72d3MJ8FqYsWYEeWD", duracion: 30, precio: "$30.000" },
  ],
}

export const PROFESIONALES: Profesional[] = [
  { nombre: "Carolina Paz", userId: "Bn1QrO4ITpYI7wSohG9r", especialidad: "Uñas & Manicure", iniciales: "CP" },
  { nombre: "Laura Vanessa", userId: "DEeqUttYKgjjsfNaS1XY", especialidad: "Cabello & Pestañas", iniciales: "LV" },
  { nombre: "Luz Aida", userId: "UzLj5T8ZOrJ8reSig5os", especialidad: "Depilación & Corporal", iniciales: "LA" },
]

export const SLOTS_URL = "https://santiagon8nmejia.dominadoresia.com/webhook/booking/slots"
export const CREAR_URL = "https://santiagon8nmejia.dominadoresia.com/webhook/booking/crear"
