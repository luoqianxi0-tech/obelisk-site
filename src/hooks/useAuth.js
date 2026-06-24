import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { auth, db } from '../firebase.js'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const ADMIN_UIDS = ['nCZLU2r9YfXVTrQ79EJqWJxPPT03']

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setProfile(snap.data())
        } else {
          const newProfile = {
            uid: u.uid,
            displayName: u.displayName || 'Anonymous',
            photoURL: u.photoURL || '',
            email: u.email || '',
            bio: '',
            createdAt: serverTimestamp(),
            followers: [],
            following: [],
            groups: [],
            arsenal: []
          }
          await setDoc(ref, newProfile)
          setProfile(newProfile)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = useCallback(async () => {
    const provider = new (await import('firebase/auth')).GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const isAdmin = ADMIN_UIDS.includes(user?.uid)

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
