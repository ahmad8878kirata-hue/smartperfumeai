const articles = [
  {
    title: 'Understanding Fragrance Families',
    excerpt: 'Learn about floral, woody, fresh, and oriental fragrance families and how they influence the character of a perfume.',
    date: 'June 2026',
    icon: 'science',
    tags: ['Fragrance', 'Guide', 'Basics'],
  },
  {
    title: 'How SmartParfum Finds Your Match',
    excerpt: 'Learn how your quiz answers are compared with fragrance characteristics using a transparent rule-based recommendation process.',
    date: 'May 2026',
    icon: 'psychology',
    tags: ['Technology', 'Quiz', 'Recommendation'],
  },
  {
    title: 'How to Choose the Right Fragrance',
    excerpt: 'Discover how fragrance family, occasion, mood, and intensity can help you find a perfume that matches your personal preferences.',
    date: 'April 2026',
    icon: 'recommend',
    tags: ['Guide', 'Preferences', 'Fragrance'],
  },
]

export default function Journal() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
      <div className="mb-10">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Scent Journal</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Guides and insights to help you understand fragrances and find the right scent.</p>
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
