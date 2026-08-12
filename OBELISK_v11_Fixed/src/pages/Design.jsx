import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Palette, Figma, PenTool, Layers, Box, Image as ImageIcon, Type, Grid3X3 } from 'lucide-react';

const tools = [
  { icon: Figma, name: 'Figma', desc: 'Interface design tool', url: 'https://figma.com' },
  { icon: PenTool, name: 'Sketch', desc: 'Digital design platform', url: 'https://sketch.com' },
  { icon: Layers, name: 'Adobe XD', desc: 'UX/UI design', url: 'https://adobe.com/products/xd' },
  { icon: Box, name: 'Blender', desc: '3D creation suite', url: 'https://blender.org' },
  { icon: ImageIcon, name: 'GIMP', desc: 'Image manipulation', url: 'https://gimp.org' },
  { icon: Type, name: 'Google Fonts', desc: 'Free font library', url: 'https://fonts.google.com' },
  { icon: Grid3X3, name: 'Dribbble', desc: 'Design inspiration', url: 'https://dribbble.com' },
  { icon: Palette, name: 'Coolors', desc: 'Color palette generator', url: 'https://coolors.co' },
];

export const Design = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.design')}</h1>
        <p className="text-black/40">{t('design.subtitle')}</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, i) => (
          <motion.a key={tool.name} href={tool.url} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="h-full group hover:shadow-md transition-shadow">
              <tool.icon className="w-6 h-6 text-black/30 mb-3" />
              <h3 className="text-sm font-medium mb-1">{tool.name}</h3>
              <p className="text-xs text-black/40">{tool.desc}</p>
            </GlassCard>
          </motion.a>
        ))}
      </div>
    </div>
  );
};