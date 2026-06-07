'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/hooks/useLang';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function Footer() {
  const { lang, t } = useLang();

  return (
    <footer className="relative overflow-hidden footer-mesh-bg text-white border-t border-gold-400/10 py-16 mt-auto">
      {/* Ambient Grid pattern inside Footer */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-15" />

      {/* Vibrant glowing ambient orbs (Footer specific — more visible) */}
      <div className="absolute -top-20 left-[10%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-gold-500/50 via-red-500/20 to-transparent blur-[100px] pointer-events-none animate-orb-1 opacity-25" />
      <div className="absolute -bottom-20 right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-navy-400/50 via-gold-400/20 to-transparent blur-[120px] pointer-events-none animate-orb-2 opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-gold-400/10 via-transparent to-gold-400/10 blur-[150px] pointer-events-none animate-orb-3 opacity-20" />

      {/* Pulsing energy gold line at the top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent animate-border-pulse" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="relative w-40 h-16">
              <Image
                src="/logo.svg"
                alt="Sigma DI Logo"
                fill
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <p className="text-xs text-navy-200 leading-relaxed max-w-sm">
              {t('footer_desc')}
            </p>
            <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest font-ui mt-2">
              Sprache · Bildung · Zukunft
            </span>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-300 font-ui mb-6">
              {t('footer_col_nav')}
            </h4>
            <ul className="flex flex-col gap-3.5 text-xs text-navy-200">
              <li>
                <Link href={`/${lang}/offres`} className="hover:text-gold-400 transition-colors">
                  {t('nav_offres')}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/examens`} className="hover:text-gold-400 transition-colors">
                  {t('nav_examens')}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/dates`} className="hover:text-gold-400 transition-colors">
                  {t('nav_dates')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-300 font-ui mb-6">
              {t('footer_col_info')}
            </h4>
            <ul className="flex flex-col gap-3.5 text-xs text-navy-200">
              <li>
                <Link href={`/${lang}/blog`} className="hover:text-gold-400 transition-colors">
                  {t('nav_blog')}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/faq`} className="hover:text-gold-400 transition-colors">
                  {t('nav_faq')}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="hover:text-gold-400 transition-colors">
                  {t('nav_contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gold-300 font-ui mb-6">
              {t('footer_col_contact')}
            </h4>
            <ul className="flex flex-col gap-4 text-xs text-navy-200">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+212 5XX XX XX XX</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:contact@sigmadi.com" className="hover:text-gold-400 transition-colors">
                  contact@sigmadi.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{t('contact_hours_val')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {t('contact_address_val')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold-400/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-navy-300">
          <p>{t('footer_copyright')}</p>
          <div className="flex gap-6 font-medium">
            <Link href={`/${lang}/legal`} className="hover:text-gold-400 transition-colors">
              {t('footer_legal')}
            </Link>
            <Link href={`/${lang}/privacy`} className="hover:text-gold-400 transition-colors">
              {t('footer_privacy')}
            </Link>
            <Link href={`/${lang}/terms`} className="hover:text-gold-400 transition-colors">
              {t('footer_terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
