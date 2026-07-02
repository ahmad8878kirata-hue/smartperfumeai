import { useState } from 'react'

const initialFragrances = [
  { id: 'PF-001', name: 'Midnight Oud', brand: "L'Artiste Digital", ingredients: ['Oud', 'Saffron', 'Leather'], price: '€185.00' },
  { id: 'PF-002', name: 'Solaris Mist', brand: 'Neo-Olfactive', ingredients: ['Bergamot', 'Amber', 'Sea Salt'], price: '€140.00' },
  { id: 'PF-003', name: 'Cipher Green', brand: 'Algorithm Scent', ingredients: ['Vetiver', 'Oakmoss', 'Green Tea'], price: '€210.00' },
  { id: 'PF-004', name: 'Velvet Logic', brand: 'SmartPerfume AI', ingredients: ['Rose', 'Patchouli', 'Vanilla'], price: '€245.00' },
]

export default function AdminCatalog() {
  const [fragrances, setFragrances] = useState(initialFragrances)
  const [search, setSearch] = useState('')

  const filtered = fragrances.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.brand.toLowerCase().includes(search.toLowerCase()) ||
      f.ingredients.some((i) => i.toLowerCase().includes(search.toLowerCase()))
  )

  const handleDelete = (id) => {
    setFragrances((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="font-body-md text-body-md overflow-hidden bg-surface-dim text-on-surface">
      <div className="flex h-screen w-full">
        <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low backdrop-blur-xl border-r border-on-surface/5 flex flex-col p-gutter z-50">
          <div className="mb-10">
            <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Admin Panel</h1>
            <p className="font-label-caps text-label-caps text-on-tertiary-container">Catalog Management</p>
          </div>
          <nav className="flex-grow space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-on-tertiary-container hover:bg-surface-container-high/50 transition-all rounded-lg scale-95 active:scale-90 duration-150">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-caps text-label-caps">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-secondary font-bold bg-surface-container-highest/20 rounded-lg scale-95 active:scale-90 duration-150">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span>
              <span className="font-label-caps text-label-caps">Catalog</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-on-tertiary-container hover:bg-surface-container-high/50 transition-all rounded-lg scale-95 active:scale-90 duration-150">
              <span className="material-symbols-outlined">insights</span>
              <span className="font-label-caps text-label-caps">Scent Analytics</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-on-tertiary-container hover:bg-surface-container-high/50 transition-all rounded-lg scale-95 active:scale-90 duration-150">
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="font-label-caps text-label-caps">Inventory</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-on-tertiary-container hover:bg-surface-container-high/50 transition-all rounded-lg scale-95 active:scale-90 duration-150">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-caps text-label-caps">Settings</span>
            </div>
          </nav>
          <button className="mb-8 w-full py-4 bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Add New Fragrance
          </button>
          <div className="mt-auto border-t border-outline-variant/20 pt-6 space-y-2">
            <div className="flex items-center gap-3 px-4 py-2 cursor-pointer text-on-tertiary-container hover:bg-surface-container-high/50 transition-all rounded-lg">
              <span className="material-symbols-outlined">help</span>
              <span className="font-label-caps text-label-caps">Help Center</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 cursor-pointer text-on-tertiary-container hover:bg-surface-container-high/50 transition-all rounded-lg">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-caps text-label-caps">Logout</span>
            </div>
          </div>
        </aside>
        <main className="ml-64 flex-grow relative h-full overflow-y-auto custom-scrollbar bg-surface-dim">
          <div className="relative z-10 px-margin-desktop py-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Perfume Catalog</h2>
                <p className="text-on-surface-variant max-w-lg">
                  Manage your digital olfactory library. Refine scent profiles, adjust inventory, and oversee computational
                  ingredients for SmartPerfume AI.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="glass-panel rounded-full flex items-center px-4 py-2 min-w-[300px]">
                  <span className="material-symbols-outlined text-outline-variant mr-3">search</span>
                  <input
                    className="bg-transparent border-none focus:ring-0 text-body-md w-full placeholder:text-outline-variant"
                    placeholder="Search by name, note, or brand..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button className="glass-panel p-3 rounded-lg hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 mb-12">
              <div className="glass-panel p-6 rounded-xl">
                <p className="font-label-caps text-label-caps text-on-tertiary-container mb-2">Total Fragrances</p>
                <p className="font-headline-md text-headline-md text-secondary">1,284</p>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <p className="font-label-caps text-label-caps text-on-tertiary-container mb-2">Computational Blends</p>
                <p className="font-headline-md text-headline-md text-primary">856</p>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <p className="font-label-caps text-label-caps text-on-tertiary-container mb-2">Active Regions</p>
                <p className="font-headline-md text-headline-md text-on-surface">12</p>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <p className="font-label-caps text-label-caps text-on-tertiary-container mb-2">System Status</p>
                <p className="font-headline-md text-headline-md text-error flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  Optimal
                </p>
              </div>
            </div>
            <div className="glass-panel rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                    <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">ID</th>
                    <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Name</th>
                    <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Brand</th>
                    <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Main Ingredients</th>
                    <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container">Price (&euro;)</th>
                    <th className="px-8 py-5 font-label-caps text-label-caps text-on-tertiary-container text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filtered.map((f) => (
                    <tr key={f.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6 text-on-surface-variant">{f.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                            <span className="material-symbols-outlined">spa</span>
                          </div>
                          <span className="font-body-lg text-body-lg text-on-surface font-medium">{f.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-on-surface-variant italic">{f.brand}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {f.ingredients.map((ing) => (
                            <span
                              key={ing}
                              className="px-2 py-1 rounded bg-secondary-container/20 text-secondary-fixed text-[10px] font-label-caps border border-secondary-fixed/20 uppercase"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6 font-body-lg text-secondary-fixed">{f.price}</td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button className="p-2 text-outline hover:text-secondary-fixed transition-colors">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="p-2 text-outline hover:text-error transition-colors" onClick={() => handleDelete(f.id)}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-8 py-6 flex justify-between items-center bg-surface-container-low/30">
                <p className="text-on-tertiary-container font-label-caps text-label-caps">
                  Showing 1 to {filtered.length} of {fragrances.length} entries
                </p>
                <div className="flex gap-2">
                  <button className="glass-panel px-4 py-2 rounded-lg text-label-caps font-label-caps hover:bg-surface-container-high transition-all opacity-50 cursor-not-allowed">
                    Previous
                  </button>
                  <button className="glass-panel px-4 py-2 rounded-lg text-label-caps font-label-caps hover:bg-surface-container-high transition-all">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          <footer className="w-full py-12 border-t border-outline-variant/20 bg-surface-dim flex flex-col items-center justify-center space-y-base px-margin-desktop relative z-10">
            <div className="font-headline-md text-headline-md text-on-surface">SmartPerfume AI</div>
            <div className="flex gap-margin-mobile">
              <a className="text-on-surface-variant font-body-md text-body-md hover:text-secondary transition-colors opacity-100 hover:opacity-80" href="#">
                Privacy Policy
              </a>
              <a className="text-on-surface-variant font-body-md text-body-md hover:text-secondary transition-colors opacity-100 hover:opacity-80" href="#">
                Terms of Service
              </a>
              <a className="text-on-surface-variant font-body-md text-body-md hover:text-secondary transition-colors opacity-100 hover:opacity-80" href="#">
                Scent Science
              </a>
              <a className="text-on-surface-variant font-body-md text-body-md hover:text-secondary transition-colors opacity-100 hover:opacity-80" href="#">
                Contact
              </a>
            </div>
            <p className="text-on-surface-variant font-body-md text-body-md">
              &copy; 2024 SmartPerfume AI. The Art of Computational Olfaction.
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
