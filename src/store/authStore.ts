import { create } from 'zustand'
import { auth, db, ADMIN_UIDS } from '../firebase'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import type { UserData, Tool } from '../types'

interface AuthState {
  user: any | null
  userData: UserData | null
  isAdmin: boolean
  loading: boolean
  initialized: boolean
  setUser: (user: any) => void
  setUserData: (data: UserData) => void
  login: () => Promise<void>
  logout: () => Promise<void>
  init: () => void
}

const defaultArsenal: Tool[] = [
  { name: "Frida", cat: "Instrumentation", desc: "Dynamic code injection", url: "https://frida.re" },
  { name: "Burp Suite", cat: "Proxy", desc: "Web proxy & HTTPS interception", url: "https://portswigger.net/burp" },
  { name: "JADX", cat: "Decompiler", desc: "Dex to Java decompiler", url: "https://github.com/skylot/jadx" },
  { name: "Apktool", cat: "Reverse", desc: "APK reverse engineering", url: "https://ibotpeaches.github.io/Apktool/" },
  { name: "Objection", cat: "Runtime", desc: "Mobile runtime exploration", url: "https://github.com/sensepost/objection" },
  { name: "Magisk", cat: "Root", desc: "Root & module framework", url: "https://github.com/topjohnwu/Magisk" },
  { name: "Termux", cat: "Terminal", desc: "Linux terminal emulator", url: "https://termux.dev" },
  { name: "Ghidra", cat: "RE", desc: "Software reverse engineering", url: "https://ghidra-sre.org" },
  { name: "Wireshark", cat: "Network", desc: "Network protocol analyzer", url: "https://www.wireshark.org" },
  { name: "Nuclei", cat: "Scanner", desc: "Fast vulnerability scanner", url: "https://nuclei.projectdiscovery.io" }
]

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  isAdmin: false,
  loading: true,
  initialized: false,

  setUser: (user) => {
    const isAdmin = user ? ADMIN_UIDS.includes(user.uid) : false
    set({ user, isAdmin, loading: false })
  },

  setUserData: (data) => set({ userData: data }),

  login: async () => {
    const { googleProvider } = await import('../firebase')
    const { signInWithPopup } = await import('firebase/auth')
    await signInWithPopup(auth, googleProvider)
  },

  logout: async () => {
    await signOut(auth)
    set({ user: null, userData: null, isAdmin: false })
  },

  init: () => {
    if (get().initialized) return
    set({ initialized: true })

    onAuthStateChanged(auth, async (user) => {
      const isAdmin = user ? ADMIN_UIDS.includes(user.uid) : false
      set({ user, isAdmin, loading: false })

      if (user) {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          set({ userData: snap.data() as UserData })
        } else {
          const newData: UserData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            codename: '',
            level: 1,
            xp: 0,
            maxXp: 1000,
            language: 'en',
            arsenal: defaultArsenal,
            recentApps: [],
            logs: [],
            stats: { hooks: 0, packets: 0, scans: 0, nodes: 0, risk: 0, traffic_mbps: 0, cpu_percent: 0, memory_percent: 0 }
          }
          await setDoc(ref, newData)
          set({ userData: newData })
        }
      }
    })
  }
}))
