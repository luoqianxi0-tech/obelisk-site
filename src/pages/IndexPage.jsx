import { useState } from 'react'
import { useI18n } from '../i18n.jsx'

export default function IndexPage() {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('tools')

  const tools = [
    { name: 'Ghidra', cat: 'reverse', url: 'https://ghidra-sre.org' },
    { name: 'IDA Pro', cat: 'reverse', url: 'https://hex-rays.com' },
    { name: 'Binary Ninja', cat: 'reverse', url: 'https://binary.ninja' },
    { name: 'x64dbg', cat: 'reverse', url: 'https://x64dbg.com' },
    { name: 'dnSpy', cat: 'reverse', url: 'https://github.com/dnSpy/dnSpy' },
    { name: 'ILSpy', cat: 'reverse', url: 'https://github.com/icsharpcode/ILSpy' },
    { name: 'JADX', cat: 'reverse', url: 'https://github.com/skylot/jadx' },
    { name: 'Apktool', cat: 'reverse', url: 'https://ibotpeaches.github.io/Apktool' },
    { name: 'Frida', cat: 'mobile', url: 'https://frida.re' },
    { name: ' objection', cat: 'mobile', url: 'https://github.com/sensepost/objection' },
    { name: 'Burp Suite', cat: 'web', url: 'https://portswigger.net' },
    { name: 'OWASP ZAP', cat: 'web', url: 'https://zaproxy.org' },
    { name: 'SQLMap', cat: 'web', url: 'https://sqlmap.org' },
    { name: 'Nmap', cat: 'web', url: 'https://nmap.org' },
    { name: 'Metasploit', cat: 'web', url: 'https://metasploit.com' },
    { name: 'Cobalt Strike', cat: 'web', url: 'https://cobaltstrike.com' },
    { name: 'Hashcat', cat: 'crypto', url: 'https://hashcat.net' },
    { name: 'John', cat: 'crypto', url: 'https://openwall.com/john' },
    { name: 'CyberChef', cat: 'crypto', url: 'https://gchq.github.io/CyberChef' },
    { name: 'Volatility', cat: 'forensics', url: 'https://volatilityfoundation.org' },
    { name: 'Autopsy', cat: 'forensics', url: 'https://autopsy.com' },
    { name: 'Wireshark', cat: 'forensics', url: 'https://wireshark.org' },
    { name: 'YARA', cat: 'forensics', url: 'https://virustotal.github.io/yara' },
    { name: 'PwnDbg', cat: 'pwn', url: 'https://github.com/pwndbg/pwndbg' },
    { name: 'PEDA', cat: 'pwn', url: 'https://github.com/longld/peda' },
    { name: 'ROPgadget', cat: 'pwn', url: 'https://github.com/JonathanSalwan/ROPgadget' },
    { name: 'one_gadget', cat: 'pwn', url: 'https://github.com/david942j/one_gadget' },
    { name: 'pwntools', cat: 'pwn', url: 'https://docs.pwntools.com' },
    { name: 'Angr', cat: 'pwn', url: 'https://angr.io' },
    { name: 'AFL++', cat: 'misc', url: 'https://aflplus.plus' },
    { name: 'LibFuzzer', cat: 'misc', url: 'https://llvm.org/docs/LibFuzzer.html' },
  ]

  const docs = [
    { name: 'Intel SDM', cat: 'docs', url: 'https://intel.com/sdm' },
    { name: 'ARM Architecture', cat: 'docs', url: 'https://developer.arm.com' },
    { name: 'AMD64 ABI', cat: 'docs', url: 'https://gitlab.com/x86-psABIs' },
    { name: 'ELF Format', cat: 'docs', url: 'https://refspecs.linuxfoundation.org/elf' },
    { name: 'PE Format', cat: 'docs', url: 'https://docs.microsoft.com/windows/win32/debug/pe-format' },
    { name: 'Mach-O Format', cat: 'docs', url: 'https://developer.apple.com/library/archive/documentation/Performance/Conceptual/CodeFootprint/Articles/MachOOverview.html' },
    { name: 'DEX Format', cat: 'docs', url: 'https://source.android.com/devices/tech/dalvik/dex-format' },
    { name: 'OWASP Testing Guide', cat: 'docs', url: 'https://owasp.org' },
    { name: 'RFC Index', cat: 'docs', url: 'https://rfc-editor.org' },
    { name: 'CVE List', cat: 'docs', url: 'https://cve.mitre.org' },
  ]

  const systems = [
    { name: 'Kali Linux', cat: 'systems', url: 'https://kali.org' },
    { name: 'Parrot OS', cat: 'systems', url: 'https://parrotsec.org' },
    { name: 'BlackArch', cat: 'systems', url: 'https://blackarch.org' },
    { name: 'REMnux', cat: 'systems', url: 'https://remnux.org' },
    { name: 'Qubes OS', cat: 'systems', url: 'https://qubes-os.org' },
    { name: 'Tails', cat: 'systems', url: 'https://tails.net' },
    { name: 'Whonix', cat: 'systems', url: 'https://whonix.org' },
    { name: 'Arch Linux', cat: 'systems', url: 'https://archlinux.org' },
    { name: 'NixOS', cat: 'systems', url: 'https://nixos.org' },
    { name: 'Gentoo', cat: 'systems', url: 'https://gentoo.org' },
  ]

  const data = { tools, docs, systems }
  const filtered = data[tab].filter(item =>
    !search || item.name.toLowerCase().includes(search.toLowerCase())
  )

  const catLabels = {
    reverse: t('index.reverse'), pwn: t('index.pwn'), web: t('index.web'),
    crypto: t('index.crypto'), forensics: t('index.forensics'), misc: t('index.misc'),
    mobile: t('index.mobile'), docs: t('index.docs'), systems: t('index.systems')
  }

  const catColors = {
    reverse: 'bg-orange-50 text-orange-700', pwn: 'bg-red-50 text-red-700', web: 'bg-blue-50 text-blue-700',
    crypto: 'bg-purple-50 text-purple-700', forensics: 'bg-amber-50 text-amber-700', misc: 'bg-gray-50 text-gray-700',
    mobile: 'bg-emerald-50 text-emerald-700', docs: 'bg-cyan-50 text-cyan-700', systems: 'bg-indigo-50 text-indigo-700'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-obelisk-line">{t('index.title')}</h1>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('index.search')}
          className="w-full mt-4 px-4 py-2.5 rounded-xl bg-white border border-obelisk-border text-sm focus:outline-none focus:border-obelisk-line"
        />
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'tools', label: t('index.tools') },
          { key: 'docs', label: t('index.docs') },
          { key: 'systems', label: t('index.systems') },
        ].map(tItem => (
          <button
            key={tItem.key}
            onClick={() => setTab(tItem.key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === tItem.key ? 'bg-obelisk-line text-white' : 'bg-white border border-obelisk-border text-obelisk-textMuted hover:bg-black/5'
            }`}
          >
            {tItem.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="glass-card rounded-xl p-4 hover:bg-white/80 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-obelisk-line text-sm">{item.name}</div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-1 inline-block ${catColors[item.cat] || 'bg-gray-50'}`}>
                {catLabels[item.cat] || item.cat}
              </span>
            </div>
            <svg className="w-4 h-4 text-obelisk-textLight shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center text-obelisk-textMuted">{t('settings.empty')}</div>
      )}
    </div>
  )
}
