import Link from 'next/link';
import { getTranslation } from '@/lib/i18n';
import { Calendar, PhoneCall, FileText, Award, BookOpen, Laptop } from 'lucide-react';
import { ParallaxOrb } from '@/components/AmbientGlow';

export default async function OffresPage({ params }) {
  const { lang } = await params;
  const t = (key) => getTranslation(lang, key);

  return (
    <div className="bg-bg text-white min-h-screen relative overflow-hidden">
      {/* Hero Header with background image */}
      <section className="relative overflow-hidden py-20 md:py-28 text-white text-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/hero_offres.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/20 via-navy-950/65 to-navy-950/85 pointer-events-none" />
        <ParallaxOrb color="gold" speed={0.12} size="w-[350px] h-[350px]" top="20%" right="10%" animationClass="animate-orb-1" opacity="opacity-[0.18]" />
        <ParallaxOrb color="navy" speed={0.08} size="w-[250px] h-[250px]" top="40%" left="5%" animationClass="animate-orb-2" opacity="opacity-[0.12]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0c1633] to-transparent pointer-events-none z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-gold-400" />
            {t('offers_eyebrow')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight text-white">{t('offers_title')}</h1>
          <p className="text-navy-200 max-w-xl leading-relaxed text-sm md:text-base mt-4 mx-auto">{t('offers_lead')}</p>
        </div>
      </section>

      {/* Detailed Grid */}
      <section className="py-20 relative overflow-hidden section-navy-mid">
        <ParallaxOrb color="warmGold" speed={0.05} size="w-[300px] h-[300px]" top="50%" right="5%" animationClass="animate-orb-3" opacity="opacity-[0.1]" />
        <ParallaxOrb color="navy" speed={0.07} size="w-[280px] h-[280px]" top="10%" left="2%" animationClass="animate-orb-1" opacity="opacity-[0.15]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card-navy-glass backdrop-blur-xl rounded-[24px] p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-start h-full">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-gold-400/10 border border-gold-400/25 text-gold-400 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">{t('offers_card1_title')}</h3>
                <p className="text-sm text-navy-200 leading-relaxed">{t('offers_card1_desc')}</p>
              </div>
              <Link 
                href={`/${lang}/dates`} 
                className="btn-gold-grad w-full py-3.5 rounded-2xl text-center text-xs font-bold uppercase tracking-wider mt-8 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {t('hero_btn_dates')}
              </Link>
            </div>

            {/* Card 2 Featured */}
            <div className="premium-border p-[1px] h-full transition-transform duration-300 hover:-translate-y-1">
              <div className="bg-navy-950/85 backdrop-blur-xl rounded-[23px] p-8 h-full flex flex-col justify-between items-start relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gold-400 text-navy-950 font-bold uppercase tracking-wider text-[9px] px-2.5 py-1 rounded-full">
                  {t('offers_card2_badge')}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 bg-gold-400/10 border border-gold-400/25 text-gold-400 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white">{t('offers_card2_title')}</h3>
                  <p className="text-sm text-navy-200 leading-relaxed">{t('offers_card2_desc')}</p>
                </div>
                <Link 
                  href={`/${lang}/contact`} 
                  className="btn-gold-grad w-full py-3.5 rounded-2xl text-center text-xs font-bold uppercase tracking-wider mt-8 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {t('prep_btn')}
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-navy-glass backdrop-blur-xl rounded-[24px] p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between items-start h-full">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-gold-400/10 border border-gold-400/25 text-gold-400 rounded-2xl flex items-center justify-center">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">{t('offers_card3_title')}</h3>
                <p className="text-sm text-navy-200 leading-relaxed">{t('offers_card3_desc')}</p>
              </div>
              <Link 
                href="?advice=true" 
                className="btn-navy-grad w-full py-3.5 rounded-2xl text-center text-xs font-bold uppercase tracking-wider mt-8 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-gold-400" />
                {t('hero_btn_advice')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
