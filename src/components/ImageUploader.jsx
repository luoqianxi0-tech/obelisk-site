import { useState, useRef } from 'react'
import { storage } from '../firebase.js'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ImagePlus, X, Loader } from 'lucide-react'

export default function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const storageRef = ref(storage, 'posts/' + Date.now() + '_' + file.name)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      onChange([...images, url])
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx))

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 struct-line">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button onClick={() => remove(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-obelisk-line text-white flex items-center justify-center text-xs">
              <X size={10} />
            </button>
          </div>
        ))}
        {images.length < 9 && (
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            disabled={uploading}
            className="w-20 h-20 struct-line flex flex-col items-center justify-center gap-1 text-obelisk-muted hover:bg-white/70 disabled:opacity-50"
          >
            {uploading ? <Loader size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            <span className="text-[10px]">{uploading ? '...' : 'Add'}</span>
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
