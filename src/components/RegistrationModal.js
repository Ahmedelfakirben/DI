'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLang } from '@/hooks/useLang';
import { supabase } from '@/lib/supabase';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { registerStudentAction } from '@/app/actions/registrations';

export default function RegistrationModal() {
  const { lang, t } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const examId = searchParams.get('register');
  const isOpen = !!examId;

  const [exam, setExam] = useState(null);
  const [loadingExam, setLoadingExam] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    nationality: '',
    paymentMethod: 'on_site',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  // Reset states on open/close change
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSuccess(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        whatsapp: '',
        nationality: '',
        paymentMethod: 'on_site',
        termsAccepted: false,
      });
      setErrors({});
      fetchExamDetails();
    } else {
      setExam(null);
    }
  }, [isOpen, examId]);

  const fetchExamDetails = async () => {
    if (!examId || examId.startsWith('demo-')) {
      // Demo fallback mock
      const mockDates = {
        'demo-1': { id: 'demo-1', exam_type: 'B1', exam_date: '2026-07-12', exam_time: '09:00', price_eur: 180, available_spots: 14 },
        'demo-2': { id: 'demo-2', exam_type: 'B2', exam_date: '2026-07-19', exam_time: '09:00', price_eur: 220, available_spots: 8 },
        'demo-3': { id: 'demo-3', exam_type: 'B1', exam_date: '2026-08-09', exam_time: '09:00', price_eur: 180, available_spots: 20 },
        'demo-4': { id: 'demo-4', exam_type: 'B2', exam_date: '2026-08-23', exam_time: '09:00', price_eur: 220, available_spots: 3 },
        'demo-5': { id: 'demo-5', exam_type: 'B1_oral', exam_date: '2026-07-26', exam_time: '10:00', price_eur: 80, available_spots: 10 },
        'demo-6': { id: 'demo-6', exam_type: 'B1_written', exam_date: '2026-07-26', exam_time: '09:00', price_eur: 120, available_spots: 0 },
      };
      setExam(mockDates[examId] || null);
      return;
    }

    setLoadingExam(true);
    try {
      const { data, error } = await supabase
        .from('exam_dates')
        .select('*')
        .eq('id', examId)
        .single();
      if (error) throw error;
      setExam(data);
    } catch (e) {
      console.warn('Failed to load exam dates, running in demo mode');
    } finally {
      setLoadingExam(false);
    }
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('register');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
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

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      alert(t('checkbox_terms'));
      return;
    }

    setSubmitting(true);
    const payload = {
      exam_date_id: examId,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      whatsapp: formData.whatsapp.trim() || null,
      nationality: formData.nationality.trim() || null,
      payment_method: formData.paymentMethod,
    };

    try {
      const res = await registerStudentAction(payload, lang);
      if (res.success) {
        setSuccess(true);
        if (res.warning) {
          console.warn("Registration success warning:", res.warning);
        }
      } else {
        throw new Error(res.error || 'Failed to submit registration');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred during submission. Please try again: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper date formatting inside modal
  const formatExamDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
    return d.toLocaleDateString(locales[lang] || 'fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatExamTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
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
              <h3 className="text-xl font-bold font-display">{t('modal_reg_title')}</h3>
              <p className="text-xs text-text-muted mt-1">{t('modal_reg_subtitle')}</p>
            </div>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-full hover:bg-bg-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-text-soft" />
            </button>
          </div>

          {/* Selected Exam Alert Section */}
          {exam && (
            <div className="px-6 py-3.5 bg-gold-100/50 dark:bg-gold-600/10 border-b border-border text-xs flex flex-col gap-0.5">
              <span className="font-semibold text-gold-600 dark:text-gold-400">
                🎓 {t('modal_reg_recap')} telc {exam.exam_type?.replace('_', ' ')}
              </span>
              <span className="text-text-soft font-medium">
                📅 {formatExamDate(exam.exam_date)} - {formatExamTime(exam.exam_time)}
              </span>
              <span className="text-text-soft">
                🏷️ {t('table_head_price')}: <strong className="text-gold-500">{exam.price_eur} DH</strong> | {t('table_head_spots')}: <strong>{exam.available_spots}</strong>
              </span>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
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
                  {t('success_reg_title')}
                </h4>
                <p className="text-sm text-text-soft max-w-sm leading-relaxed">
                  {t('success_reg_desc')}
                </p>
                <button
                  onClick={closeModal}
                  className="mt-8 px-6 py-2.5 rounded-full border border-border text-xs font-bold uppercase hover:bg-bg-muted transition-all cursor-pointer"
                >
                  OK
                </button>
              </motion.div>
            ) : (
              <div>
                {/* Stepper Progress bar */}
                <div className="flex items-center gap-3 mb-6 text-xs font-semibold">
                  <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-gold-500' : 'text-text-muted'}`}>
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center">1</span>
                    <span>{t('step_info')}</span>
                  </div>
                  <div className="flex-1 h-[1px] bg-border" />
                  <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-gold-500' : 'text-text-muted'}`}>
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center">2</span>
                    <span>{t('step_confirm')}</span>
                  </div>
                </div>

                {/* Step 1 Inputs */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
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
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-text-soft">{t('form_label_whatsapp')}</label>
                        <input
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                          placeholder="+212 600 000 000"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white placeholder-navy-200/50 bg-navy-950 text-sm transition-all outline-none focus:border-gold-400 focus:bg-navy-900"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-text-soft">{t('form_label_nationality')}</label>
                      <input
                        type="text"
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="Marocaine"
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 text-white placeholder-navy-200/50 bg-navy-950 text-sm transition-all outline-none focus:border-gold-400 focus:bg-navy-900"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2 Inputs */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                    {/* Recap Box */}
                    <div className="p-4 rounded-2xl bg-bg-muted border border-border text-xs flex flex-col gap-2">
                      <h5 className="font-bold text-text uppercase tracking-wider">{t('modal_reg_recap')}</h5>
                      <div className="grid grid-cols-2 gap-2 text-text-soft">
                        <span>👤 Nom : <strong>{formData.firstName} {formData.lastName}</strong></span>
                        <span>✉️ E-mail : <strong>{formData.email}</strong></span>
                        <span>📞 Tél : <strong>{formData.phone}</strong></span>
                        {formData.nationality && <span>🇲🇦 Nationalité : <strong>{formData.nationality}</strong></span>}
                      </div>
                    </div>

                    {/* Payment Mode Selector */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-text-soft">{t('form_label_payment')}</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-navy-950 text-white text-sm outline-none focus:border-gold-400 focus:bg-navy-900"
                      >
                        <option value="on_site">{t('payment_cash')}</option>
                        <option value="transfer">{t('payment_transfer')}</option>
                      </select>
                    </div>

                    {/* Accept Conditions Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer text-xs text-text-soft select-none mt-2">
                      <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-border text-gold-500 focus:ring-gold-400 cursor-pointer"
                      />
                      <span>{t('checkbox_terms')}</span>
                    </label>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {!success && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-bg-muted/30">
              {step > 1 ? (
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2 rounded-full border border-border hover:bg-bg-muted text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  {t('btn_back')}
                </button>
              ) : (
                <div />
              )}

              {step === 1 ? (
                <button
                  onClick={handleNext}
                  className="btn-gold-grad px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {t('btn_continue')}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-gold-grad px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : t('btn_confirm')}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
