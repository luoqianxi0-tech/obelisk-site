import { useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'
import { useObeliskStore } from '../store.js'

export function useAuth() {
  const { setUser, setAuthReady, user, isAdmin } = useObeliskStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthReady()
    })
    return unsub
  }, [setUser, setAuthReady])

  const login = async () => {
    try { await signInWithPopup(auth, googleProvider) }
    catch (err) {
      if (err.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider)
      }
      throw err
    }
  }

  const logout = () => signOut(auth)

  return { user, isAdmin, isAuthReady: useObeliskStore((s) => s.isAuthReady), login, logout }
}
