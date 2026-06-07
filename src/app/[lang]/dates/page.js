import { getTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import DatesClientPage from '@/components/DatesClientPage';
import { ParallaxOrb } from '@/components/AmbientGlow';

async function getAllExams() {
  try {
    const { data, error } = await supabase
      .from('exam_dates')
      .select('*')
      .neq('status', 'cancelled')
      .gte('exam_date', new Date().toISOString().split('T')[0])
      .order('exam_date', { ascending: true });
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn('Exams fetch failed server-side, using fallbacks.');
  }

  // Fallback demo data
  return [
    { id: 'demo-1', exam_type: 'B1', exam_date: '2026-07-12', exam_time: '09:00', registration_deadline: '2026-07-05', available_spots: 14, total_spots: 20, price_eur: 180, status: 'open' },
    { id: 'demo-2', exam_type: 'B2', exam_date: '2026-07-19', exam_time: '09:00', registration_deadline: '2026-07-12', available_spots: 8, total_spots: 20, price_eur: 220, status: 'open' },
    { id: 'demo-3', exam_type: 'B1', exam_date: '2026-08-09', exam_time: '09:00', registration_deadline: '2026-08-02', available_spots: 20, total_spots: 20, price_eur: 180, status: 'open' },
    { id: 'demo-4', exam_type: 'B2', exam_date: '2026-08-23', exam_time: '09:00', registration_deadline: '2026-08-16', available_spots: 3, total_spots: 20, price_eur: 220, status: 'open' },
    { id: 'demo-5', exam_type: 'B1_oral', exam_date: '2026-07-26', exam_time: '10:00', registration_deadline: '2026-07-19', available_spots: 10, total_spots: 10, price_eur: 80, status: 'open' },
    { id: 'demo-6', exam_type: 'B1_written', exam_date: '2026-07-26', exam_time: '09:00', registration_deadline: '2026-07-19', available_spots: 0, total_spots: 15, price_eur: 120, status: 'full' },
  ];
}

export default async function DatesPage({ params }) {
  const { lang } = await params;
  const t = (key) => getTranslation(lang, key);

  const initialExams = await getAllExams();

  return (
    <div className="relative min-h-screen bg-bg text-white overflow-hidden">
      {/* Full-page Background Image and Overlays */}
      <div 
        className="absolute top-0 left-0 right-0 h-[800px] md:h-[1000px] bg-cover bg-top bg-no-repeat pointer-events-none z-0" 
        style={{ backgroundImage: "url('/assets/hero_dates.png')" }} 
      />
      <div className="absolute top-0 left-0 right-0 h-[800px] md:h-[1000px] bg-gradient-to-b from-navy-950/15 via-navy-950/40 to-bg pointer-events-none z-0" />
      
      {/* Orbs wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <ParallaxOrb color="gold" speed={0.12} size="w-[350px] h-[350px]" top="15%" right="10%" animationClass="animate-orb-1" opacity="opacity-[0.18]" />
        <ParallaxOrb color="navy" speed={0.08} size="w-[300px] h-[300px]" top="35%" left="5%" animationClass="animate-orb-3" opacity="opacity-[0.12]" />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        {/* Header Hero */}
        <header className="max-w-7xl mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-24 text-center">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-gold-400" />
            {t('dates_eyebrow')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight text-white">{t('dates_title')}</h1>
          <p className="text-navy-200 max-w-xl leading-relaxed text-sm md:text-base mt-4 mx-auto">{t('dates_lead')}</p>
        </header>

        {/* Interactive Dates Area */}
        <main className="pb-24">
          <DatesClientPage lang={lang} initialExams={initialExams} />
        </main>
      </div>
    </div>
  );
}
