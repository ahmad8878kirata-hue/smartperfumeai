const articles = [
  {
    title: 'The Science of Fine Fragrance',
    excerpt: 'How modern science deepens our understanding of fragrance, moving beyond traditional perfumery into refined scent design.',
    date: 'June 2026',
    icon: 'science',
    tags: ['Research', 'Science', 'Fragrance'],
  },
  {
    title: 'Behind the Scenes: How Your Scent Profile is Built',
    excerpt: 'A look at how your preferences shape the perfect fragrance, from first impression to final blend.',
    date: 'May 2026',
    icon: 'psychology',
    tags: ['Technology', 'Personalization'],
  },
  {
    title: 'Sustainable Luxury: Ethical Sourcing for Modern Fragrance',
    excerpt: 'How SmartPerfume combines expert craftsmanship with ethical sourcing to create sustainable, cruelty-free fragrances without compromising quality.',
    date: 'April 2026',
    icon: 'eco',
    tags: ['Sustainability', 'Ethics', 'Luxury'],
  },
  {
    title: 'The Psychology of Scent: Why Fragrance Matters',
    excerpt: 'Exploring the deep connection between scent, memory, and emotion, and how they shape the fragrances that resonate with us on a personal level.',
    date: 'March 2026',
    icon: 'psychology',
    tags: ['Psychology', 'Wellness', 'Science'],
  },
  {
    title: 'From Inspiration to Bottle: The Making of a Signature Fragrance',
    excerpt: 'Follow the journey of a SmartPerfume fragrance from initial inspiration through careful blending to the final bottled product.',
    date: 'February 2026',
    icon: 'precision_manufacturing',
    tags: ['Behind the Scenes', 'Technology', 'Process'],
  },
]

export default function Journal() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
      <div className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Scent Journal</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Insights, research, and stories from the world of fragrance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {articles.map((a) => (
          <div key={a.title} className="glass-card rounded-xl p-6 group hover:bg-surface-container-high transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-2xl text-secondary-fixed">{a.icon}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {a.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[10px] font-label-caps border border-outline-variant/20 uppercase">
                  {t}
                </span>
              ))}
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3 leading-snug">{a.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4 leading-relaxed">{a.excerpt}</p>
            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
              <span className="font-label-caps text-label-caps text-on-tertiary-container">{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
