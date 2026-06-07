"use client";

import { motion } from 'framer-motion';

export default function AnimatedHeading({ 
  text = "", 
  highlightWords = [], // Words that should receive the gold hand-drawn brush stroke
  className = "", 
  as: Tag = "h2", // Renders as h1, h2, h3 etc.
  delay = 0.1
}) {
  const words = text.split(" ");

  // Container variants to stagger children
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay
      }
    }
  };

  // Individual word variants (Apple-style slide up out of overflow-hidden)
  const wordVariants = {
    hidden: { y: "110%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14
      }
    }
  };

  // Brush stroke SVG underline path
  const brushStrokeD = "M 4 8 C 65 3, 130 3, 196 6 C 120 7, 50 8, 8 11";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={`w-full ${className.includes('justify-center') || className.includes('text-center') ? 'flex justify-center text-center' : ''}`}
    >
      <Tag className={`flex flex-wrap items-center gap-x-[0.28em] gap-y-[0.1em] leading-[1.2] ${className.includes('justify-center') || className.includes('text-center') ? 'justify-center text-center' : ''} ${className}`}>
        {words.map((word, idx) => {
          // Strip HTML tags and punctuation for match comparison
          const wordWithoutTags = word.replace(/<\/?[a-z0-9]+\b[^>]*>/gi, "");
          const cleanWord = wordWithoutTags.replace(/[.,’'\/#!$%\^&\*;:{}=\-_`~()]/g, "");
          const isHighlighted = highlightWords.some(h => cleanWord.toLowerCase() === h.toLowerCase());

          return (
            <span 
              key={idx} 
              className="inline-block overflow-hidden py-[0.1em] relative"
            >
              <motion.span 
                variants={wordVariants} 
                className="inline-block relative"
              >
                {isHighlighted ? (
                  <span className="relative inline-block text-gold-500 font-extrabold dark:text-gold-400">
                    {wordWithoutTags}
                    {/* SVG Brush stroke underline */}
                    <svg 
                      className="absolute left-0 bottom-[-6px] w-full h-[12px] pointer-events-none overflow-visible"
                      viewBox="0 0 200 15"
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        d={brushStrokeD}
                        stroke="#c9a227"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.7, 
                          delay: delay + (idx * 0.08) + 0.3, 
                          ease: "easeInOut" 
                        }}
                      />
                    </svg>
                  </span>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: word }} />
                )}
              </motion.span>
            </span>
          );
        })}
      </Tag>
    </motion.div>
  );
}
