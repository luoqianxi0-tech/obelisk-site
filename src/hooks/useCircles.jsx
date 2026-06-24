import { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { collection, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'

export function useCircles() {
  const [circles, setCircles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'community', 'circles'), (snap) => {
      setCircles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [])

  const joinCircle = async (circleId, userId) => {
    const ref = doc(db, 'community', 'circles', circleId)
    const snap = await getDoc(ref)
    const count = snap.exists() ? (snap.data().memberCount || 0) : 0
    await updateDoc(ref, { members: arrayUnion(userId), memberCount: count + 1 })
  }

  const leaveCircle = async (circleId, userId) => {
    const ref = doc(db, 'community', 'circles', circleId)
    const snap = await getDoc(ref)
    const count = snap.exists() ? (snap.data().memberCount || 0) : 0
    await updateDoc(ref, { members: arrayRemove(userId), memberCount: Math.max(0, count - 1) })
  }

  return { circles, loading, joinCircle, leaveCircle }
}
