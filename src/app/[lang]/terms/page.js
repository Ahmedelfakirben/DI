import { getTranslation } from '@/lib/i18n';

export default async function TermsPage({ params }) {
  const { lang } = await params;
  const t = (key) => getTranslation(lang, key);

  return (
    <div className="bg-bg text-text py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold font-display border-b border-border pb-6 mb-8">
          {t('footer_terms')}
        </h1>
        <div className="prose prose-navy max-w-none text-text-soft text-sm md:text-base space-y-6 leading-relaxed">
          <p>
            Les présentes conditions générales régissent l'inscription et la participation aux examens de certification telc et aux cours proposés par <strong>Sigma Deutsch Institut</strong>.
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">1. Conditions d'inscription</h2>
          <p>
            L'inscription en ligne constitue une réservation temporaire. La validation définitive de votre place à l'examen est conditionnée par le règlement des frais d'inscription dans les délais impartis.
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">2. Modalités de paiement</h2>
          <p>
            Le paiement s'effectue exclusivement hors ligne : en espèces au guichet de notre académie à Casablanca, ou par virement bancaire sur le compte officiel de Sigma DI.
          </p>
          <h2 className="text-xl font-bold font-display text-text mt-8">3. Annulation et remboursement</h2>
          <p>
            Toute annulation d'inscription doit être signalée au moins 14 jours avant la date de l'examen. Passé ce délai, aucun remboursement ni report de date ne sera possible, conformément aux directives officielles de telc gGmbH.
          </p>
        </div>
      </div>
    </div>
  );
}
