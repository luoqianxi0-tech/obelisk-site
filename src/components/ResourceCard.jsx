import { ExternalLink, Copy } from 'lucide-react'
import { useTranslation } from '../i18n/I18nProvider.jsx'

export default function ResourceCard({ resource }) {
  const { t } = useTranslation()
  const copy = () => { navigator.clipboard.writeText(resource.url); alert(t('common.copied')) }
  return (
    <div className="glass p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-sm tracking-tight">{resource.name}</h3>
        <span className="text-[10px] px-1.5 py-0.5 bg-black/5 struct-line shrink-0">{resource.category}</span>
      </div>
      <p className="text-xs text-obelisk-muted line-clamp-2">{resource.description}</p>
      <div className="flex items-center gap-2 pt-2 struct-line-t">
        <a href={resource.url} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
          <ExternalLink size={12} /> {t('vault.visit')}
        </a>
        <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
          <Copy size={12} /> {t('vault.copy')}
        </button>
      </div>
    </div>
  )
}
