import { ThemeProvider } from '@/components/ThemeProvider';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import { translations } from '@/lib/translations';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const activeLang = translations[lang] ? lang : 'fr';
  
  // Standard SEO metadata in each language
  const seo = {
    fr: {
      title: "Sigma DI — Académie de Langue Allemande | telc B1 & B2",
      description: "Apprenez l'allemand avec succès et réussissez les examens telc B1 et B2. Académie Sigma DI : cours en ligne, préparation aux examens, centre d'examen officiel agréé.",
    },
    en: {
      title: "Sigma DI — German Language Academy | telc B1 & B2 Exams",
      description: "Learn German with success and pass telc B1 & B2 exams. Sigma DI Academy: online courses, exam preparation, official accredited exam center.",
    },
    de: {
      title: "Sigma DI — Deutsche Sprachakademie | telc B1 & B2 Prüfungen",
      description: "Deutsch erfolgreich lernen & telc B1 & B2 Prüfungen bestehen. Sigma DI Akademie: Online-Kurse, Prüfungsvorbereitung, offizielles Prüfungszentrum.",
    }
  };

  const activeSeo = seo[activeLang];

  return {
    title: activeSeo.title,
    description: activeSeo.description,
    keywords: ["telc", "allemand", "German", "Deutsch", "examen", "B1", "B2", "academy", "Sigma DI"],
    icons: {
      icon: '/logo.svg',
    },
    openGraph: {
      title: activeSeo.title,
      description: activeSeo.description,
      type: 'website',
      images: ['/assets/hero_premium.png'],
    }
  };
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;

  return (
    <html lang={lang} data-theme="light" suppressHydrationWarning>
      <head>
        {/* Anti-flicker theme script */}
        <script
          suppressHydrationWarning
          type={typeof window === 'undefined' ? undefined : 'application/json'}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('sigma-di-theme') || 'light';
                  document.documentElement.setAttribute('data-theme', saved);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-300">
        <ThemeProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
