import { getTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import FaqClientPage from '@/components/FaqClientPage';
import { ParallaxOrb } from '@/components/AmbientGlow';

async function getFaqs(lang) {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('active', true)
      .eq('lang', lang)
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn('FAQ fetch failed server-side, using fallback.');
  }

  // Fallback demo data
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

export default async function FaqPage({ params }) {
  const { lang } = await params;
  const t = (key) => getTranslation(lang, key);

  const faqs = await getFaqs(lang);

  return (
    <div className="bg-bg text-white">
      {/* Hero Header with background image */}
      <section className="relative overflow-hidden py-20 md:py-28 text-white text-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/hero_faq.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/20 via-navy-950/65 to-navy-950/85 pointer-events-none" />
        <ParallaxOrb color="gold" speed={0.14} size="w-[300px] h-[300px]" top="25%" left="10%" animationClass="animate-orb-1" opacity="opacity-[0.15]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0c1633] to-transparent pointer-events-none z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-gold-400" />
            {t('faq_eyebrow')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight text-white">{t('faq_title')}</h1>
        </div>
      </section>

      {/* Interactive accordion lists */}
      <FaqClientPage lang={lang} initialFaqs={faqs} />
    </div>
  );
}
