"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const pathname = usePathname();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathRef = useRef(pathname);

  // Initial load effect
  useEffect(() => {
    // Show first load animation for 1.6 seconds
    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Path change transition effect
  useEffect(() => {
    const prevPath = prevPathRef.current;
    if (pathname !== prevPath) {
      prevPathRef.current = pathname;

      // Prevent transition animation if it's the admin panel
      if (pathname?.includes('/admin') || prevPath?.includes('/admin')) {
        return;
      }

      setIsTransitioning(true);

      // Fast transition: 0.6 seconds total
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {/* First Load Landing Animation */}
      {isFirstLoad && (
        <motion.div
          key="first-load"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080e24]"
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20" />
          
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-gold-400/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col items-center gap-6 relative z-10">
            {/* Logo scaling & pulsing */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ 
                scale: [0.7, 1.05, 1],
                opacity: 1,
              }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                times: [0, 0.7, 1]
              }}
              className="relative w-48 h-48 drop-shadow-[0_0_55px_rgba(201,162,39,0.45)]"
            >
              <Image
                src="/logo.svg"
                alt="Sigma DI Logo"
                fill
                className="object-contain filter brightness-0 invert"
                priority
              />
            </motion.div>

            {/* Pulsing loading bar */}
            <div className="w-40 h-[3px] bg-white/10 rounded-full overflow-hidden mt-2 relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ 
                  duration: 1.4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              />
            </div>

            {/* School Motto */}
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[10px] uppercase font-bold tracking-widest text-gold-400 font-ui"
            >
              Sprache · Bildung · Zukunft
            </motion.span>
          </div>
        </motion.div>
      )}

      {/* Navigation Section Transition Overlay */}
      {!isFirstLoad && isTransitioning && (
        <motion.div
          key="nav-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080e24]/90 backdrop-blur-md"
        >
          {/* Logo pulse */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-36 h-36 drop-shadow-[0_0_35px_rgba(201,162,39,0.25)]"
          >
            <Image
              src="/logo.svg"
              alt="Sigma DI Logo"
              fill
              className="object-contain filter brightness-0 invert"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
