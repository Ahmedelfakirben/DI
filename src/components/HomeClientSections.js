'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';
import { ChevronRight, Calendar, ArrowRight, User, Award, Lightbulb, Globe, FileText, BookOpen, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedHeading from '@/components/AnimatedHeading';
import TiltCard from '@/components/TiltCard';
import { ParallaxOrb } from '@/components/AmbientGlow';
import { ExamCalendar } from './DatesClientPage';


export default function HomeClientSections({ lang, exams, blogPosts, faqs }) {
  const { t } = useLang();
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Helper date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
    return d.toLocaleDateString(locales[lang] || 'fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '—';
    return timeStr.substring(0, 5);
  };

  const getLevelLabel = (type) => {
    const map = {
      B1: 'B1',
      B2: 'B2',
      B1_oral: 'B1 Oral',
      B1_written: 'B1 Written',
      B2_oral: 'B2 Oral',
      B2_written: 'B2 Written',
    };
    return map[type] || type;
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      telc: Award,
      conseils: Lightbulb,
      integration: Globe,
      examen: FileText,
      general: BookOpen
    };
    const IconComponent = icons[cat] || Newspaper;
    return <IconComponent className="w-12 h-12 text-gold-400 filter drop-shadow-md" />;
  };

  const toggleFaq = (idx) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      {/* ── Exam Dates Preview — Navy mid ───────────────────── */}
      <section 
        className="py-24 text-white relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero_dates.png')" }}
      >
        {/* Warm overlay with gold tint for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 via-navy-950/65 to-navy-950/85 pointer-events-none z-0" />
        
        {/* Top and Bottom smooth fade transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#070c1e] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070c1e] to-transparent pointer-events-none z-10" />
        
        {/* Glow Spheres */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <ParallaxOrb color="gold" speed={0.15} size="w-[350px] h-[350px]" top="20%" right="-10%" animationClass="animate-orb-1" opacity="opacity-[0.18]" />
          <ParallaxOrb color="navy" speed={0.1} size="w-[400px] h-[400px]" top="40%" left="-10%" animationClass="animate-orb-3" opacity="opacity-[0.12]" />
        </div>
        
        {/* Bottom gold separator */}
        <div className="absolute bottom-0 left-0 right-0 gold-separator z-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gold-400" />
                {t('dates_eyebrow')}
              </span>
              <AnimatedHeading 
                text={t('dates_title')}
                highlightWords={['sessions', 'examens', 'Exam', 'Sessions', 'Prüfungstermine']}
                as="h2"
                className="text-3xl md:text-4xl font-extrabold font-display leading-tight mt-3 text-white"
              />
              <p className="text-navy-200 text-sm md:text-base mt-2 max-w-xl">
                {t('dates_lead')}
              </p>
            </div>
            <Link
              href={`/${lang}/dates`}
              className="px-6 py-3.5 rounded-full border border-gold-400/20 hover:border-gold-400/50 hover:bg-white/5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-white shrink-0 transition-all cursor-pointer"
            >
              {t('hero_btn_dates')}
              <ChevronRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>

          {/* Two-column layout: Calendar + Filters/Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Calendar Column */}
            <div className="lg:col-span-4">
              <ExamCalendar
                exams={exams}
                lang={lang}
                onSelectDate={(dateStr) => setSelectedDate((prev) => (prev === dateStr ? null : dateStr))}
                selectedDate={selectedDate}
              />
            </div>

            {/* Table Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Selected date indicator */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-400/10 border border-gold-400/20"
                  >
                    <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                    <span className="text-xs font-bold text-gold-300">
                      {lang === 'de' ? 'Gefiltert nach: ' : lang === 'en' ? 'Filtered by: ' : 'Filtré par: '}
                      <span className="text-white">{formatDate(selectedDate)}</span>
                    </span>
                    <button onClick={() => setSelectedDate(null)} className="ml-auto text-[10px] font-bold text-gold-400 uppercase tracking-wider hover:text-gold-300 cursor-pointer">
                      {lang === 'de' ? 'Zurücksetzen' : lang === 'en' ? 'Clear' : 'Effacer'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table Container */}
              <div className="border border-gold-400/10 card-navy-glass rounded-[32px] overflow-hidden shadow-xl">
                {(() => {
                  const displayExams = selectedDate
                    ? exams.filter((exam) => exam.exam_date === selectedDate)
                    : exams.slice(0, 4);

                  if (displayExams.length === 0) {
                    return (
                      <div className="p-12 text-center text-navy-200">
                        <Calendar className="w-12 h-12 text-navy-300 mx-auto mb-4" />
                        <p className="font-bold text-base mb-1 text-white">No exam dates found</p>
                        <p className="text-xs text-navy-300">{t('table_no_results')}</p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-white/5 text-navy-200 font-bold uppercase tracking-wider text-[9px] md:text-[10px] border-b border-gold-400/10">
                            <th className="py-3.5 px-3 md:px-4">{t('table_head_level')}</th>
                            <th className="py-3.5 px-3 md:px-4">{t('table_head_date')}</th>
                            <th className="py-3.5 px-3 md:px-4">{t('table_head_time')}</th>
                            <th className="py-3.5 px-3 md:px-4">{t('table_head_deadline')}</th>
                            <th className="py-3.5 px-3 md:px-4">{t('table_head_spots')}</th>
                            <th className="py-3.5 px-3 md:px-4">{t('table_head_price')}</th>
                            <th className="py-3.5 px-3 md:px-4 text-right">{t('table_head_action')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-400/5 font-medium text-navy-200">
                          {displayExams.map((exam, idx) => {
                            const spotsRatio = exam.available_spots / exam.total_spots;
                            const isFull = exam.status === 'full' || exam.available_spots === 0;

                            let statusText = t('table_head_status');
                            let statusClass = 'bg-emerald-500/15 text-emerald-400';

                            if (isFull) {
                              statusText = lang === 'de' ? 'Ausgebucht' : lang === 'en' ? 'Full' : 'Complet';
                              statusClass = 'bg-red-500/15 text-red-400';
                            } else if (spotsRatio <= 0.25) {
                              statusText = lang === 'de' ? 'Fast voll' : lang === 'en' ? 'Almost full' : 'Presque complet';
                              statusClass = 'bg-amber-500/15 text-gold-400';
                            } else {
                              statusText = lang === 'de' ? 'Verfügbar' : lang === 'en' ? 'Available' : 'Disponible';
                            }

                            return (
                              <motion.tr 
                                key={exam.id} 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-white/5 transition-colors text-xs md:text-sm"
                              >
                                <td className="py-3.5 px-3 md:px-4">
                                  <span className="inline-block bg-navy-700 border border-gold-400/20 text-white text-[10px] md:text-xs font-extrabold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg whitespace-nowrap">
                                    {getLevelLabel(exam.exam_type)}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 md:px-4 text-white font-bold whitespace-nowrap">
                                  {formatDate(exam.exam_date)}
                                </td>
                                <td className="py-3.5 px-3 md:px-4 font-semibold text-white">{formatTime(exam.exam_time)}</td>
                                <td className="py-3.5 px-3 md:px-4 text-[11px] md:text-xs text-navy-300 whitespace-nowrap">
                                  {formatDate(exam.registration_deadline)}
                                </td>
                                <td className="py-3.5 px-3 md:px-4">
                                  <span className={spotsRatio <= 0.25 && !isFull ? 'text-gold-400 font-extrabold' : 'text-white'}>
                                    {isFull ? '0' : exam.available_spots} / {exam.total_spots}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 md:px-4 font-extrabold text-white whitespace-nowrap">{exam.price_eur} DH</td>
                                <td className="py-3.5 px-3 md:px-4 text-right">
                                  <Link
                                    href={`?register=${exam.id}`}
                                    className={`inline-block px-3 py-1.5 md:px-4 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                                      isFull
                                        ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-50'
                                        : 'btn-gold-grad border-transparent hover:scale-105'
                                    }`}
                                    onClick={(e) => isFull && e.preventDefault()}
                                  >
                                    {isFull
                                      ? lang === 'de'
                                        ? 'Voll'
                                        : lang === 'en'
                                        ? 'Full'
                                        : 'Complet'
                                      : lang === 'de'
                                      ? 'Anmelden'
                                      : lang === 'en'
                                      ? 'Register'
                                      : 'S\'inscrire'}
                                  </Link>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog Grid Preview — Navy deep ──────────────────── */}
      <section 
        className="py-24 text-white relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero_blog.png')" }}
      >
        {/* Warm overlay with gold tint for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 via-navy-950/65 to-navy-950/85 pointer-events-none z-0" />
        
        {/* Top and Bottom smooth fade transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#070c1e] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070c1e] to-transparent pointer-events-none z-10" />
        
        {/* Glow Spheres */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <ParallaxOrb color="navy" speed={0.12} size="w-[380px] h-[380px]" top="15%" left="-10%" animationClass="animate-orb-2" opacity="opacity-[0.15]" />
          <ParallaxOrb color="red" speed={0.18} size="w-[300px] h-[300px]" top="50%" right="-5%" animationClass="animate-orb-1" opacity="opacity-[0.12]" />
        </div>
        
        {/* Bottom gold separator */}
        <div className="absolute bottom-0 left-0 right-0 gold-separator z-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gold-400" />
                {t('blog_eyebrow')}
              </span>
              <AnimatedHeading 
                text={t('blog_title')}
                highlightWords={['blog', 'actualités', 'news', 'Blog', 'Aktuelles']}
                as="h2"
                className="text-3xl md:text-4xl font-extrabold font-display leading-tight mt-3 text-white"
              />
              <p className="text-navy-200 text-sm md:text-base mt-2">
                {t('blog_lead')}
              </p>
            </div>
            <Link
              href={`/${lang}/blog`}
              className="px-6 py-3.5 rounded-full border border-gold-400/20 hover:border-gold-400/50 hover:bg-white/5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-white shrink-0 transition-all cursor-pointer"
            >
              {t('nav_blog')}
              <ChevronRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {blogPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring", 
                  stiffness: 90, 
                  damping: 14, 
                  mass: 1, 
                  delay: idx * 0.08 
                }}
                className="h-full"
              >
                <TiltCard className="h-full">
                  <div className="card-navy-glass rounded-[30px] overflow-hidden flex flex-col h-full group cursor-pointer">
                    <Link href={`/${lang}/blog/${post.slug || post.id}`} className="flex flex-col h-full">
                      <div className="aspect-video w-full bg-navy-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 border-b border-gold-400/5 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent pointer-events-none" />
                        {getCategoryIcon(post.category)}
                      </div>
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div className="flex flex-col gap-2.5">
                          <span className="text-[9px] font-extrabold text-gold-400 uppercase tracking-widest">
                            {post.category || 'blog'}
                          </span>
                          <h3 className="text-base font-bold font-display text-white line-clamp-2 leading-snug group-hover:text-gold-300 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs text-navy-200 line-clamp-3 leading-relaxed">
                            {post.summary}
                          </p>
                        </div>
                        <span className="text-[10px] text-navy-300 mt-6 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5 text-gold-400" /> {formatDate(post.published_at)}
                        </span>
                      </div>
                    </Link>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Accordion Section — Navy mid ────────────────── */}
      <section 
        className="py-24 text-white relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero_faq.png')" }}
      >
        {/* Warm overlay with gold tint for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 via-navy-950/65 to-navy-950/85 pointer-events-none z-0" />
        
        {/* Top and Bottom smooth fade transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#070c1e] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060d1f] to-transparent pointer-events-none z-10" />
        
        {/* Glow Spheres */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <ParallaxOrb color="warmGold" speed={0.14} size="w-[320px] h-[320px]" top="30%" left="-10%" animationClass="animate-orb-3" opacity="opacity-[0.18]" />
          <ParallaxOrb color="navy" speed={0.2} size="w-[450px] h-[450px]" top="10%" right="-15%" animationClass="animate-orb-1" opacity="opacity-[0.12]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center flex flex-col items-center gap-3.5 mb-16">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gold-400" />
              {t('faq_eyebrow')}
              <span className="w-8 h-[2px] bg-gold-400" />
            </span>
            <AnimatedHeading 
              text={t('faq_title')}
              highlightWords={['questions', 'faq', 'answers', 'Fragen', 'Antworten']}
              as="h2"
              className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-white justify-center text-center w-full"
            />
            <div className="german-flag-accent w-20 mt-1" />
          </div>

          <div className="flex flex-col gap-4.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm backdrop-blur-sm ${
                    isOpen 
                      ? 'bg-white/8 border-gold-400/40 shadow-gold-500/10 scale-[1.01]' 
                      : 'bg-white/5 border-gold-400/10 hover:border-gold-400/25'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-5.5 px-6 flex items-center justify-between text-left font-bold text-sm md:text-base text-white hover:text-gold-300 transition-colors cursor-pointer"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <span className={`text-xl font-bold w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isOpen ? 'bg-gold-400 text-navy-950' : 'bg-white/10 text-gold-400'
                    }`}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pb-6 px-6 text-xs md:text-sm text-navy-200 leading-relaxed border-t border-gold-400/10 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-14">
            <Link
              href={`/${lang}/faq`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-gold-400/20 hover:border-gold-400/50 hover:bg-white/5 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
            >
              {t('nav_faq')}
              <ChevronRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
