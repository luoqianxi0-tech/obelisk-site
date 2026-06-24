import { useState, useEffect, useCallback } from 'react'
import { db } from '../firebase.js'
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'

export function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const q = query(collection(db, 'community', 'posts'), orderBy('createdAt', 'desc'), limit(50))
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPosts(arr)
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [])

  const createPost = useCallback(async (data) => {
    const ref = collection(db, 'community', 'posts')
    await addDoc(ref, {
      ...data,
      createdAt: serverTimestamp(),
      likes: 0, comments: [], bookmarks: 0, shares: 0
    })
  }, [])

  const likePost = useCallback(async (postId) => {
    const ref = doc(db, 'community', 'posts', postId)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      await updateDoc(ref, { likes: (snap.data().likes || 0) + 1 })
    }
  }, [])

  const addComment = useCallback(async (postId, comment) => {
    const ref = doc(db, 'community', 'posts', postId)
    await updateDoc(ref, { comments: arrayUnion({ ...comment, id: crypto.randomUUID(), createdAt: Date.now() }) })
  }, [])

  return { posts, loading, createPost, likePost, addComment }
}
