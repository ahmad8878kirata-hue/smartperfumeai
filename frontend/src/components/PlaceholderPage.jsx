import { useLocation } from 'react-router-dom'

export default function PlaceholderPage() {
  const location = useLocation()
  const title = location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)

  const data = {
    collection: {
      icon: 'inventory_2',
      desc: 'Browse our curated collection of AI-designed fragrances.',
    },
    journal: {
      icon: 'menu_book',
      desc: 'Read about the science of computational olfaction and fragrance insights.',
    },
    about: {
      icon: 'info',
      desc: 'Learn about SmartPerfume AI and our mission to revolutionize fragrance.',
    },
    cart: {
      icon: 'shopping_bag',
      desc: 'Your curated fragrance collection awaits.',
    },
    account: {
      icon: 'account_circle',
      desc: 'Manage your profile and scent preferences.',
    },
  }

  const page = data[location.pathname.slice(1)] || { icon: 'explore', desc: 'Welcome.' }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-desktop text-center">
      <span className="material-symbols-outlined text-8xl text-secondary-fixed opacity-30 mb-8">{page.icon}</span>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4 capitalize">{title}</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">{page.desc}</p>
    </div>
  )
}
