import { useParams } from 'react-router-dom'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function WorkshopCategory() {
  const { category } = useParams()
  const { t } = useTranslation()

  const data = {
    ui: [
      { title: 'Tailwind UI', desc: 'Official Tailwind components', url: 'https://tailwindui.com' },
      { title: 'Shadcn UI', desc: 'Beautifully designed components', url: 'https://ui.shadcn.com' },
      { title: 'Radix UI', desc: 'Unstyled accessible components', url: 'https://www.radix-ui.com' },
      { title: 'Chakra UI', desc: 'Modular accessible components', url: 'https://chakra-ui.com' },
    ],
    color: [
      { title: 'Coolors', desc: 'Color palette generator', url: 'https://coolors.co' },
      { title: 'Color Hunt', desc: 'Curated color palettes', url: 'https://colorhunt.co' },
      { title: 'Adobe Color', desc: 'Color wheel and themes', url: 'https://color.adobe.com' },
    ],
    font: [
      { title: 'Google Fonts', desc: 'Free web fonts', url: 'https://fonts.google.com' },
      { title: 'Fontshare', desc: 'Quality free fonts', url: 'https://www.fontshare.com' },
      { title: 'Vercel Geist', desc: 'Modern sans-serif', url: 'https://vercel.com/font' },
    ],
    inspo: [
      { title: 'Awwwards', desc: 'Web design inspiration', url: 'https://www.awwwards.com' },
      { title: 'Dribbble', desc: 'Design community', url: 'https://dribbble.com' },
      { title: 'Muzli', desc: 'Design inspiration', url: 'https://muz.li' },
      { title: 'Behance', desc: 'Creative portfolios', url: 'https://www.behance.net' },
    ],
  }

  const items = data[category] || []

  return (
    <div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noreferrer" className="glass p-4 hover:bg-white/70 transition-colors block">
              <h3 className="font-bold text-sm tracking-tight">{item.title}</h3>
              <p className="text-xs text-obelisk-muted mt-1">{item.desc}</p>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState title={t('workshop.empty')} desc={t('workshop.empty')} />
      )}
    </div>
  )
}
