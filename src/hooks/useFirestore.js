import { useState, useCallback } from 'react'
import { db } from '../firebase.js'
import { 
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, 
  query, orderBy, limit, where, serverTimestamp, onSnapshot 
} from 'firebase/firestore'

export function useCollection(path, options = {}) {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      let q = query(collection(db, path), orderBy('createdAt', 'desc'))
      if (options.limit) q = query(q, limit(options.limit))
      if (options.where) q = query(q, where(...options.where))

      const snap = await getDocs(q)
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setDocs(items)
      setError(null)
      return items
    } catch (e) {
      setError(e.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [path, options.limit, options.where])

  const add = useCallback(async (data) => {
    try {
      const ref = await addDoc(collection(db, path), {
        ...data,
        createdAt: serverTimestamp()
      })
      return ref.id
    } catch (e) {
      setError(e.message)
      throw e
    }
  }, [path])

  const subscribe = useCallback((callback) => {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setDocs(items)
      callback?.(items)
    }, (err) => setError(err.message))
  }, [path])

  return { docs, loading, error, fetch, add, subscribe }
}

export function useDocument(path, id) {
  const [docData, setDocData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const snap = await getDoc(doc(db, path, id))
      if (snap.exists()) {
        setDocData({ id: snap.id, ...snap.data() })
      } else {
        setDocData(null)
      }
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [path, id])

  const update = useCallback(async (data) => {
    if (!id) return
    try {
      await updateDoc(doc(db, path, id), data)
      setDocData(prev => prev ? { ...prev, ...data } : prev)
    } catch (e) {
      setError(e.message)
      throw e
    }
  }, [path, id])

  return { doc: docData, loading, error, fetch, update }
}
