import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Search, Wrench, ExternalLink, Star, Filter, Copy, Check } from 'lucide-react';

const resources = [
  { name: 'Frida', desc: 'Dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers.', url: 'https://frida.re', category: 'Mobile', tags: ['Hook', 'iOS', 'Android'] },
  { name: 'Ghidra', desc: 'Software reverse engineering framework developed by NSA.', url: 'https://ghidra-sre.org', category: 'Reverse', tags: ['Decompiler', 'Static'] },
  { name: 'Burp Suite', desc: 'Web vulnerability scanner and proxy tool.', url: 'https://portswigger.net/burp', category: 'Web', tags: ['Proxy', 'Scanner'] },
  { name: 'Wireshark', desc: 'Network protocol analyzer for Unix and Windows.', url: 'https://wireshark.org', category: 'Network', tags: ['PCAP', 'Analysis'] },
  { name: 'IDA Pro', desc: 'Multi-processor disassembler and debugger.', url: 'https://hex-rays.com/ida-pro', category: 'Reverse', tags: ['Disassembler', 'Debugger'] },
  { name: 'Metasploit', desc: 'Penetration testing framework.', url: 'https://metasploit.com', category: 'Pentest', tags: ['Exploit', 'Framework'] },
  { name: 'Nmap', desc: 'Network discovery and security auditing.', url: 'https://nmap.org', category: 'Network', tags: ['Scanner', 'Port'] },
  { name: 'SQLMap', desc: 'Automatic SQL injection and database takeover.', url: 'https://sqlmap.org', category: 'Web', tags: ['SQLi', 'Injection'] },
  { name: 'AFL++', desc: 'Fuzzing framework for finding bugs.', url: 'https://aflplus.plus', category: 'Fuzzing', tags: ['Fuzz', 'Bug'] },
  { name: 'Radare2', desc: 'Unix-like reverse engineering framework and commandline tools.', url: 'https://rada.re', category: 'Reverse', tags: ['RE', 'CLI'] },
  { name: 'Apktool', desc: 'Tool for reverse engineering Android apk files.', url: 'https://ibotpeaches.github.io/Apktool', category: 'Mobile', tags: ['APK', 'Android'] },
  { name: 'JADX', desc: 'Dex to Java decompiler.', url: 'https://github.com/skylot/jadx', category: 'Mobile', tags: ['Decompiler', 'Java'] },
  { name: 'Objection', desc: 'Runtime mobile exploration toolkit.', url: 'https://github.com/sensepost/objection', category: 'Mobile', tags: ['Runtime', 'iOS'] },
  { name: 'MobSF', desc: 'Mobile Security Framework for automated analysis.', url: 'https://mobsf.github.io', category: 'Mobile', tags: ['Analysis', 'Auto'] },
  { name: 'OWASP ZAP', desc: 'Web application security scanner.', url: 'https://zaproxy.org', category: 'Web', tags: ['Scanner', 'OWASP'] },
  { name: 'John the Ripper', desc: 'Password cracking tool.', url: 'https://openwall.com/john', category: 'Crypto', tags: ['Password', 'Crack'] },
  { name: 'Hashcat', desc: "World's fastest password recovery utility.", url: 'https://hashcat.net', category: 'Crypto', tags: ['GPU', 'Password'] },
  { name: 'Volatility', desc: 'Memory forensics framework.', url: 'https://volatilityfoundation.org', category: 'Forensics', tags: ['Memory', 'RAM'] },
  { name: 'CFF Explorer', desc: 'PE editor and binary analysis tool.', url: 'https://ntcore.com/?page_id=388', category: 'Windows', tags: ['PE', 'Binary'] },
  { name: 'x64dbg', desc: 'Open source x64/x32 debugger for Windows.', url: 'https://x64dbg.com', category: 'Windows', tags: ['Debugger', 'Windows'] },
  { name: 'dnSpy', desc: '.NET debugger and assembly editor.', url: 'https://github.com/dnSpy/dnSpy', category: 'Windows', tags: ['.NET', 'Debugger'] },
  { name: 'PE-bear', desc: 'Portable reversing tool for PE files.', url: 'https://github.com/hasherezade/pe-bear', category: 'Windows', tags: ['PE', 'GUI'] },
  { name: 'YARA', desc: 'Pattern matching tool for malware researchers.', url: 'https://virustotal.github.io/yara', category: 'Malware', tags: ['Rule', 'Match'] },
  { name: 'Cuckoo Sandbox', desc: 'Automated malware analysis system.', url: 'https://cuckoosandbox.org', category: 'Malware', tags: ['Sandbox', 'Auto'] },
  { name: 'ImHex', desc: 'Hex editor for reverse engineers.', url: 'https://imhex.werwolv.net', category: 'Reverse', tags: ['Hex', 'Editor'] },
  { name: 'RetDec', desc: 'Retargetable machine-code decompiler.', url: 'https://retdec.com', category: 'Reverse', tags: ['Decompiler', 'Static'] },
  { name: 'angr', desc: 'Python framework for analyzing binaries.', url: 'https://angr.io', category: 'Reverse', tags: ['Symbolic', 'Python'] },
  { name: 'Triton', desc: 'Dynamic binary analysis framework.', url: 'https://triton.quarkslab.com', category: 'Reverse', tags: ['DBA', 'Symbolic'] },
];

const categories = ['All', 'Mobile', 'Reverse', 'Web', 'Network', 'Pentest', 'Fuzzing', 'Crypto', 'Forensics', 'Windows', 'Malware'];

export const Arsenal = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copied, setCopied] = useState(null);

  const filtered = resources.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = activeCategory === 'All' || r.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const copyUrl = (url, name) => {
    navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.arsenal')}</h1>
        <p className="text-black/40">{t('arsenal.subtitle')}</p>
      </motion.div>

      <GlassCard className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t('arsenal.search')} className="w-full pl-10 pr-4 py-2 bg-white/30 border border-black/5 text-sm focus:outline-none focus:border-black/20" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-black/30 shrink-0" />
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs whitespace-nowrap border transition-colors ${activeCategory === cat ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, i) => (
          <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <GlassCard className="h-full hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-black/25" />
                  <h3 className="font-medium group-hover:underline decoration-1 underline-offset-4">{item.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => copyUrl(item.url, item.name)} className="p-1.5 hover:bg-black/5 rounded transition-colors" title="Copy URL">
                    {copied === item.name ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-black/25" />}
                  </button>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-black/5 rounded transition-colors">
                    <ExternalLink className="w-4 h-4 text-black/25" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-black/40 mb-4 leading-relaxed">{item.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => <span key={tag} className="text-[10px] bg-black/5 px-1.5 py-0.5">{tag}</span>)}
                </div>
                <span className="text-xs text-black/25">{item.category}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-black/30">{t('arsenal.noResults')}</div>
      )}
    </div>
  );
};
