import Link from 'next/link';
import { getTranslation } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Award, Lightbulb, Globe, FileText, BookOpen, Newspaper } from 'lucide-react';

async function getBlogPostBySlug(slug, lang) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .single();
    if (!error && data) return data;
  } catch (e) {
    console.warn('Blog post detail fetch failed server-side, using fallback.');
  }

  // Fallback demo posts
  const allDemo = [
    { id: 1, slug: '5-conseils-telc-b1-fr', title: '5 conseils pour réussir votre examen telc B1', summary: 'Découvrez les stratégies essentielles pour aborder sereinement chaque épreuve.', category: 'telc', published_at: '2026-06-01', lang: 'fr', content: '<p>Pour réussir l\'examen telc B1, il est crucial de bien gérer son temps lors de l\'épreuve écrite et de s\'entraîner avec des simulations audio réelles pour l\'épreuve orale.</p><p>De plus, apprenez par cœur les expressions typiques pour l\'exposé et l\'organisation de votre temps de parole.</p>' },
    { id: 2, slug: 'erreurs-expression-ecrite-fr', title: 'Les erreurs les plus fréquentes en expression écrite', summary: 'Orthographe, grammaire : voici les pièges à éviter absolument lors de votre examen.', category: 'conseils', published_at: '2026-05-25', lang: 'fr', content: '<p>L\'utilisation incorrecte des conjonctions de subordination (weil, dass) et l\'oubli de la structure de phrase allemande sont les fautes les plus pénalisantes.</p>' },
    { id: 3, slug: '5-tips-telc-b1-en', title: '5 tips to pass your telc B1 exam', summary: 'Discover essential strategies to approach each section of the telc B1 exam with confidence.', category: 'telc', published_at: '2026-06-01', lang: 'en', content: '<p>To pass the telc B1 exam, it is vital to manage your time effectively during the written test and practice with real audio simulations for the oral portion.</p>' },
    { id: 4, slug: 'common-writing-mistakes-en', title: 'Most common writing mistakes', summary: 'Spelling, grammar: here are the traps you must avoid during your exam.', category: 'conseils', published_at: '2026-05-25', lang: 'en', content: '<p>The incorrect use of subordinating conjunctions (weil, dass) and forgetting the German sentence structure are the most common pitfalls.</p>' },
    { id: 5, slug: '5-tipps-telc-b1-de', title: '5 Tipps zum Bestehen Ihrer telc B1-Prüfung', summary: 'Entdecken Sie wichtige Strategien, um jeden Teil der telc B1-Prüfung selbstbewusst anzugehen.', category: 'telc', published_at: '2026-06-01', lang: 'de', content: '<p>Um die telc B1-Prüfung zu bestehen, ist es entscheidend, Ihre Zeit während der schriftlichen Prüfung effektiv einzuteilen und mit echten Hörsimulationen für den mündlichen Teil zu üben.</p>' },
    { id: 6, slug: 'haeufige-schreibfehler-de', title: 'Die häufigsten Fehler im schriftlichen Ausdruck', summary: 'Rechtschreibung, Grammatik: Hier sind die Fallen, die Sie bei der Prüfung unbedingt vermeiden sollten.', category: 'conseils', published_at: '2026-05-25', lang: 'de', content: '<p>Die falsche Verwendung von untergeordneten Konjunktionen (weil, dass) und das Vergessen der deutschen Satzstruktur gehören zu den häufigsten Fehlern.</p>' }
  ];
  return allDemo.find(p => p.lang === lang && p.slug === slug);
}

export default async function BlogPostDetailPage({ params }) {
  const { lang, slug } = await params;
  const t = (key) => getTranslation(lang, key);

  const post = await getBlogPostBySlug(slug, lang);

  // Helper date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
    return d.toLocaleDateString(locales[lang] || 'fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
    return <IconComponent className="w-5 h-5 text-gold-500" />;
  };

  const textPublishedOn = {
    fr: "Publié le",
    en: "Published on",
    de: "Veröffentlicht am"
  };

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold font-display mb-4">Post not found</h1>
        <p className="text-text-soft text-sm mb-8">The requested blog article does not exist or is not available in this language.</p>
        <Link href={`/${lang}/blog`} className="btn-gold-grad px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="py-12 md:py-20 bg-bg text-text">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gold-500 hover:text-gold-600 mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('btn_back').replace('← ', '')}
        </Link>

        {/* Article Meta */}
        <div className="flex flex-col gap-4 border-b border-border pb-8 mb-10">
          <div className="flex items-center gap-2">
            {getCategoryIcon(post.category)}
            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">
              {post.category || 'blog'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight text-text">
            {post.title}
          </h1>

          <p className="text-xs text-text-muted mt-2">
            {textPublishedOn[lang] || textPublishedOn.fr} <strong>{formatDate(post.published_at)}</strong>
          </p>
        </div>

        {/* Content */}
        <div
          className="prose prose-navy max-w-none text-text-soft leading-relaxed text-sm md:text-base space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content || post.summary }}
        />
      </div>
    </article>
  );
}
