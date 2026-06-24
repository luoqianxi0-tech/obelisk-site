import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useTranslation } from '../i18n/I18nProvider.jsx'
import { usePosts } from '../hooks/usePosts.jsx'
import { useCircles } from '../hooks/useCircles.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import TagInput from '../components/TagInput.jsx'
import { ArrowLeft, Send } from 'lucide-react'

export default function NewPost() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { createPost } = usePosts()
  const { circles } = useCircles()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [tags, setTags] = useState([])
  const [circleId, setCircleId] = useState(searchParams.get('circle') || '')
  const [isPublic, setIsPublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || !user) return
    setSubmitting(true)
    const circle = circles.find(c => c.id === circleId)
    await createPost({
      content: content.trim(),
      images,
      tags,
      circleId: circleId || null,
      circleName: circle && circle.name ? circle.name : null,
      isPublic,
      author: { uid: user.uid, displayName: user.displayName, photoURL: user.photoURL }
    })
    setSubmitting(false)
    navigate('/monument/plaza')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-xs text-obelisk-muted hover:text-obelisk-line mb-4">
        <ArrowLeft size={14} /> {t('common.back')}
      </button>
      <div className="glass-strong p-6">
        <h1 className="text-xl font-black tracking-tight mb-6">{t('monument.newPost')}</h1>
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('monument.placeholder')}
            rows={5}
            className="input-struct text-sm resize-none"
          />
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-obelisk-muted mb-2 block">{t('monument.images')}</label>
            <ImageUploader images={images} onChange={setImages} />
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-obelisk-muted mb-2 block">{t('monument.tags')}</label>
            <TagInput tags={tags} onChange={setTags} />
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-obelisk-muted mb-2 block">{t('monument.chooseCircle')}</label>
            <select value={circleId} onChange={e => setCircleId(e.target.value)} className="input-struct text-sm">
              <option value="">{t('common.empty')}</option>
              {circles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" checked={isPublic} onChange={() => setIsPublic(true)} className="accent-obelisk-line" />
              {t('monument.public')}
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" checked={!isPublic} onChange={() => setIsPublic(false)} className="accent-obelisk-line" />
              {t('monument.private')}
            </label>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleSubmit} disabled={submitting || !content.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              <Send size={14} /> {submitting ? '...' : t('monument.post')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
