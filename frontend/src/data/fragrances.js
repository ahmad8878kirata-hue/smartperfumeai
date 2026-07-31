export const defaultFragrances = [
  { id: 'PF-001', name: 'Midnight Oud', brand: "L'Artiste Digital", ingredients: ['Oud', 'Saffron', 'Leather'], price: 185, notes: 'Woody, Smoky, Luxurious', rating: 4.8, image: '/images/fragrances/midnight-oud.svg' },
  { id: 'PF-002', name: 'Solaris Mist', brand: 'Neo-Olfactive', ingredients: ['Bergamot', 'Amber', 'Sea Salt'], price: 140, notes: 'Fresh, Aquatic, Warm', rating: 4.6, image: '/images/fragrances/solaris-mist.svg' },
  { id: 'PF-003', name: 'Cipher Green', brand: 'Algorithm Scent', ingredients: ['Vetiver', 'Oakmoss', 'Green Tea'], price: 210, notes: 'Earthy, Green, Sophisticated', rating: 4.7, image: '/images/fragrances/cipher-green.svg' },
  { id: 'PF-004', name: 'Velvet Logic', brand: 'SmartPerfume AI', ingredients: ['Rose', 'Patchouli', 'Vanilla'], price: 245, notes: 'Floral, Deep, Sensual', rating: 4.9, image: '/images/fragrances/velvet-logic.svg' },
  { id: 'PF-005', name: "L'Essence C\u00e9leste", brand: 'SmartPerfume AI', ingredients: ['Bergamot', 'Oud', 'Midnight Jasmine'], price: 145, notes: 'Elegant, Complex, Visionary', rating: 5.0, image: '/images/fragrances/essence-celeste.svg' },
  { id: 'PF-006', name: 'Scarlet Hypothesis', brand: 'Maison Coda', ingredients: ['Cinnamon', 'Pink Pepper', 'Amberwood'], price: 175, notes: 'Spicy, Bold, Electric', rating: 4.5, image: '/images/fragrances/scarlet-hypothesis.svg' },
  { id: 'PF-007', name: 'Noir Axiom', brand: 'Formule Noire', ingredients: ['Black Pepper', 'Incense', 'Dark Vetiver'], price: 230, notes: 'Dark, Mysterious, Intense', rating: 4.9, image: '/images/fragrances/noir-axiom.svg' },
  { id: 'PF-008', name: 'Aurum Bloom', brand: 'SmartPerfume AI', ingredients: ['Neroli', 'Honey', 'White Cedar'], price: 195, notes: 'Golden, Radiant, Sunny', rating: 4.7, image: '/images/fragrances/aurum-bloom.svg' },
  { id: 'PF-009', name: 'Cobalt Muse', brand: 'Neo-Olfactive', ingredients: ['Lavender', 'Cardamom', 'Cypress'], price: 160, notes: 'Aromatic, Crisp, Refined', rating: 4.4, image: '/images/fragrances/cobalt-muse.svg' },
]

const STORAGE_KEY = 'smartperfume_fragrances'

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
