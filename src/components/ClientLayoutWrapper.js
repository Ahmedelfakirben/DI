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

  return (
    <>
      <PageLoader />
      <Navbar />
      <main className={`flex-grow ${isHome ? '' : 'pt-[88px]'}`}>
        {children}
      </main>
      <Footer />
      <RegistrationModal />
      <ConsultationModal />
      <WhatsAppFAB />
    </>
  );
}
