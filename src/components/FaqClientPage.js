'use client';

import { useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqClientPage({ lang, initialFaqs }) {
  const { t } = useLang();
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaqIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="bg-transparent">
      <div className="max-w-3xl mx-auto px-6">
      {initialFaqs.length === 0 ? (
        <div className="text-center py-16 card-navy-glass border border-gold-400/10 rounded-[32px] text-navy-200">
          <HelpCircle className="w-12 h-12 text-navy-300 mx-auto mb-4" />
          <p className="font-bold text-base mb-1 text-white">No FAQs found</p>
          <p className="text-xs text-navy-300">Questions will appear here soon.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {initialFaqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl overflow-hidden transition-all backdrop-blur-sm ${
                  isOpen ? 'bg-white/8 border-gold-400/40 shadow-gold-500/10' : 'bg-white/5 border-gold-400/10 hover:border-gold-400/25'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left font-bold text-sm md:text-base text-white hover:text-gold-300 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className={`text-xl font-bold w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 ml-4 ${
                    isOpen ? 'bg-gold-400 text-navy-950' : 'bg-white/10 text-gold-400'
                  }`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="pb-5 px-6 text-xs md:text-sm text-navy-200 leading-relaxed border-t border-gold-400/10 pt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
