import { useAuth } from '../../auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/GlassCard';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export const BeiKeFollowing = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center pt-24">
        <p className="text-black/40">{t('beike.loginToView')}</p>
        <Link to="/" className="btn-primary mt-4 inline-block">{t('auth.login')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-2">{t('nav.beike')}</h1>
        <div className="flex gap-4 text-sm text-black/40">
          <Link to="/beike" className="hover:text-black transition">{t('beike.discover')}</Link>
          <Link to="/beike/following" className="text-black font-medium">{t('beike.following')}</Link>
          <Link to="/beike/mine" className="hover:text-black transition">{t('beike.mine')}</Link>
          <Link to="/beike/topics" className="hover:text-black transition">{t('beike.topics')}</Link>
        </div>
      </motion.div>
      <GlassCard className="text-center py-20">
        <MessageSquare className="w-8 h-8 mx-auto mb-3 text-black/10" />
        <p className="text-black/40">{t('beike.followingEmpty')}</p>
      </GlassCard>
    </div>
  );
};