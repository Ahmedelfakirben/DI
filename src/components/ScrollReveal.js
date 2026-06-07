"use client";

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
  const transitionSettings = type === "spring" 
    ? { type: "spring", stiffness, damping, mass, delay }
    : { duration, delay, ease: [0.16, 1, 0.3, 1] }; // Premium cubic-bezier fallback

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
