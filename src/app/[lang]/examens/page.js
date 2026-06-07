'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/hooks/useLang';
import { Check, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParallaxOrb } from '@/components/AmbientGlow';

export default function ExamensPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState('b1');

  return (
    <div className="bg-bg text-white">
      {/* Hero Header with background image */}
      <section className="relative overflow-hidden py-20 md:py-28 text-white text-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/hero_examens.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/20 via-navy-950/65 to-navy-950/85 pointer-events-none" />
        <ParallaxOrb color="gold" speed={0.12} size="w-[350px] h-[350px]" top="20%" right="10%" animationClass="animate-orb-1" opacity="opacity-[0.18]" />
        <ParallaxOrb color="red" speed={0.08} size="w-[250px] h-[250px]" top="40%" left="5%" animationClass="animate-orb-2" opacity="opacity-[0.12]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0c1633] to-transparent pointer-events-none z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-gold-400" />
            {t('exams_eyebrow')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight text-white">{t('exams_title')}</h1>
          <p className="text-navy-200 max-w-xl leading-relaxed text-sm md:text-base mt-4 mx-auto">{t('exams_lead')}</p>
        </div>
      </section>

      {/* Tabs and Details - Full width background section with inner max-w container */}
      <section className="py-20 section-navy-mid">
        <div className="max-w-5xl mx-auto px-6">
          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            {['b1', 'b2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveTab(lvl)}
                className={`px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all border cursor-pointer ${
                  activeTab === lvl
                    ? 'bg-gold-400 text-navy-950 border-gold-400 shadow-md scale-105'
                    : 'bg-white/5 border-gold-400/15 text-white/70 hover:border-gold-400/40'
                }`}
              >
                telc Deutsch {lvl.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="card-navy-glass border border-gold-400/10 rounded-3xl p-8 md:p-12 min-h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              {activeTab === 'b1' ? (
                <motion.div
                  key="b1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full"
                >
                  <div className="md:col-span-7 flex flex-col gap-5">
                    <span className="inline-block bg-navy-700 text-navy-200 text-xs font-bold px-3 py-1.5 rounded-lg w-fit">
                      {t('exams_level_b1')}
                    </span>
                    <p className="text-navy-200 text-base leading-relaxed">{t('exams_b1_desc')}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {[
                        t('exams_b1_item1'),
                        t('exams_b1_item2'),
                        t('exams_b1_item3'),
                        t('exams_b1_item4'),
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-navy-200">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/${lang}/dates?filter=B1`}
                      className="btn-gold-grad px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider w-fit mt-6 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      {t('exams_btn_register_b1')}
                    </Link>
                  </div>

                  <div className="md:col-span-5 relative aspect-3/4 w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-md border border-gold-400/10 bg-navy-800 flex items-center justify-center">
                    <Image
                      src="/assets/telc_certificate.png"
                      alt="telc B1 Certificate"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="b2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full"
                >
                  <div className="md:col-span-7 flex flex-col gap-5">
                    <span className="inline-block bg-navy-700 text-navy-200 text-xs font-bold px-3 py-1.5 rounded-lg w-fit">
                      {t('exams_level_b2')}
                    </span>
                    <p className="text-navy-200 text-base leading-relaxed">{t('exams_b2_desc')}</p>
                    
                    <div className="grid grid-cols-1 gap-3.5 mt-2">
                      {[
                        t('exams_b2_item1'),
                        t('exams_b2_item2'),
                        t('exams_b2_item3'),
                        t('exams_b2_item4'),
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-navy-200">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/${lang}/dates?filter=B2`}
                      className="btn-gold-grad px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider w-fit mt-6 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      {t('exams_btn_register_b2')}
                    </Link>
                  </div>

                  <div className="md:col-span-5 relative aspect-3/4 w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden shadow-md border border-gold-400/10 bg-navy-800 flex items-center justify-center">
                    <Image
                      src="/assets/telc_certificate.png"
                      alt="telc B2 Certificate"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
