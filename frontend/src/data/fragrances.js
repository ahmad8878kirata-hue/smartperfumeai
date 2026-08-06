export const defaultFragrances = [
  { id: 'PF-001', name: 'Oud Wood', brand: 'Tom Ford', ingredients: ['Cardamom', 'Oud', 'Sandalwood', 'Vetiver', 'Amber'], price: 200, notes: 'Woody, Smoky, Luxurious', rating: 4.8, image: '/images/fragrances/tom-ford-oud-wood.svg' },
  { id: 'PF-002', name: 'Acqua di Gio', brand: 'Giorgio Armani', ingredients: ['Bergamot', 'Sea Notes', 'Jasmine', 'Cedar', 'White Musk'], price: 110, notes: 'Fresh, Aquatic, Warm', rating: 4.6, image: '/images/fragrances/acqua-di-gio.svg' },
  { id: 'PF-003', name: 'Vetiver', brand: 'Guerlain', ingredients: ['Vetiver', 'Bergamot', 'Tobacco', 'Oakmoss'], price: 85, notes: 'Earthy, Green, Sophisticated', rating: 4.7, image: '/images/fragrances/guerlain-vetiver.svg' },
  { id: 'PF-004', name: 'Noir de Noir', brand: 'Tom Ford', ingredients: ['Rose', 'Black Truffle', 'Patchouli', 'Vanilla', 'Amber'], price: 235, notes: 'Floral, Deep, Sensual', rating: 4.9, image: '/images/fragrances/tom-ford-noir-de-noir.svg' },
  { id: 'PF-005', name: 'Chanel No. 5', brand: 'Chanel', ingredients: ['Aldehydes', 'Jasmine', 'Rose', 'Sandalwood', 'Vanilla'], price: 140, notes: 'Elegant, Complex, Iconic', rating: 5.0, image: '/images/fragrances/chanel-no-5.svg' },
  { id: 'PF-006', name: 'Spicebomb', brand: 'Viktor & Rolf', ingredients: ['Cinnamon', 'Pink Pepper', 'Saffron', 'Tobacco', 'Amber'], price: 110, notes: 'Spicy, Bold, Electric', rating: 4.5, image: '/images/fragrances/spicebomb.svg' },
  { id: 'PF-007', name: 'Interlude Man', brand: 'Amouage', ingredients: ['Bergamot', 'Black Pepper', 'Incense', 'Myrrh', 'Oud'], price: 250, notes: 'Dark, Mysterious, Intense', rating: 4.9, image: '/images/fragrances/amouage-interlude.svg' },
  { id: 'PF-008', name: 'Colonia', brand: 'Acqua di Parma', ingredients: ['Sicilian Citrus', 'Neroli', 'Lavender', 'Rosemary', 'Vetiver'], price: 140, notes: 'Golden, Radiant, Sunny', rating: 4.7, image: '/images/fragrances/acqua-di-parma-colonia.svg' },
  { id: 'PF-009', name: 'Le Male', brand: 'Jean Paul Gaultier', ingredients: ['Lavender', 'Mint', 'Cardamom', 'Vanilla'], price: 90, notes: 'Aromatic, Crisp, Refined', rating: 4.4, image: '/images/fragrances/le-male.svg' },
]

const STORAGE_KEY = 'smartperfume_fragrances_v2'

export function loadFragrances() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    } catch {
      /* fall through to defaults */
    }
  }
  return defaultFragrances
}

export function saveFragrances(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}
