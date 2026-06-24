import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { auth, db } from '../firebase.js'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const ADMIN_UID = 'nCZLU2r9YfXVTrQ79EJqWJxPPT03'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        setIsAdmin(firebaseUser.uid === ADMIN_UID)

        try {
          const userRef = doc(db, 'users', firebaseUser.uid)
          const snap = await getDoc(userRef)
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || '',
              createdAt: serverTimestamp(),
              role: firebaseUser.uid === ADMIN_UID ? 'admin' : 'user',
              bio: '',
              handle: firebaseUser.email?.split('@')[0] || 'user',
              followers: [],
              following: [],
              postsCount: 0,
              agentConnected: false,
              agentHost: 'localhost',
              agentPort: 8765
            })
          }
        } catch (e) {
          console.error('Auth user doc error:', e)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
      setAuthChecked(true)
    })
    return () => unsub()
  }, [])

  const login = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, new (await import('firebase/auth')).GoogleAuthProvider())
      return result.user
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
    setIsAdmin(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, authChecked, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
