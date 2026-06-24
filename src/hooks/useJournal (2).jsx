import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export function useJournal(category, userId) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'journal'),
      where('category', '==', category),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [category, userId])

  const addEntry = async (data) => {
    await addDoc(collection(db, 'journal'), { ...data, createdAt: serverTimestamp() })
  }

  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, 'journal', id))
  }

  const updateEntry = async (id, data) => {
    await updateDoc(doc(db, 'journal', id), data)
  }

  return { entries, loading, addEntry, deleteEntry, updateEntry }
}
