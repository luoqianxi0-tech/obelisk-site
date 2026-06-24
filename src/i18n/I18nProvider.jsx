import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import zh from './zh.json'
import en from './en.json'

const dicts = { zh, en }
const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('obelisk-lang') || 'zh')
  const [tick, setTick] = useState(0)

  const t = useCallback((key) => {
    const keys = key.split('.')
    let val = dicts[lang]
    for (const k of keys) {
      if (val && typeof val === 'object') val = val[k]
      else break
    }
    return val || key
  }, [lang, tick])

  const switchLang = useCallback((l) => {
    localStorage.setItem('obelisk-lang', l)
    setLang(l)
    setTick(v => v + 1)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, t, switchLang, tick }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslation = () => useContext(I18nContext)
