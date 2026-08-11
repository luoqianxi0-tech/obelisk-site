import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { Palette, Figma, Layers, Type, Image, Grid, ExternalLink, PenTool, Layout, Monitor, Code, Sparkles } from 'lucide-react';

const designResources = [
  { name: 'Figma', desc: 'Interface design tool with real-time collaboration.', url: 'https://figma.com', category: 'UI/UX', icon: Figma },
  { name: 'Dribbble', desc: 'Design inspiration and portfolio platform.', url: 'https://dribbble.com', category: 'Inspiration', icon: Palette },
  { name: 'Behance', desc: 'Creative work showcase by Adobe.', url: 'https://behance.net', category: 'Portfolio', icon: Layers },
  { name: 'Unsplash', desc: 'Free high-resolution photos.', url: 'https://unsplash.com', category: 'Photos', icon: Image },
  { name: 'Google Fonts', desc: 'Free and open source font families.', url: 'https://fonts.google.com', category: 'Typography', icon: Type },
  { name: 'Coolors', desc: 'Color palette generator.', url: 'https://coolors.co', category: 'Color', icon: Palette },
  { name: 'Iconoir', desc: 'Open source icon library.', url: 'https://iconoir.com', category: 'Icons', icon: Grid },
  { name: 'Mobbin', desc: 'Mobile design patterns library.', url: 'https://mobbin.com', category: 'Patterns', icon: Layout },
  { name: 'LottieFiles', desc: 'Lightweight animations for web and mobile.', url: 'https://lottiefiles.com', category: 'Animation', icon: Sparkles },
  { name: 'Spline', desc: '3D design tool for the web.', url: 'https://spline.design', category: '3D', icon: Monitor },
  { name: 'Framer', desc: 'Prototyping tool for interactive designs.', url: 'https://framer.com', category: 'Prototyping', icon: PenTool },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS framework.', url: 'https://tailwindcss.com', category: 'CSS', icon: Code },
  { name: 'Shadcn UI', desc: 'Beautifully designed components.', url: 'https://ui.shadcn.com', category: 'Components', icon: Layout },
  { name: 'Radix UI', desc: 'Unstyled, accessible components.', url: 'https://radix-ui.com', category: 'Components', icon: Grid },
  { name: 'Lucide', desc: 'Beautiful consistent icon toolkit.', url: 'https://lucide.dev', category: 'Icons', icon: Sparkles },
  { name: 'Font Awesome', desc: 'Popular icon library and toolkit.', url: 'https://fontawesome.com', category: 'Icons', icon: Type },
];

export const Design = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.design')}</h1>
        <p className="text-black/40">{t('design.subtitle')}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {designResources.map((item, i) => (
          <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
              <GlassCard className="h-full hover:shadow-lg transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 border border-black/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-black/30" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-black/15 group-hover:text-black/30 transition-colors" />
                </div>
                <h3 className="text-lg font-medium mb-2 group-hover:underline decoration-1 underline-offset-4">{item.name}</h3>
                <p className="text-sm text-black/40 mb-4">{item.desc}</p>
                <span className="text-xs bg-black/5 px-2 py-1">{item.category}</span>
              </GlassCard>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
