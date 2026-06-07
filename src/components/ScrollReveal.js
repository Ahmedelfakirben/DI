"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  duration = 0.8, 
  y = 55, // Increased default vertical displacement for a stronger entry
  x = 0, 
  scale = 1,
  type = "spring", // Use spring physics by default for a bouncy, premium feel
  stiffness = 80, // Spring stiffness
  damping = 14, // Spring damping (lower = more bounce)
  mass = 1, // Spring mass
  className = ""
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if the page loader has already finished
    if (typeof window !== 'undefined' && document.documentElement.classList.contains('page-loaded')) {
      setIsLoaded(true);
      return;
    }

    const handleLoaded = () => {
      setIsLoaded(true);
    };

    window.addEventListener('page-loader-finished', handleLoaded);
    return () => {
      window.removeEventListener('page-loader-finished', handleLoaded);
    };
  }, []);

  const transitionSettings = type === "spring" 
    ? { type: "spring", stiffness, damping, mass, delay }
    : { duration, delay, ease: [0.16, 1, 0.3, 1] }; // Premium cubic-bezier fallback

  if (!isLoaded) {
    return (
      <div 
        style={{ 
          opacity: 0, 
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transition: 'none'
        }} 
        className={className}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }} // Trigger slightly earlier in viewport
      transition={transitionSettings}
      className={className}
    >
      {children}
    </motion.div>
  );
}
