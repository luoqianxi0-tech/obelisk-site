import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, userData, isAdmin, loading, init } = useAuthStore()

  useEffect(() => {
    init()
  }, [init])

  return { user, userData, isAdmin, loading }
}
