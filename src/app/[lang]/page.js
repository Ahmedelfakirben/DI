import Image from 'next/image';
import Link from 'next/link';
import { getTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { Calendar, PhoneCall, Award, Users, ShieldCheck, Clock, ArrowRight, BookOpen, Laptop, Building, HeartHandshake } from 'lucide-react';
import HomeClientSections from '@/components/HomeClientSections';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedHeading from '@/components/AnimatedHeading';
import TiltCard from '@/components/TiltCard';
import { ParallaxOrb, DynamicGridTexture } from '@/components/AmbientGlow';


// Fetching functions on Server Side
async function getLatestExams() {
  try {
    const { data, error } = await supabase
      .from('exam_dates')
      .select('*')
      .neq('status', 'cancelled')
      .gte('exam_date', new Date().toISOString().split('T')[0])
      .order('exam_date', { ascending: true });
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn('Exam dates fetch failed server-side, using demo fallback.');
  }

  // Demo Fallback
  return [
    { id: 'demo-1', exam_type: 'B1', exam_date: '2026-07-12', exam_time: '09:00', registration_deadline: '2026-07-05', available_spots: 14, total_spots: 20, price_eur: 180, status: 'open' },
    { id: 'demo-2', exam_type: 'B2', exam_date: '2026-07-19', exam_time: '09:00', registration_deadline: '2026-07-12', available_spots: 8, total_spots: 20, price_eur: 220, status: 'open' },
    { id: 'demo-3', exam_type: 'B1', exam_date: '2026-08-09', exam_time: '09:00', registration_deadline: '2026-08-02', available_spots: 20, total_spots: 20, price_eur: 180, status: 'open' },
    { id: 'demo-4', exam_type: 'B2', exam_date: '2026-08-23', exam_time: '09:00', registration_deadline: '2026-08-16', available_spots: 3, total_spots: 20, price_eur: 220, status: 'open' },
    { id: 'demo-5', exam_type: 'B1_oral', exam_date: '2026-07-26', exam_time: '10:00', registration_deadline: '2026-07-19', available_spots: 10, total_spots: 10, price_eur: 80, status: 'open' },
    { id: 'demo-6', exam_type: 'B1_written', exam_date: '2026-07-26', exam_time: '09:00', registration_deadline: '2026-07-19', available_spots: 0, total_spots: 15, price_eur: 120, status: 'full' },
  ];
}

async function getLatestBlogPosts(lang) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, summary, category, cover_image_url, published_at')
      .eq('published', true)
      .eq('lang', lang)
      .order('published_at', { ascending: false })
      .limit(4);
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn('Blog posts fetch failed server-side, using demo fallback.');
  }

  // Demo Fallback
  const allDemo = [
    { id: 1, slug: '5-conseils-telc-b1-fr', title: '5 conseils pour réussir votre examen telc B1', summary: 'Découvrez les stratégies essentielles pour aborder sereinement chaque épreuve.', category: 'telc', published_at: '2026-06-01', lang: 'fr' },
    { id: 2, slug: 'erreurs-expression-ecrite-fr', title: 'Les erreurs les plus fréquentes en expression écrite', summary: 'Orthographe, grammaire : voici les pièges à éviter absolument lors de votre examen.', category: 'conseils', published_at: '2026-05-25', lang: 'fr' },
    { id: 3, slug: '5-tips-telc-b1-en', title: '5 tips to pass your telc B1 exam', summary: 'Discover essential strategies to approach each section of the telc B1 exam with confidence.', category: 'telc', published_at: '2026-06-01', lang: 'en' },
    { id: 4, slug: 'common-writing-mistakes-en', title: 'Most common writing mistakes', summary: 'Spelling, grammar: here are the traps you must avoid during your exam.', category: 'conseils', published_at: '2026-05-25', lang: 'en' },
    { id: 5, slug: '5-tipps-telc-b1-de', title: '5 Tipps zum Bestehen Ihrer telc B1-Prüfung', summary: 'Entdecken Sie wichtige Strategien, um jeden Teil der telc B1-Prüfung selbstbewusst anzugehen.', category: 'telc', published_at: '2026-06-01', lang: 'de' },
    { id: 6, slug: 'haeufige-schreibfehler-de', title: 'Die häufigsten Fehler im schriftlichen Ausdruck', summary: 'Rechtschreibung, Grammatik: Hier sind die Fallen, die Sie bei der Prüfung unbedingt vermeiden sollten.', category: 'conseils', published_at: '2026-05-25', lang: 'de' }
  ];
  return allDemo.filter(p => p.lang === lang);
}

