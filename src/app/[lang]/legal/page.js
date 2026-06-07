import { getTranslation } from '@/lib/i18n';

export default async function LegalPage({ params }) {
  const { lang } = await params;
  const t = (key) => getTranslation(lang, key);

  return (
    <div className="bg-bg text-text py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold font-display border-b border-border pb-6 mb-8">
          {t('footer_legal')}
        </h1>
        <div className="prose prose-navy max-w-none text-text-soft text-sm md:text-base space-y-6 leading-relaxed">
          <p>
            Conformément à la législation en vigueur, vous trouverez ci-dessous les mentions légales relatives au site web de <strong>Sigma Deutsch Institut (Sigma DI)</strong>.
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">1. Éditeur du site</h2>
          <p>
            <strong>Raison sociale :</strong> Sigma Deutsch Institut S.A.R.L.<br />
            <strong>Siège social :</strong> Casablanca, Maroc<br />
            <strong>E-mail :</strong> contact@sigmadi.com<br />
            <strong>Téléphone :</strong> +212 5XX XX XX XX
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">2. Hébergement du site</h2>
          <p>
            Le site est hébergé sur les infrastructures sécurisées de Vercel Inc.
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus de ce site (textes, images, graphismes, logos, icônes) sont la propriété exclusive de Sigma DI, sauf mentions contraires. Toute reproduction ou distribution sans autorisation préalable est strictement interdite.
          </p>
        </div>
      </div>
    </div>
  );
}
