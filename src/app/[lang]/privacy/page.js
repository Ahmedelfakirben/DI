import { getTranslation } from '@/lib/i18n';

export default async function PrivacyPage({ params }) {
  const { lang } = await params;
  const t = (key) => getTranslation(lang, key);

  return (
    <div className="bg-bg text-text py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold font-display border-b border-border pb-6 mb-8">
          {t('footer_privacy')}
        </h1>
        <div className="prose prose-navy max-w-none text-text-soft text-sm md:text-base space-y-6 leading-relaxed">
          <p>
            Chez <strong>Sigma Deutsch Institut</strong>, nous accordons une importance capitale à la protection de vos données personnelles.
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">1. Collecte des données</h2>
          <p>
            Nous collectons des informations lorsque vous utilisez nos formulaires d'inscription aux examens et de demande de conseil (nom, prénom, e-mail, téléphone, nationalité).
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">2. Utilisation des données</h2>
          <p>
            Les informations recueillies sont uniquement destinées au traitement administratif de vos inscriptions aux examens officiels telc et à la planification des consultations pédagogiques.
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">3. Partage des données</h2>
          <p>
            Vos données personnelles ne sont jamais partagées à des fins commerciales. Elles sont transmises uniquement aux organismes telc habilités pour la validation de vos certifications.
          </p>
        </div>
      </div>
    </div>
  );
}
