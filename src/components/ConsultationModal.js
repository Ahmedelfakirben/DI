'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLang } from '@/hooks/useLang';
import { supabase } from '@/lib/supabase';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsultationModal() {
  const { lang, t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isOpen = searchParams.get('advice') === 'true';

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '09:00',
    topic: 'general',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        date: '',
        time: '09:00',
        topic: 'general',
      });
      setErrors({});
    }
  }, [isOpen]);

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('advice');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('form_label_firstname') + ' is required';
    if (!formData.lastName.trim()) newErrors.lastName = t('form_label_lastname') + ' is required';
    if (!formData.phone.trim()) newErrors.phone = t('form_label_phone') + ' is required';
    if (!formData.email.trim()) {
      newErrors.email = t('form_label_email') + ' is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const payload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      preferred_date: formData.date || null,
      preferred_time: formData.time || null,
      topic: formData.topic,
    };

    try {
      const isDemo = searchParams.get('demo') === 'true' || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('VOTRE_PROJECT_ID');
      if (!isDemo) {
        const { error } = await supabase.from('consultations').insert([payload]);
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
      setSuccess(true);
    } catch (e) {
      console.error(e);
      alert('An error occurred during submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-bg-card border border-border rounded-3xl shadow-xl overflow-hidden text-text"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-bg-muted/30">
            <div>
              <h3 className="text-xl font-bold font-display">{t('modal_advice_title')}</h3>
              <p className="text-xs text-text-muted mt-1">{t('modal_advice_subtitle')}</p>
            </div>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-full hover:bg-bg-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-text-soft" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center text-2xl font-bold mb-5 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold font-display text-text mb-2">
                  {t('success_advice_title')}
                </h4>
                <p className="text-sm text-text-soft max-w-sm leading-relaxed">
                  {t('success_advice_desc')}
                </p>
                <button
                  onClick={closeModal}
                  className="mt-8 px-6 py-2.5 rounded-full border border-border text-xs font-bold uppercase hover:bg-bg-muted transition-all cursor-pointer"
                >
                  OK
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-soft">{t('form_label_firstname')}</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Marie"
                      className={`w-full px-4 py-2.5 rounded-xl border text-white placeholder-navy-200/50 bg-navy-950 text-sm transition-all outline-none focus:border-gold-400 focus:bg-navy-900 ${
                        errors.firstName ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-soft">{t('form_label_lastname')}</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Dupont"
                      className={`w-full px-4 py-2.5 rounded-xl border text-white placeholder-navy-200/50 bg-navy-950 text-sm transition-all outline-none focus:border-gold-400 focus:bg-navy-900 ${
                        errors.lastName ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-soft">{t('form_label_email')}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="marie@example.com"
                      className={`w-full px-4 py-2.5 rounded-xl border text-white placeholder-navy-200/50 bg-navy-950 text-sm transition-all outline-none focus:border-gold-400 focus:bg-navy-900 ${
                        errors.email ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-soft">{t('form_label_phone')}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+212 600 000 000"
                      className={`w-full px-4 py-2.5 rounded-xl border text-white placeholder-navy-200/50 bg-navy-950 text-sm transition-all outline-none focus:border-gold-400 focus:bg-navy-900 ${
                        errors.phone ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-soft">{t('form_label_date')}</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-navy-950 text-white text-sm outline-none focus:border-gold-400 focus:bg-navy-900 text-text-soft"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-soft">{t('form_label_time')}</label>
                    <select
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-navy-950 text-white text-sm outline-none focus:border-gold-400 focus:bg-navy-900"
                    >
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-soft">{t('form_label_topic')}</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-navy-950 text-white text-sm outline-none focus:border-gold-400 focus:bg-navy-900"
                  >
                    <option value="general">{t('topic_general')}</option>
                    <option value="telc_b1">{t('topic_b1')}</option>
                    <option value="telc_b2">{t('topic_b2')}</option>
                    <option value="prep_course">{t('topic_prep')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-6 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 rounded-full border border-border hover:bg-bg-muted text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    {t('btn_cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold-grad px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Sending...' : t('btn_confirm_advice')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