async function getLatestFaqs(lang) {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('active', true)
      .eq('lang', lang)
      .order('display_order', { ascending: true })
      .limit(3);
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn('FAQ fetch failed server-side, using fallback.');
  }

  // Demo Fallback
  const allDemo = [
    { id: 1, question: 'Comment m\'inscrire à un examen ?', answer: 'Vous pouvez vous inscrire en ligne via notre formulaire d\'inscription sur cette page, ou directement sur place pendant nos horaires d\'ouverture (Lundi–Vendredi 09h00–16h00).', lang: 'fr' },
    { id: 2, question: 'Quand recevrai-je mon certificat ?', answer: 'En général, vous recevrez votre certificat telc 4 à 6 semaines après la date de l\'examen. Il vous sera envoyé par courrier postal ou disponible au retrait en académie.', lang: 'fr' },
    { id: 3, question: 'Puis-je repasser l\'examen ?', answer: 'Oui, en cas d\'échec, vous pouvez vous réinscrire à la prochaine session disponible. Aucune limite de tentatives n\'est imposée.', lang: 'fr' },
    { id: 4, question: 'How do I register for an exam?', answer: 'You can register online using our registration form on this page, or directly on-site during our opening hours.', lang: 'en' },
    { id: 5, question: 'When will I receive my certificate?', answer: 'Generally, you will receive your telc certificate 4 to 6 weeks after the exam date.', lang: 'en' },
    { id: 6, question: 'Can I retake the exam?', answer: 'Yes, in case of failure, you can register for the next available session.', lang: 'en' },
    { id: 7, question: 'Wie melde ich mich für eine Prüfung an?', answer: 'Sie können sich online über unser Anmeldeformular auf dieser Seite oder direkt vor Ort während unserer Öffnungszeiten anmelden.', lang: 'de' },
    { id: 8, question: 'Wann erhalte ich mein Zertifikat?', answer: 'In der Regel erhalten Sie Ihr telc-Zertifikat 4 bis 6 Wochen nach dem Prüfungstermin.', lang: 'de' },
    { id: 9, question: 'Kann ich die Prüfung wiederholen?', answer: 'Ja, im Falle des Nichtbestehens können Sie sich für den nächsten verfügbaren Termin anmelden.', lang: 'de' }
  ];
  return allDemo.filter(f => f.lang === lang);
}

