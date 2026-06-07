'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLang } from '@/hooks/useLang';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { lang, t } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for premium visual adjustments
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute redirect paths when changing language
  const changeLanguage = (newLang) => {
    if (newLang === lang) return;
    const pathSegments = pathname.split('/');
    pathSegments[1] = newLang; // Replace lang segment
    const newPath = pathSegments.join('/') || `/${newLang}`;
    router.push(newPath);
    setIsOpen(false);
  };

  const navItems = [
    { label: t('nav_offres'), href: `/${lang}/offres` },
    { label: t('nav_examens'), href: `/${lang}/examens` },
    { label: t('nav_dates'), href: `/${lang}/dates` },
    { label: t('nav_blog'), href: `/${lang}/blog` },
    { label: t('nav_faq'), href: `/${lang}/faq` },
    { label: t('nav_contact'), href: `/${lang}/contact` },
  ];

  // Check if current page is the homepage
  const isHome = pathname === '/' || pathname === '/fr' || pathname === '/en' || pathname === '/de';

  // Always-dark navbar — simplified
  const navContainerClass = scrolled || !isHome
    ? 'bg-navy-950/90 backdrop-blur-xl border-b border-gold-400/10 py-3 shadow-lg shadow-navy-950/30'
    : 'bg-transparent border-transparent py-4.5';

  const linkTextClass = (isActive) => {
    if (isActive) {
      return 'text-gold-400 font-bold';
    }
    return 'text-white/80 hover:text-gold-300';
  };

  const langSelectorBtnClass = (l) => {
    const isActive = lang === l;
    if (isActive) {
      return 'bg-gold-400 text-navy-950 font-bold shadow-sm';
    }
    return 'text-white/70 hover:text-gold-300';
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navContainerClass}`}
      >
        {/* German flag top header line accent - pinned to navbar top */}
        <div className="absolute top-0 left-0 right-0">
          <div className="german-flag-accent w-full" style={{ height: '4px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between pt-1">
          {/* Logo Section */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-105 shrink-0">
              <Image
                src="/logo.svg"
                alt="Sigma DI Logo"
                fill
                className="object-contain filter brightness-0 invert"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight font-display transition-colors duration-300 text-white">
                Sigma DI
              </span>
              <span className="text-[10px] tracking-wider text-gold-400 font-semibold uppercase">
                Sprache · Bildung · Zukunft
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 font-sans font-medium text-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative py-2 font-semibold transition-colors duration-200 ${linkTextClass(isActive)}`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-400 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions Block */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-semibold transition-all duration-300">
              <Globe className="w-3.5 h-3.5 text-gold-400/60" />
              {['fr', 'en', 'de'].map((l) => (
                <button
                  key={l}
                  onClick={() => changeLanguage(l)}
                  className={`px-2 py-0.5 rounded-full transition-all uppercase cursor-pointer ${langSelectorBtnClass(l)}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Inscription CTA */}
            <Link href={`/${lang}/dates`} className="btn-gold-grad px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {t('nav_cta')}
            </Link>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[76px] bottom-0 z-40 bg-navy-950/98 backdrop-blur-xl px-6 py-8 flex flex-col justify-between border-t border-gold-400/10 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/5 border border-gold-400/10">
                <span className="text-xs text-navy-300 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-gold-400/60" /> Language:
                </span>
                <div className="flex gap-2">
                  {['fr', 'en', 'de'].map((l) => (
                    <button
                      key={l}
                      onClick={() => changeLanguage(l)}
                      className={`px-3 py-1 rounded-lg text-sm uppercase font-semibold border ${
                        lang === l
                          ? 'bg-gold-400 text-navy-950 border-gold-400'
                          : 'border-gold-400/15 text-white/70 bg-white/5'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Links */}
              <ul className="flex flex-col gap-5 text-lg font-medium text-center">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block py-2 rounded-xl transition-all ${
                          isActive
                            ? 'text-gold-400 font-bold bg-white/5'
                            : 'text-white/70 hover:text-gold-300'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Mobile Footer Area inside Menu */}
            <div className="flex flex-col gap-4 mt-8">
              <Link
                href={`/${lang}/dates`}
                onClick={() => setIsOpen(false)}
                className="btn-gold-grad w-full py-4 rounded-xl text-center font-bold uppercase tracking-wider text-sm shadow-md"
              >
                {t('nav_cta')}
              </Link>
              <p className="text-center text-[10px] text-navy-300">
                Sprache · Bildung · Zukunft
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
