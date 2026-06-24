import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'

export function useResources(category) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'resources'), where('category', '==', category))
    const unsub = onSnapshot(q, (snap) => {
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [category])

  const addResource = async (data) => {
    await addDoc(collection(db, 'resources'), { ...data, createdAt: serverTimestamp() })
  }

  const removeResource = async (id) => {
    await deleteDoc(doc(db, 'resources', id))
  }

  return { resources, loading, addResource, removeResource }
}