export default async function HomePage({ params }) {
  const { lang } = await params;
  const t = (key) => getTranslation(lang, key);

  // Fetch server data
  const exams = await getLatestExams();
  const blogPosts = await getLatestBlogPosts(lang);
  const faqs = await getLatestFaqs(lang);

  return (
    <div className="relative overflow-hidden bg-mesh-main text-white transition-colors duration-300">
      <DynamicGridTexture />

      {/* ══════════════════════════════════════════════════════
          HERO SECTION — Dark navy with hero image
      ══════════════════════════════════════════════════════ */}
      <section 
        className="relative overflow-hidden py-28 md:py-36 text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero_banner.png')" }}
      >
        {/* Dark overlay with gold tint for maximum contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/25 via-navy-950/50 to-navy-950/75 pointer-events-none" />
        
        {/* Glow Spheres */}
        <ParallaxOrb color="gold" speed={0.15} size="w-[450px] h-[450px]" top="10%" right="10%" animationClass="animate-orb-1" opacity="opacity-[0.22]" />
        <ParallaxOrb color="red" speed={0.08} size="w-[350px] h-[350px]" top="25%" left="5%" animationClass="animate-orb-2" opacity="opacity-[0.15]" />

        {/* Bottom transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0c1633] to-transparent pointer-events-none z-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col gap-8">
          <AnimatedHeading 
            text={t('hero_title')} 
            highlightWords={['allemand', 'German', 'Deutsch', 'succès', 'success', 'Erfolg', 'telc']} 
            as="h1" 
            delay={0.1}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.2] font-display text-white max-w-3xl mx-auto drop-shadow-sm justify-center text-center"
          />

          <ScrollReveal delay={0.28}>
            <p className="text-navy-200 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-sans">
              {t('hero_desc')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.38}>
            <div className="flex items-center justify-center gap-3 bg-navy-950/40 backdrop-blur-sm border border-white/10 rounded-2xl p-4 max-w-xl mx-auto shadow-sm">
              <div className="text-xl shrink-0">🇩🇪</div>
              <p className="text-xs text-navy-100 font-bold uppercase tracking-wider leading-snug">
                {t('hero_partner').replace('<span>', '').replace('</span>', '')}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.48}>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link href="?register=demo-1" className="btn-gold-grad px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 hover:scale-105 active:scale-100">
                <Calendar className="w-4 h-4" />
                {t('hero_btn_register')}
              </Link>
              <Link href={`/${lang}/dates`} className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 hover:border-gold-400/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all">
                <Clock className="w-4 h-4 text-gold-400" />
                {t('hero_btn_dates')}
              </Link>
              <Link href="?advice=true" className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 hover:border-gold-400/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all">
                <PhoneCall className="w-4 h-4 text-gold-400" />
                {t('hero_btn_advice')}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BIENVENUE SECTION — Navy mid
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 section-navy-mid text-white relative overflow-hidden">
        {/* Top blend from hero */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0c1633] to-transparent pointer-events-none z-5" />
        
        <ParallaxOrb color="warmGold" speed={0.12} size="w-[350px] h-[350px]" top="40%" right="10%" animationClass="animate-orb-3" opacity="opacity-[0.18]" />
        <ParallaxOrb color="navy" speed={0.18} size="w-[400px] h-[400px]" top="20%" left="-5%" animationClass="animate-orb-2" opacity="opacity-[0.15]" />
        
        {/* Bottom gold separator */}
        <div className="absolute bottom-0 left-0 right-0 gold-separator z-10" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          
          {/* Left image wrapped in golden double borders */}
          <div className="lg:col-span-5 relative perspective-3d">
            <ScrollReveal x={-40} y={0} delay={0.15}>
              <TiltCard>
                <div className="relative p-2 rounded-[36px] bg-gradient-to-tr from-gold-400 to-navy-700 shadow-xl">
                  <div className="relative aspect-4/3 w-full rounded-[30px] overflow-hidden bg-navy-800">
                    <Image
                       src="/assets/about_team.png"
                      alt="Academy Team"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-navy-800 border border-gold-400/40 text-white p-5 rounded-2xl shadow-xl flex flex-col items-center min-w-[120px] z-40">
                  <span className="text-3xl font-extrabold text-gold-400">100%</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-center text-navy-200 mt-1" dangerouslySetInnerHTML={{ __html: t('why_item6').replace(' ', '<br/>') }} />
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
 
          <div className="lg:col-span-7 flex flex-col gap-5">
            <ScrollReveal x={40} y={0} delay={0.15}>
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gold-400" />
                {t('welcome_eyebrow')}
              </span>
              <AnimatedHeading 
                text={t('welcome_title')} 
                highlightWords={['académie', 'academy', 'Akademie']} 
                as="h2" 
                className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-white"
              />
              <div className="w-16 h-[3px] bg-gradient-to-r from-gold-400 to-transparent rounded-full" />
              
              <p className="text-navy-200 text-sm md:text-base leading-relaxed mt-2">{t('welcome_p1')}</p>
              <p className="text-navy-200 text-sm md:text-base leading-relaxed">{t('welcome_p2')}</p>
              <p className="text-navy-200 text-sm md:text-base leading-relaxed">{t('welcome_p3')}</p>
 
              <div className="flex flex-wrap gap-2.5 mt-4">
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-gold-400/15 text-xs font-bold text-gold-200">{t('welcome_tag_work')}</span>
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-gold-400/15 text-xs font-bold text-gold-200">{t('welcome_tag_studies')}</span>
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-gold-400/15 text-xs font-bold text-gold-200">{t('welcome_tag_visa')}</span>
                <span className="px-4 py-2 rounded-xl bg-white/5 border border-gold-400/15 text-xs font-bold text-gold-200">{t('welcome_tag_nat')}</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
 
      {/* ══════════════════════════════════════════════════════
          ACCREDITATION / CERTIFICATE SECTION — Navy deep
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 section-navy-deep text-white relative overflow-hidden">
        <ParallaxOrb color="gold" speed={0.14} size="w-[350px] h-[350px]" top="15%" left="5%" animationClass="animate-orb-1" opacity="opacity-[0.18]" />
        <ParallaxOrb color="red" speed={0.2} size="w-[300px] h-[300px]" top="60%" right="5%" animationClass="animate-orb-2" opacity="opacity-[0.12]" />
        
        {/* Bottom gold separator */}
        <div className="absolute bottom-0 left-0 right-0 gold-separator z-10" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          {/* Certificate Column */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <ScrollReveal scale={0.97} y={20} delay={0.15}>
              <TiltCard className="w-full max-w-lg">
                {/* Official Framed CSS Certificate Plaque */}
                <div className="relative w-full p-5 md:p-6 rounded-3xl bg-[#faf8f2] border-[10px] border-double border-gold-500/80 shadow-2xl text-navy-900 select-none text-left">
                  {/* Wooden frame edge simulator */}
                  <div className="absolute inset-0 border border-gold-600/40 rounded-2xl pointer-events-none" />
                  
                  {/* Inner certificate boundary frame */}
                  <div className="border border-gold-500/35 p-6 md:p-8 rounded-2xl flex flex-col items-center text-center gap-5 relative bg-[#fcfbfa]">
                    {/* Security pattern watermark overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#c9a227_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-[0.03] pointer-events-none" />

                    {/* Top decorative emblem/line */}
                    <div className="w-full flex items-center justify-between gap-3 opacity-60">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gold-500/50" />
                      <span className="text-[9px] font-bold text-gold-600 tracking-[0.25em]">DE-DI-2026</span>
                      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gold-500/50" />
                    </div>

                    {/* Gold Ribbon Seal & Accreditations logos */}
                    <div className="relative flex items-center justify-center mb-1">
                      {/* Ribbon tails hanging */}
                      <div className="absolute top-8 left-[calc(50%-14px)] w-3.5 h-12 bg-red-600 rotate-[15deg] origin-top rounded-b-sm shadow-sm" />
                      <div className="absolute top-8 left-[calc(50%)] w-3.5 h-12 bg-red-700 -rotate-[15deg] origin-top rounded-b-sm shadow-sm" />
                      {/* Outer glowing seal */}
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-500 flex items-center justify-center shadow-lg border-2 border-gold-200">
                        <span className="text-white text-[12px] font-black uppercase tracking-wider font-sans glow-gold-text">telc</span>
                      </div>
                    </div>

                    {/* Main credentials block */}
                    <div className="flex flex-col gap-3 relative z-10 w-full">
                      <span className="text-gold-600 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] font-sans">
                        {lang === 'de' ? 'AKKREDITIERTES PRÜFUNGSZENTRUM' : lang === 'en' ? 'ACCREDITED EXAM CENTER' : 'CENTRE D\'EXAMEN ACCRÉDITÉ'}
                      </span>
                      
                      <h3 className="text-xl md:text-2xl font-extrabold font-display text-navy-950 italic tracking-wide leading-tight">
                        {t('hero_badge')}
                      </h3>
                      
                      <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto my-1" />
                      
                      <p className="text-navy-900/85 text-xs md:text-sm font-semibold max-w-md mx-auto leading-relaxed">
                        {lang === 'de' 
                          ? 'Offiziell lizenziertes und akkreditiertes Prüfungszentrum von telc gGmbH (Deutschland)'
                          : lang === 'en'
                          ? 'Officially licensed and accredited exam center by telc gGmbH (Germany)'
                          : 'Centre d\'examen officiel agréé et accrédité par telc gGmbH (Allemagne)'}
                      </p>
                    </div>

                    {/* Certificate bottom details (signatures, locations) */}
                    <div className="w-full mt-4 pt-4 border-t border-gold-500/25 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[9px] text-navy-950/60 font-bold uppercase tracking-wider">
                        <div className="text-left">
                          <span className="block text-[8px] text-gold-600/70 font-semibold mb-0.5">{lang === 'de' ? 'Ausstellungsort' : lang === 'en' ? 'Issuing City' : 'Lieu de délivrance'}</span>
                          <span>Frankfurt am Main</span>
                        </div>
                        <div className="text-center font-serif text-[11px] italic font-semibold text-gold-700/80 px-2 py-0.5 border border-gold-400/20 rounded-md bg-gold-50/50">
                          ★ LIZENZ DE-DI-2026 ★
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] text-gold-600/70 font-semibold mb-0.5">{lang === 'de' ? 'Standort' : lang === 'en' ? 'Academy Location' : 'Siège académie'}</span>
                          <span>Casablanca</span>
                        </div>
                      </div>

                      {/* Visual simulated stamp and signature */}
                      <div className="flex justify-between items-end mt-2 pt-2 border-t border-dashed border-gold-500/15">
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-[7px] text-navy-950/40 uppercase font-semibold">{lang === 'de' ? 'Registrierung' : lang === 'en' ? 'Registration' : 'Enregistrement'}</span>
                          <span className="font-mono text-[9px] text-navy-950/70 font-bold tracking-tight">#2026-TELC-DI-09</span>
                        </div>
                        
                        {/* Simulated digital stamp */}
                        <div className="relative w-12 h-12 border-2 border-dashed border-red-500/35 rounded-full flex items-center justify-center rotate-[-12deg] select-none pointer-events-none scale-90">
                          <span className="text-[7px] font-black text-red-500/50 uppercase tracking-widest text-center leading-[9px]">SIGMA<br/>DI<br/>STAMP</span>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="font-serif italic text-gold-600/80 text-xs md:text-sm font-semibold tracking-wide pr-1 select-none pointer-events-none">
                            Dr. M. Weichert
                          </div>
                          <div className="w-16 h-[0.5px] bg-navy-950/20 my-0.5" />
                          <span className="text-[7px] text-navy-950/40 uppercase font-semibold">{lang === 'de' ? 'Prüfungsleiter' : lang === 'en' ? 'Exam Director' : 'Directeur des Examens'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>

          {/* Text/Info Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <ScrollReveal x={20} y={0} delay={0.25}>
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gold-400" />
                {lang === 'de' ? 'OFFIZIELLE AKKREDITIERUNG' : lang === 'en' ? 'OFFICIAL ACCREDITATION' : 'ACCRÉDITATION OFFICIELLE'}
              </span>
              
              <AnimatedHeading 
                text={lang === 'de' 
                  ? 'Ein anerkannter Standard für Ihre Zukunft' 
                  : lang === 'en' 
                  ? 'A Recognized Standard for Your Future' 
                  : 'Un standard de qualité reconnu mondialement'}
                highlightWords={['Standard', 'Zukunft', 'Future', 'qualité', 'mondialement']}
                as="h2"
                className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-white"
              />
              <div className="w-16 h-[3px] bg-gradient-to-r from-gold-400 to-transparent rounded-full" />
              
              <p className="text-navy-200 text-sm md:text-base leading-relaxed">
                {lang === 'de'
                  ? 'Als offiziell lizenziertes telc Prüfungszentrum garantieren wir Prüfungen nach strengsten Qualitätsrichtlinien. Unsere digitalen Prüfungsverfahren bieten Ihnen schnelle Ergebnisse und maximale Flexibilität.'
                  : lang === 'en'
                  ? 'As an officially licensed telc exam center, we guarantee examinations according to the strictest quality guidelines. Our digital testing procedures offer you fast results and maximum flexibility.'
                  : 'En tant que centre d\'examen officiel agréé par telc gGmbH (Allemagne), nous offrons des examens certifiés de haute qualité. Nos tests numériques vous garantissent un passage simple, fluide et des résultats rapides.'}
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-gold-500/15 text-gold-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-sm">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      {lang === 'de' ? '100% International Anerkannt' : lang === 'en' ? '100% Globally Recognized' : '100% Reconnu à l\'International'}
                    </h4>
                    <p className="text-xs text-navy-200">
                      {lang === 'de' 
                        ? 'Gültig für Visa, Universitäten, Arbeitgeber und Einbürgerungsbehörden in Deutschland.'
                        : lang === 'en'
                        ? 'Valid for visas, universities, employers, and naturalization offices in Germany.'
                        : 'Certificats officiels requis pour les demandes de visa, d\'emploi, d\'études ou de naturalisation.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-gold-500/15 text-gold-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-sm">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      {lang === 'de' ? 'Moderne Digitale Prüfungen' : lang === 'en' ? 'Modern Digital Testing' : 'Examens Numériques Intuitifs'}
                    </h4>
                    <p className="text-xs text-navy-200">
                      {lang === 'de' 
                        ? 'Reibungsloser Ablauf am Computer für telc B1 und B2 Prüfungen mit schnellen Korrekturen.'
                        : lang === 'en'
                        ? 'Smooth computer-based testing for telc B1 and B2 exams with rapid grading turnaround.'
                        : 'Sessions sur ordinateurs modernes pour les niveles B1 et B2 permettant une correction accélérée.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-gold-500/15 text-gold-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-sm">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-0.5">
                      {lang === 'de' ? 'Offizielle deutsche Richtlinien' : lang === 'en' ? 'Official German Standards' : 'Standards Académiques Allemands'}
                    </h4>
                    <p className="text-xs text-navy-200">
                      {lang === 'de' 
                        ? 'Zertifiziert durch die telc gGmbH (Deutschland) unter Einhaltung des Gemeinsamen Europäischen Referenzrahmens (GER).'
                        : lang === 'en'
                        ? 'Certified by telc gGmbH (Germany) in strict compliance with CEFR standards.'
                        : 'Certifié directement par la telc gGmbH (Allemagne) conformément au Cadre européen commun de référence (CECR).'}
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="pt-2">
                <Link href={`/${lang}/examens`} className="btn-gold-grad px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2.5 hover:scale-105 active:scale-100">
                  {lang === 'de' ? 'Mehr über telc erfahren' : lang === 'en' ? 'Learn more about telc' : 'En savoir plus sur les examens'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          OFFERS SECTION — Navy mid
      ══════════════════════════════════════════════════════ */}
      <section 
        className="py-24 text-white relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero_offres.png')" }}
      >
        {/* Warm overlay with gold tint for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 via-navy-950/65 to-navy-950/85 pointer-events-none z-0" />
        
        {/* Top and Bottom smooth fade transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#070c1e] to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0c1633] to-transparent pointer-events-none z-10" />
        
        {/* Glow Spheres */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <ParallaxOrb color="navy" speed={0.1} size="w-[400px] h-[400px]" top="20%" left="5%" animationClass="animate-orb-3" opacity="opacity-[0.15]" />
          <ParallaxOrb color="warmGold" speed={0.15} size="w-[300px] h-[300px]" top="60%" right="5%" animationClass="animate-orb-1" opacity="opacity-[0.18]" />
        </div>
        
        {/* Bottom gold separator */}
        <div className="absolute bottom-0 left-0 right-0 gold-separator z-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center flex flex-col items-center gap-3.5 mb-16">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gold-400" />
              {t('offers_eyebrow')}
              <span className="w-8 h-[2px] bg-gold-400" />
            </span>
            <AnimatedHeading 
              text={t('offers_title')} 
              highlightWords={['offres', 'Offers', 'Angebote']}
              as="h2"
              className="text-3xl md:text-4xl font-extrabold font-display leading-tight justify-center text-center w-full text-white"
            />
            <div className="german-flag-accent w-24 mt-1" />
            <p className="text-navy-200 max-w-xl leading-relaxed text-sm md:text-base mt-2">{t('offers_lead')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <ScrollReveal y={40} delay={0.1}>
              <TiltCard className="h-full">
                <div className="card-navy-glass rounded-[32px] p-8 flex flex-col justify-between items-start h-full group">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-gold-500/15 text-gold-400 rounded-2xl flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-gold-300 transition-colors">{t('offers_card1_title')}</h3>
                    <p className="text-xs text-navy-200 leading-relaxed">{t('offers_card1_desc')}</p>
                  </div>
                  <Link href={`/${lang}/examens`} className="mt-8 text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5 hover:text-gold-300 transition-colors">
                    {t('hero_btn_dates')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Card 2 Featured */}
            <ScrollReveal y={40} delay={0.25}>
              <TiltCard className="h-full">
                <div className="premium-border p-[1.5px] h-full shadow-lg shadow-gold-500/10">
                  <div className="card-navy-glass rounded-[30px] p-8 h-full flex flex-col justify-between items-start relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-gold-400 text-navy-950 font-bold uppercase tracking-wider text-[9px] px-2.5 py-1 rounded-full shadow-sm">
                      {t('offers_card2_badge')}
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 bg-gold-500/15 text-gold-400 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold font-display text-white">{t('offers_card2_title')}</h3>
                      <p className="text-xs text-navy-200 leading-relaxed">{t('offers_card2_desc')}</p>
                    </div>
                    <Link href={`/${lang}/offres`} className="mt-8 text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5 hover:text-gold-300 transition-colors">
                      {t('nav_offres')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal y={40} delay={0.4}>
              <TiltCard className="h-full">
                <div className="card-navy-glass rounded-[32px] p-8 flex flex-col justify-between items-start h-full group">
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-gold-500/15 text-gold-400 rounded-2xl flex items-center justify-center">
                      <Laptop className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-gold-300 transition-colors">{t('offers_card3_title')}</h3>
                    <p className="text-xs text-navy-200 leading-relaxed">{t('offers_card3_desc')}</p>
                  </div>
                  <Link href={`/${lang}/offres`} className="mt-8 text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5 hover:text-gold-300 transition-colors">
                    {t('nav_offres')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY US SECTION — Navy with gold accent (highlighted)
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 section-navy-gold text-white relative overflow-hidden">
        {/* Glow Spheres */}
        <ParallaxOrb color="warmGold" speed={0.18} size="w-[450px] h-[450px]" top="15%" right="8%" animationClass="animate-orb-2" opacity="opacity-[0.22]" />
        <ParallaxOrb color="red" speed={0.12} size="w-[350px] h-[350px]" top="40%" left="5%" animationClass="animate-orb-3" opacity="opacity-[0.12]" />

        {/* Bottom gold separator */}
        <div className="absolute bottom-0 left-0 right-0 gold-separator z-10" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center flex flex-col items-center gap-3.5 mb-16">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gold-400" />
              {t('why_eyebrow')}
              <span className="w-8 h-[2px] bg-gold-400" />
            </span>
            <AnimatedHeading 
              text={t('why_title')} 
              highlightWords={['académie', 'Academy', 'Akademie']}
              as="h2"
              className="text-3xl md:text-4xl font-extrabold font-display leading-tight justify-center text-center w-full text-white"
            />
            <p className="text-navy-200 max-w-xl leading-relaxed text-sm md:text-base mt-2">
              {t('why_lead')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, text: t('why_item1') },
              { icon: ShieldCheck, text: t('why_item2') },
              { icon: Building, text: t('why_item3') },
              { icon: Clock, text: t('why_item4') },
              { icon: BookOpen, text: t('why_item5') },
              { icon: HeartHandshake, text: t('why_item6') },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <ScrollReveal key={idx} y={25} delay={idx * 0.08}>
                  <div className="bg-white/5 border border-gold-400/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/10 hover:border-gold-400/30 transition-all duration-300 shadow-sm h-full backdrop-blur-sm">
                    <div className="w-12 h-12 bg-gold-500/15 text-gold-400 rounded-xl flex items-center justify-center shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold leading-snug text-white">{item.text}</span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ABOUT SECTION — Navy deep
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 section-navy-deep text-white relative overflow-hidden">
        <ParallaxOrb color="gold" speed={0.14} size="w-[350px] h-[350px]" top="20%" left="10%" animationClass="animate-orb-1" opacity="opacity-[0.18]" />
        <ParallaxOrb color="navy" speed={0.22} size="w-[400px] h-[400px]" top="50%" right="5%" animationClass="animate-orb-2" opacity="opacity-[0.12]" />
        
        {/* Bottom gold separator */}
        <div className="absolute bottom-0 left-0 right-0 gold-separator z-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center flex flex-col items-center gap-3.5 mb-16">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gold-400" />
              {t('about_eyebrow')}
              <span className="w-8 h-[2px] bg-gold-400" />
            </span>
            <AnimatedHeading 
              text={t('about_title')} 
              highlightWords={['propos', 'About', 'Über']}
              as="h2"
              className="text-3xl md:text-4xl font-extrabold font-display leading-tight justify-center text-center w-full text-white"
            />
            <div className="german-flag-accent w-24 mt-1" />
            <p className="text-navy-200 max-w-xl leading-relaxed text-sm md:text-base mt-2">{t('about_lead')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <ScrollReveal y={30} delay={0.1}>
              <TiltCard className="h-full">
                <div className="card-navy-glass rounded-[32px] p-8 flex flex-col gap-5 text-center items-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/15 text-gold-400 flex items-center justify-center text-xl shadow-inner">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">{t('value1_title')}</h3>
                  <p className="text-xs text-navy-200 leading-relaxed">{t('value1_desc')}</p>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Value 2 */}
            <ScrollReveal y={30} delay={0.2}>
              <TiltCard className="h-full">
                <div className="card-navy-glass rounded-[32px] p-8 flex flex-col gap-5 text-center items-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/15 text-gold-400 flex items-center justify-center text-xl shadow-inner">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">{t('value2_title')}</h3>
                  <p className="text-xs text-navy-200 leading-relaxed">{t('value2_desc')}</p>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Value 3 */}
            <ScrollReveal y={30} delay={0.3}>
              <TiltCard className="h-full">
                <div className="card-navy-glass rounded-[32px] p-8 flex flex-col gap-5 text-center items-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/15 text-gold-400 flex items-center justify-center text-xl shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">{t('value3_title')}</h3>
                  <p className="text-xs text-navy-200 leading-relaxed">{t('value3_desc')}</p>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dynamic Interactive sections */}
      <HomeClientSections 
        lang={lang} 
        exams={exams} 
        blogPosts={blogPosts} 
        faqs={faqs} 
      />
    </div>
  );
}
