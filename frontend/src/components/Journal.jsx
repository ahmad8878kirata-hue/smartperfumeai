const articles = [
  {
    title: 'The Science of Computational Olfaction',
    excerpt: 'How machine learning is revolutionizing the way we understand and create fragrances, moving beyond traditional perfumery into data-driven scent design.',
    date: 'June 2026',
    icon: 'science',
    tags: ['AI', 'Research', 'Olfaction'],
  },
  {
    title: 'Behind the Algorithm: How Your Scent Profile is Built',
    excerpt: 'A deep dive into the machine learning model that analyzes your preferences and maps them to molecular structures for your perfect fragrance.',
    date: 'May 2026',
    icon: 'psychology',
    tags: ['Technology', 'AI', 'Personalization'],
  },
  {
    title: 'Sustainable Luxury: Ethical Sourcing in the AI Era',
    excerpt: 'How SmartPerfume combines computational precision with ethical sourcing to create sustainable, cruelty-free fragrances without compromising quality.',
    date: 'April 2026',
    icon: 'eco',
    tags: ['Sustainability', 'Ethics', 'Luxury'],
  },
  {
    title: 'The Psychology of Scent: Why Fragrance Matters',
    excerpt: 'Exploring the deep connection between olfactory perception, memory, emotion, and how AI can help create fragrances that resonate on a personal level.',
    date: 'March 2026',
    icon: 'psychology',
    tags: ['Psychology', 'Wellness', 'Science'],
  },
  {
    title: 'From Data to Bottle: The Making of a Computational Fragrance',
    excerpt: 'Follow the journey of a SmartPerfume AI fragrance from initial data collection through molecular synthesis to the final bottled product.',
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
        <p className="font-body-lg text-body-lg text-on-surface-variant">Insights, research, and stories from the world of computational olfaction.</p>
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
              <span className="font-label-caps text-label-caps text-secondary-fixed group-hover:opacity-100 opacity-70 transition-opacity flex items-center gap-1">
                Read More
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
