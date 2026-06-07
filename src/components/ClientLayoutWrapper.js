"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import RegistrationModal from './RegistrationModal';
import ConsultationModal from './ConsultationModal';
import WhatsAppFAB from './WhatsAppFAB';
import PageLoader from './PageLoader';

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin');

  if (isAdmin) {
    return (
      <main className="flex-grow">
        {children}
      </main>
    );
  }

  const isHome = pathname === '/' || pathname === '/fr' || pathname === '/en' || pathname === '/de';
  const immersiveBgPages = ['/offres', '/examens', '/dates', '/blog', '/faq', '/contact'];
  const hasImmersiveBg = immersiveBgPages.some(p => pathname?.endsWith(p));

  return (
    <>
      <PageLoader />
      <Navbar />
      <main className={`flex-grow ${isHome || hasImmersiveBg ? '' : 'pt-[88px]'}`}>
        {children}
      </main>
      <Footer />
      <RegistrationModal />
      <ConsultationModal />
      <WhatsAppFAB />
    </>
  );
}
