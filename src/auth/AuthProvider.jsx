import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { auth, db } from '../firebase.js'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { googleProvider } from '../firebase.js'

const ADMIN_UID = 'nCZLU2r9YfXVTrQ79EJqWJxPPT03'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        setIsAdmin(u.uid === ADMIN_UID)
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
            isAdmin: u.uid === ADMIN_UID,
            arsenal: [],
            postsCount: 0,
            following: [],
            followers: []
          }
          await setDoc(ref, newProfile)
          setProfile(newProfile)
        }
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = useCallback(async () => {
    setLoginLoading(true)
    setLoginError('')
    try {
      await signInWithPopup(auth, googleProvider)
      setLoginOpen(false)
    } catch (e) {
      console.error(e)
      setLoginError('Login failed')
    } finally {
      setLoginLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])

  const updateProfileLocal = useCallback((data) => {
    setProfile(prev => prev ? { ...prev, ...data } : data)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, profile, isAdmin, loading,
      login, logout, loginOpen, openLogin, closeLogin,
      loginLoading, loginError, updateProfileLocal
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
