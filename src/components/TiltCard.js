"use client";

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({ children, className = "" }) {
  const cardRef = useRef(null);

  // Mouse positions normalized (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for 3D rotation (stiffness and damping prevent jitter)
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { stiffness: 120, damping: 18 });

  // Glare position updates based on mouse coordinates
  const glareX = useSpring(useTransform(x, [0, 1], [0, 100]), { stiffness: 120, damping: 18 });
  const glareY = useSpring(useTransform(y, [0, 1], [0, 100]), { stiffness: 120, damping: 18 });
  
  // Glare opacity spring (fades in on enter, fades out on leave)
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 18 });

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => {
    glareOpacity.set(0.18); // Show premium glare light overlay
  };

  const handleMouseLeave = () => {
    x.set(0.5); // Reset rotation back to center
    y.set(0.5);
    glareOpacity.set(0); // Hide glare
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative transition-shadow duration-300 ${className}`}
    >
      {/* Glare overlay effect */}
      <motion.div
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`
          ),
          opacity: glareOpacity
        }}
        className="absolute inset-0 z-30 pointer-events-none rounded-[inherit]"
      />
      
      {/* Pop effect container (moves contents slightly forward in 3D space) */}
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
