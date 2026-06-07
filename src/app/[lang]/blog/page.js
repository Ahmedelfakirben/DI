import Link from 'next/link';
import { getTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { BookOpen } from 'lucide-react';
import { ParallaxOrb } from '@/components/AmbientGlow';

async function getBlogPosts(lang) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, summary, category, cover_image_url, published_at')
      .eq('published', true)
      .eq('lang', lang)
      .order('published_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  } catch (e) {
    console.warn('Blog posts fetch failed server-side, using fallback.');
  }

  // Fallback demo posts
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

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const t = (key) => getTranslation(lang, key);

  const posts = await getBlogPosts(lang);

  // Helper date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
    return d.toLocaleDateString(locales[lang] || 'fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryEmoji = (cat) => {
    const map = { telc: '🏅', conseils: '💡', integration: '🌍', examen: '📝', general: '📖' };
    return map[cat] || '📰';
  };

  return (
    <div className="bg-bg text-white">
      {/* Hero Header with background image */}
      <section className="relative overflow-hidden pt-32 pb-44 md:pt-40 md:pb-56 text-white text-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/hero_blog.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gold-400/20 via-navy-950/65 to-navy-950/85 pointer-events-none" />
        <ParallaxOrb color="warmGold" speed={0.1} size="w-[300px] h-[300px]" top="30%" right="15%" animationClass="animate-orb-3" opacity="opacity-[0.15]" />
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-gold-400" />
            {t('blog_eyebrow')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight text-white">{t('blog_title')}</h1>
          <p className="text-navy-200 max-w-xl leading-relaxed text-sm md:text-base mt-4 mx-auto">{t('blog_lead')}</p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="pb-24 section-navy-deep relative z-20 -mt-16 md:-mt-24">
        <div className="max-w-7xl mx-auto px-6">
        {posts.length === 0 ? (
          <div className="text-center py-16 card-navy-glass border border-gold-400/10 rounded-3xl text-navy-200">
            <BookOpen className="w-12 h-12 text-navy-300 mx-auto mb-4" />
            <p className="font-bold text-base mb-1 text-white">No articles found</p>
            <p className="text-xs text-navy-300">Stay tuned! We will publish new articles soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="card-navy-glass rounded-3xl overflow-hidden flex flex-col h-full group"
              >
                <Link href={`/${lang}/blog/${post.slug || post.id}`} className="flex flex-col h-full">
                  <div className="aspect-video w-full bg-navy-800 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300 border-b border-gold-400/5">
                    {getCategoryEmoji(post.category)}
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div className="flex flex-col gap-2.5">
                      <span className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                        {post.category || 'blog'}
                      </span>
                      <h3 className="text-lg font-bold font-display text-white leading-snug group-hover:text-gold-300 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-navy-200 leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>
                    <span className="text-[10px] text-navy-300 mt-6 flex items-center gap-1">
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  </div>
  );
}
