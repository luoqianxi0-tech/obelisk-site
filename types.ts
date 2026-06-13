export interface UserData {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  codename: string
  level: number
  xp: number
  maxXp: number
  language: 'en' | 'zh'
  arsenal: Tool[]
  recentApps: AppData[]
  logs: LogEntry[]
  stats: Stats
}

export interface Tool {
  name: string
  cat: string
  desc: string
  url: string
  version?: string
  status?: string
}

export interface AppData {
  name: string
  pkg: string
  date: string
  risk: 'high' | 'mid' | 'low'
  permissions: string[]
  findings: string[]
}

export interface LogEntry {
  action: string
  type: string
  time: number
}

export interface Stats {
  hooks: number
  packets: number
  scans: number
  nodes: number
  risk: number
  traffic_mbps: number
  cpu_percent: number
  memory_percent: number
}

export interface AgentMessage {
  type: 'stats' | 'hook' | 'packets' | 'status'
  timestamp: number
  data: any
}

export interface Post {
  id: string
  title: string
  type: string
  visibility: string
  content: string
  authorId: string
  authorName: string
  likes: number
  comments: Comment[]
  views: number
  createdAt: any
}

export interface Comment {
  author: string
  text: string
  time: number
}

export interface Resource {
  name: string
  url: string
  desc: string
  category: string
  tags: string[]
  addedBy: string
}

export interface Snippet {
  title: string
  lang: string
  code: string
}

export interface APKAnalysis {
  filename: string
  manifest: {
    package: string
    versionCode: string
    versionName: string
    permissions: string[]
  }
  dexStrings: string[]
  nativeLibs: string[]
  suspicious: string[]
  risk: number
  timestamp: number
}
