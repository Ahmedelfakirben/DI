'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * ParallaxOrb is a scroll-linked animated background orb.
 * It uses framer-motion to create parallax vertical motion based on page scroll,
 * combined with CSS keyframe floating animations.
 * 
 * Optimized for permanent navy dark backgrounds — higher opacity, richer gradients.
 */
export function ParallaxOrb({
  className = '',
  speed = 0.1,
  size = 'w-[300px] h-[300px]',
  color = 'gold', // 'gold', 'navy', 'red', 'warmGold'
  top = '10%',
  left,
  right,
  animationClass = 'animate-orb-1',
  opacity = 'opacity-[0.20]'
}) {
  const ref = useRef(null);
  
  // Track scroll position of the viewport
  const { scrollYProgress } = useScroll();
  
  // Create parallax vertical shift (floating speed and direction)
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * -450]);

  // Color combinations — vibrant on navy backgrounds
  const colorGradients = {
    gold: 'bg-gradient-to-tr from-gold-400/70 via-amber-300/40 to-transparent',
    navy: 'bg-gradient-to-br from-navy-400/50 via-gold-300/20 to-transparent',
    red: 'bg-gradient-to-tr from-red-500/50 via-gold-300/25 to-transparent',
    warmGold: 'bg-gradient-to-br from-gold-400/60 via-amber-500/30 to-gold-200/10',
    mesh: 'bg-gradient-to-br from-gold-400/50 via-red-400/25 to-gold-200/10'
  };

  const gradient = colorGradients[color] || colorGradients.gold;

  const positionStyle = {
    top,
    left: left !== undefined ? left : undefined,
    right: right !== undefined ? right : undefined,
  };

  return (
    <motion.div
      ref={ref}
      style={{ ...positionStyle, y }}
      className={`absolute rounded-full blur-[100px] md:blur-[120px] pointer-events-none z-0 select-none ${size} ${gradient} ${opacity} ${animationClass} ${className}`}
    />
  );
}

/**
 * Grid texture overlay — subtle golden lines on navy
 */
export function DynamicGridTexture() {
  return (
    <div className="absolute inset-0 bg-grid-pattern pointer-events-none mix-blend-normal opacity-40" />
  );
}
