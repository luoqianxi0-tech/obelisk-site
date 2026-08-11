import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { GlassCard } from '../components/GlassCard';
import { Shield, Plus, Trash2, Save, Upload, Wrench } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const CATEGORIES = ['Mobile', 'Reverse', 'Web', 'Network', 'Pentest', 'Fuzzing', 'Crypto', 'Forensics', 'Windows', 'Malware', 'Design', 'Other'];

export const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const [resources, setResources] = useState([
    { name: '', url: '', desc: '', category: 'Mobile', tags: '' }
  ]);
  const [saved, setSaved] = useState(false);

  if (!isAdmin) return <Navigate to="/" />;

  const addRow = () => setResources([...resources, { name: '', url: '', desc: '', category: 'Mobile', tags: '' }]);
  const removeRow = (i) => setResources(resources.filter((_, idx) => idx !== i));
  const updateRow = (i, field, value) => {
    const updated = [...resources];
    updated[i][field] = value;
    setResources(updated);
    setSaved(false);
  };

  const save = () => {
    const valid = resources.filter(r => r.name.trim() && r.url.trim());
    console.log('Saving resources:', valid);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-6 h-6" />
        <h1 className="text-3xl font-light tracking-wide">{t('nav.admin')}</h1>
      </div>

      <GlassCard className="mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Upload className="w-5 h-5" /> {t('admin.importResources')}</h2>
        <p className="text-sm text-black/40 mb-6">{t('admin.importDesc')}</p>

        <div className="space-y-3">
          {resources.map((r, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-white/30 border border-black/5">
              <input placeholder={t('admin.name')} value={r.name} onChange={e => updateRow(i, 'name', e.target.value)}
                className="md:col-span-2 px-3 py-2 bg-white/50 border border-black/5 text-sm focus:outline-none focus:border-black/20" />
              <input placeholder={t('admin.url')} value={r.url} onChange={e => updateRow(i, 'url', e.target.value)}
                className="md:col-span-3 px-3 py-2 bg-white/50 border border-black/5 text-sm focus:outline-none focus:border-black/20" />
              <input placeholder={t('admin.desc')} value={r.desc} onChange={e => updateRow(i, 'desc', e.target.value)}
                className="md:col-span-4 px-3 py-2 bg-white/50 border border-black/5 text-sm focus:outline-none focus:border-black/20" />
              <select value={r.category} onChange={e => updateRow(i, 'category', e.target.value)}
                className="md:col-span-2 px-3 py-2 bg-white/50 border border-black/5 text-sm focus:outline-none focus:border-black/20">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="md:col-span-1 flex gap-1">
                <button onClick={() => removeRow(i)} className="p-2 hover:bg-red-50 text-red-400 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={addRow} className="btn-secondary flex items-center gap-2"><Plus className="w-4 h-4" /> {t('admin.addRow')}</button>
          <button onClick={save} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> {t('admin.save')}</button>
          {saved && <span className="text-sm text-green-600 flex items-center gap-1">Saved!</span>}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2"><Wrench className="w-5 h-5" /> System Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: '1' },
            { label: 'Total Posts', value: '0' },
            { label: 'Total Resources', value: '28' },
            { label: 'Agent Status', value: 'Offline' },
          ].map(stat => (
            <div key={stat.label} className="p-4 bg-white/30 border border-black/5">
              <div className="text-xs text-black/40 mb-1">{stat.label}</div>
              <div className="text-xl font-light">{stat.value}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
