import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useI18n } from '../../i18n.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { db, storage } from '../../firebase.js'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function NewPost() {
  const { t } = useI18n()
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [privacy, setPrivacy] = useState('public')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-obelisk-textMuted mb-4">{t('auth.login')} {t('stele.newPost')}</p>
        <button className="btn-primary">{t('auth.login')}</button>
      </div>
    )
  }

  function handleAddTag(e) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const tag = tagInput.trim().replace(/^#/, '')
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag])
      }
      setTagInput('')
    }
  }

  function removeTag(tag) {
    setTags(tags.filter(t => t !== tag))
  }

  function handleImageSelect(e) {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const url = URL.createObjectURL(file)
      setImages(prev => [...prev, url])
      setImageFiles(prev => [...prev, file])
    })
  }

  function removeImage(idx) {
    setImages(prev => prev.filter((_, i) => i !== idx))
    setImageFiles(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit() {
    if (!content.trim() && images.length === 0) return
    setSubmitting(true)
    try {
      const uploadedUrls = []
      for (const file of imageFiles) {
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        uploadedUrls.push(url)
      }

      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorPhoto: user.photoURL || '',
        content: content.trim(),
        images: uploadedUrls,
        tags,
        privacy,
        likes: 0,
        likedBy: [],
        collectedBy: [],
        comments: [],
        views: 0,
        createdAt: serverTimestamp()
      })

      navigate('/stele')
    } catch (e) {
      console.error(e)
      alert(t('settings.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/stele" className="text-sm text-obelisk-textMuted hover:text-obelisk-line mb-4 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        {t('settings.back')}
      </Link>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-bold text-xl text-obelisk-line mb-6">{t('stele.newPost')}</h2>

        <div className="flex items-center gap-3 mb-4">
          <img src={user.photoURL || '/default-avatar.png'} alt="" className="w-10 h-10 rounded-full" />
          <div>
            <div className="text-sm font-medium">{user.displayName}</div>
            <select
              value={privacy}
              onChange={e => setPrivacy(e.target.value)}
              className="text-xs bg-obelisk-surfaceDark rounded-lg px-2 py-1 border border-obelisk-border mt-1"
            >
              <option value="public">{t('stele.public')}</option>
              <option value="followersOnly">{t('stele.followersOnly')}</option>
              <option value="private">{t('stele.private')}</option>
            </select>
          </div>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t('stele.placeholder')}
          className="w-full px-4 py-3 rounded-xl bg-obelisk-surfaceDark border border-obelisk-border text-sm resize-none focus:outline-none focus:border-obelisk-line min-h-[120px]"
          rows={6}
        />

        {/* Tags */}
        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-emerald-900">×</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={`${t('stele.addTag')} (${t('stele.tagHint')})`}
            className="w-full px-4 py-2 rounded-xl bg-obelisk-surfaceDark border border-obelisk-border text-sm focus:outline-none focus:border-obelisk-line"
          />
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-black/70">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-obelisk-border">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileRef}
              onChange={handleImageSelect}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-obelisk-textMuted hover:bg-black/5 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {t('stele.placeholderImage')}
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting || (!content.trim() && images.length === 0)}
            className="btn-primary disabled:opacity-50"
          >
            {submitting ? t('settings.loading') : t('stele.newPost')}
          </button>
        </div>
      </div>
    </div>
  )
}
