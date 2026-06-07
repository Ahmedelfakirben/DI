import { useParams } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';

export function useLang() {
  const params = useParams();
  const lang = params?.lang || 'fr';
  
  return {
    lang,
    t: (key) => getTranslation(lang, key)
  };
}
