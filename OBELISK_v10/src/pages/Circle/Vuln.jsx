import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { Link } from 'react-router-dom';
import { Bug, ArrowLeft, Shield, AlertTriangle, Calendar, Tag } from 'lucide-react';

const mockVulns = [
  { id: 1, title: 'CVE-2024-XXXX: XXE in Popular CMS', severity: 'High', type: 'XXE', date: '2024-06-15', status: 'analyzed', cve: 'CVE-2024-XXXX', cvss: 8.5 },
  { id: 2, title: 'SQL Injection in Legacy App', severity: 'Critical', type: 'SQLi', date: '2024-05-20', status: 'analyzed', cve: 'N/A', cvss: 9.1 },
  { id: 3, title: 'SSRF via PDF Generator', severity: 'Medium', type: 'SSRF', date: '2024-04-10', status: 'analyzed', cve: 'CVE-2024-YYYY', cvss: 6.8 },
  { id: 4, title: 'JWT None Algorithm Bypass', severity: 'High', type: 'Auth', date: '2024-03-25', status: 'analyzed', cve: 'N/A', cvss: 8.0 },
  { id: 5, title: 'Path Traversal in File Upload', severity: 'Medium', type: 'Path Traversal', date: '2024-06-18', status: 'analyzed', cve: 'CVE-2024-ZZZZ', cvss: 7.2 },
  { id: 6, title: 'RCE in Apache Struts', severity: 'Critical', type: 'RCE', date: '2024-02-14', status: 'analyzed', cve: 'CVE-2024-AAAA', cvss: 9.8 },
];

const severityStyle = {
  Critical: 'bg-black text-white',
  High: 'bg-black/80 text-white',
  Medium: 'bg-black/40 text-white',
  Low: 'bg-black/10 text-black',
};

export const CircleVuln = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockVulns : mockVulns.filter(v => v.severity === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/circle" className="p-2 hover:bg-black/5 rounded transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-3xl font-light tracking-wide">{t('circle.vuln.title')}</h1>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {['all', 'Critical', 'High', 'Medium'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm border transition-colors ${filter === f ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard className="hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-black/10 flex items-center justify-center">
                    <Bug className="w-5 h-5 text-black/30" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-black/40 flex items-center gap-1"><Tag className="w-3 h-3" /> {item.type}</span>
                      <span className="text-xs text-black/30 flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                      <span className="text-xs text-black/30">{item.cve}</span>
                    </div>
                  </div>
                </div>
                <div className="md:ml-auto flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 ${severityStyle[item.severity]}`}>{item.severity}</span>
                  <span className="text-xs font-mono bg-black/5 px-2 py-1">CVSS: {item.cvss}</span>
                  <span className="text-xs flex items-center gap-1 text-black/40"><Shield className="w-3 h-3" /> {item.status}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
