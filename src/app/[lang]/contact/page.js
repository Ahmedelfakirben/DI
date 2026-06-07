'use client';

import { useState, use } from 'react';
import { useLang } from '@/hooks/useLang';
import { supabase } from '@/lib/supabase';
import { Phone, Mail, Clock, MapPin, Send, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ParallaxOrb } from '@/components/AmbientGlow';

export default function ContactPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { lang, t } = useLang();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('form_label_name') + ' is required';
    if (!formData.message.trim()) newErrors.message = t('form_label_message') + ' is required';
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
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      subject: formData.subject.trim() || null,
      message: formData.message.trim(),
    };

    try {
      const isDemo = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('VOTRE_PROJECT_ID');
      if (!isDemo) {
        const { error } = await supabase.from('contact_messages').insert([payload]);
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (e) {
      console.error(e);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg text-white overflow-hidden">
      {/* Full-page Background Image and Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none z-0" 
        style={{ backgroundImage: "url('/assets/hero_contact.png')" }} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/35 via-navy-950/75 to-bg pointer-events-none z-0" />
      
      {/* Orbs wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <ParallaxOrb color="warmGold" speed={0.12} size="w-[350px] h-[350px]" top="20%" left="10%" animationClass="animate-orb-2" opacity="opacity-[0.15]" />
        <ParallaxOrb color="navy" speed={0.08} size="w-[300px] h-[300px]" top="40%" right="5%" animationClass="animate-orb-1" opacity="opacity-[0.12]" />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        {/* Header Hero */}
        <header className="max-w-7xl mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-24 text-center">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-gold-400" />
            {t('contact_eyebrow')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight text-white">{t('contact_title')}</h1>
          <p className="text-navy-200 max-w-xl leading-relaxed text-sm md:text-base mt-4 mx-auto">{t('contact_lead')}</p>
        </header>

        {/* Main Grid Contact cards and Form */}
        <main className="pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Cards Column (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="text-2xl font-bold font-display text-white border-b border-gold-400/10 pb-4">
              {t('contact_card_title')}
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {/* Phone Card */}
              <div className="card-navy-glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-500/15 text-gold-400 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-navy-300 uppercase tracking-wider font-bold">{t('contact_label_phone')}</div>
                  <div className="text-sm font-bold text-white mt-0.5">+212 5XX XX XX XX</div>
                </div>
              </div>

              {/* Email Card */}
              <div className="card-navy-glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-500/15 text-gold-400 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-navy-300 uppercase tracking-wider font-bold">{t('contact_label_email')}</div>
                  <a href="mailto:contact@sigmadi.com" className="text-sm font-bold text-white mt-0.5 hover:text-gold-400 transition-colors block">
                    contact@sigmadi.com
                  </a>
                </div>
              </div>

              {/* Hours Card */}
              <div className="card-navy-glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-500/15 text-gold-400 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-navy-300 uppercase tracking-wider font-bold">{t('contact_hours_title').replace('🕐 ', '')}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{t('contact_hours_val')}</div>
                </div>
              </div>

              {/* Address Card */}
              <div className="card-navy-glass rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-gold-500/15 text-gold-400 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-navy-300 uppercase tracking-wider font-bold">{t('contact_label_address')}</div>
                  <div className="text-sm font-semibold text-navy-200 mt-0.5 leading-relaxed">
                    {t('contact_address_val')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column (Right) */}
          <div className="lg:col-span-7">
            <div className="card-navy-glass border border-gold-400/10 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center text-2xl font-bold mb-5 shadow-sm">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold font-display text-white mb-3">
                    {lang === 'de' ? 'Nachricht gesendet!' : lang === 'en' ? 'Message sent!' : 'Message envoyé !'}
                  </h4>
                  <p className="text-sm text-navy-200 max-w-sm leading-relaxed mb-8">
                    {lang === 'de'
                      ? 'Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.'
                      : lang === 'en'
                      ? 'Thank you for your message. We will get back to you as soon as possible.'
                      : 'Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.'}
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-full border border-gold-400/20 text-xs font-bold uppercase hover:bg-white/5 transition-all cursor-pointer text-white"
                  >
                    {lang === 'de' ? 'Weitere Nachricht' : lang === 'en' ? 'Send another message' : 'Envoyer un autre message'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-navy-200">{t('form_label_name')}</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Marie Dupont"
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white/5 text-sm text-white transition-all outline-none focus:border-gold-400 placeholder:text-navy-300/50 ${
                          errors.name ? 'border-red-500' : 'border-gold-400/10'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-navy-200">{t('form_label_email')}</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="marie@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white/5 text-sm text-white transition-all outline-none focus:border-gold-400 placeholder:text-navy-300/50 ${
                          errors.email ? 'border-red-500' : 'border-gold-400/10'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-navy-200">{t('form_label_phone')}</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+212 600 000 000"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-400/10 bg-white/5 text-sm text-white transition-all outline-none focus:border-gold-400 placeholder:text-navy-300/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-navy-200">{t('form_label_subject')}</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Inquiry subject"
                        className="w-full px-4 py-2.5 rounded-xl border border-gold-400/10 bg-white/5 text-sm text-white transition-all outline-none focus:border-gold-400 placeholder:text-navy-300/50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-navy-200">{t('form_label_message')}</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Write your message here..."
                      className={`w-full px-4 py-2.5 rounded-xl border bg-white/5 text-sm text-white transition-all outline-none focus:border-gold-400 resize-none placeholder:text-navy-300/50 ${
                        errors.message ? 'border-red-500' : 'border-gold-400/10'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold-grad px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider w-fit self-end mt-4 flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Sending...' : t('form_btn_submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>
  );
}
