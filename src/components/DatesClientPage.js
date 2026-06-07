'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLang } from '@/hooks/useLang';
import { Search, Calendar, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   Mini Calendar Component — visual month view with exam markers
   ───────────────────────────────────────────────────────── */
export function ExamCalendar({ exams, lang, onSelectDate, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    // Start on the month of the first exam, or current month
    if (exams.length > 0) {
      const first = new Date(exams[0].exam_date + 'T00:00:00');
      return { year: first.getFullYear(), month: first.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
  const locale = locales[lang] || 'fr-FR';

  // Day name headers
  const dayNames = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      // Start on Monday (i+1)
      const d = new Date(2026, 0, 5 + i); // Jan 5 2026 is a Monday
      days.push(d.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2).toUpperCase());
    }
    return days;
  }, [locale]);

  // Build a map of exam dates for quick lookup
  const examDateMap = useMemo(() => {
    const map = {};
    exams.forEach((exam) => {
      const key = exam.exam_date;
      if (!map[key]) map[key] = [];
      map[key].push(exam);
    });
    return map;
  }, [exams]);

  // Calendar grid computation
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week (0=Sun), shift to Monday-start
    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1; // Monday = 0

    const days = [];
    // Blank cells before first day
    for (let i = 0; i < startDow; i++) {
      days.push({ day: null, dateStr: null });
    }
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr });
    }
    return days;
  }, [currentMonth]);

  const monthLabel = new Date(currentMonth.year, currentMonth.month).toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card-navy-glass border border-gold-400/10 rounded-3xl p-6 md:p-8">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goToPrevMonth} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-bold font-display text-white capitalize">{monthLabel}</h3>
        <button onClick={goToNextMonth} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-navy-300 uppercase tracking-wider py-1">
            {name}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((cell, idx) => {
          if (!cell.day) {
            return <div key={idx} className="aspect-square" />;
          }

          const hasExam = examDateMap[cell.dateStr];
          const isSelected = selectedDate === cell.dateStr;
          const isToday = cell.dateStr === today;
          const isPast = cell.dateStr < today;

          return (
            <button
              key={idx}
              onClick={() => hasExam && onSelectDate(cell.dateStr)}
              disabled={!hasExam}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-semibold cursor-pointer
                ${isPast && !hasExam ? 'text-navy-400/40' : ''}
                ${!hasExam && !isPast ? 'text-navy-300 hover:bg-white/3' : ''}
                ${hasExam && !isSelected ? 'bg-gold-400/15 text-gold-300 hover:bg-gold-400/25 border border-gold-400/20' : ''}
                ${isSelected ? 'bg-gold-400 text-navy-950 font-extrabold shadow-lg shadow-gold-400/30 scale-105' : ''}
                ${isToday && !isSelected ? 'ring-1 ring-gold-400/40' : ''}
              `}
            >
              <span>{cell.day}</span>
              {hasExam && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasExam.slice(0, 3).map((e, i) => (
                    <span key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-navy-950' : 'bg-gold-400'}`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gold-400/5">
        <div className="flex items-center gap-1.5 text-[10px] text-navy-300">
          <span className="w-2.5 h-2.5 rounded-sm bg-gold-400/20 border border-gold-400/30" />
          {lang === 'de' ? 'Prüfungstag' : lang === 'en' ? 'Exam day' : 'Jour d\'examen'}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-navy-300">
          <span className="w-2.5 h-2.5 rounded-sm bg-gold-400" />
          {lang === 'de' ? 'Ausgewählt' : lang === 'en' ? 'Selected' : 'Sélectionné'}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main Dates Page Client Component
   ───────────────────────────────────────────────────────── */
export default function DatesClientPage({ lang, initialExams }) {
  const { t } = useLang();
  const searchParams = useSearchParams();

  // Get initial filter from URL parameter
  const filterParam = searchParams.get('filter') || 'all';

  const [activeFilter, setActiveFilter] = useState(filterParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExams, setFilteredExams] = useState(initialExams);
  const [selectedDate, setSelectedDate] = useState(null);

  // Sync activeFilter with URL parameter changes
  useEffect(() => {
    setActiveFilter(searchParams.get('filter') || 'all');
  }, [searchParams]);

  // Handle live search, tab filtering, and date selection
  useEffect(() => {
    let result = initialExams;

    // Filter by type
    if (activeFilter !== 'all') {
      if (activeFilter === 'modules') {
        result = result.filter((e) => e.exam_type.includes('_'));
      } else {
        result = result.filter(
          (e) => e.exam_type === activeFilter || e.exam_type.startsWith(activeFilter + '_')
        );
      }
    }

    // Filter by selected calendar date
    if (selectedDate) {
      result = result.filter((e) => e.exam_date === selectedDate);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          getLevelLabel(e.exam_type).toLowerCase().includes(q) ||
          formatDate(e.exam_date).toLowerCase().includes(q) ||
          (e.notes || '').toLowerCase().includes(q)
      );
    }

    setFilteredExams(result);
  }, [activeFilter, searchQuery, selectedDate, initialExams]);

  // Helper date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
    return d.toLocaleDateString(locales[lang] || 'fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '—';
    return timeStr.substring(0, 5);
  };

  const getLevelLabel = (type) => {
    const map = {
      B1: 'B1',
      B2: 'B2',
      B1_oral: 'B1 Oral',
      B1_written: 'B1 Written',
      B2_oral: 'B2 Oral',
      B2_written: 'B2 Written',
    };
    return map[type] || type;
  };

  const handleSelectDate = (dateStr) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  };

  return (
    <section className="py-16 section-navy-mid">
      <div className="max-w-7xl mx-auto px-6">
        {/* Two-column layout: Calendar + Filters/Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Calendar Column */}
        <div className="lg:col-span-4">
          <ExamCalendar
            exams={initialExams}
            lang={lang}
            onSelectDate={handleSelectDate}
            selectedDate={selectedDate}
          />
        </div>

        {/* Filters + Info Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Search and Filters bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-gold-400/10">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { id: 'all', label: t('filter_all') },
                { id: 'B1', label: t('filter_b1') },
                { id: 'B2', label: t('filter_b2') },
                { id: 'modules', label: t('filter_modules') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveFilter(tab.id); setSelectedDate(null); }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-gold-400 border-gold-400 text-navy-950 font-bold shadow-sm'
                      : 'bg-white/5 border-gold-400/10 text-white/70 hover:border-gold-400/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-navy-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gold-400/10 bg-white/5 text-xs font-semibold outline-none focus:border-gold-400 text-white placeholder:text-navy-300/50"
              />
            </div>
          </div>

          {/* Selected date indicator */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-400/10 border border-gold-400/20"
              >
                <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="text-xs font-bold text-gold-300">
                  {lang === 'de' ? 'Gefiltert nach: ' : lang === 'en' ? 'Filtered by: ' : 'Filtré par: '}
                  <span className="text-white">{formatDate(selectedDate)}</span>
                </span>
                <button onClick={() => setSelectedDate(null)} className="ml-auto text-[10px] font-bold text-gold-400 uppercase tracking-wider hover:text-gold-300 cursor-pointer">
                  {lang === 'de' ? 'Zurücksetzen' : lang === 'en' ? 'Clear' : 'Effacer'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Payment Notice banner */}
          <div className="p-4 rounded-2xl bg-gold-400/5 border border-gold-400/10 text-xs text-navy-200 flex items-start gap-3">
            <Info className="w-4.5 h-4.5 text-gold-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Mode de paiement :</strong> Procéder par virement bancaire pour valider définitivement votre place.
            </p>
          </div>
        </div>
      </div>

      {/* Dates Table — Full width below */}
      <div className="border border-gold-400/10 card-navy-glass rounded-[32px] overflow-hidden shadow-xl">
        {filteredExams.length === 0 ? (
          <div className="p-12 text-center text-navy-200">
            <Calendar className="w-12 h-12 text-navy-300 mx-auto mb-4" />
            <p className="font-bold text-base mb-1 text-white">No exam dates found</p>
            <p className="text-xs text-navy-300">{t('table_no_results')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white/5 text-navy-200 font-bold uppercase tracking-wider text-[10px] border-b border-gold-400/10">
                  <th className="py-4 px-6">{t('table_head_level')}</th>
                  <th className="py-4 px-6">{t('table_head_date')}</th>
                  <th className="py-4 px-6">{t('table_head_time')}</th>
                  <th className="py-4 px-6">{t('table_head_deadline')}</th>
                  <th className="py-4 px-6">{t('table_head_spots')}</th>
                  <th className="py-4 px-6">{t('table_head_price')}</th>
                  <th className="py-4 px-6">{t('table_head_status')}</th>
                  <th className="py-4 px-6 text-right">{t('table_head_action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-400/5 font-medium text-navy-200">
                {filteredExams.map((exam, idx) => {
                  const spotsRatio = exam.available_spots / exam.total_spots;
                  const isFull = exam.status === 'full' || exam.available_spots === 0;

                  let statusText = t('table_head_status');
                  let statusClass = 'bg-emerald-500/15 text-emerald-400';

                  if (isFull) {
                    statusText = lang === 'de' ? 'Ausgebucht' : lang === 'en' ? 'Full' : 'Complet';
                    statusClass = 'bg-red-500/15 text-red-400';
                  } else if (spotsRatio <= 0.25) {
                    statusText = lang === 'de' ? 'Fast voll' : lang === 'en' ? 'Almost full' : 'Presque complet';
                    statusClass = 'bg-amber-500/15 text-gold-400';
                  } else {
                    statusText = lang === 'de' ? 'Verfügbar' : lang === 'en' ? 'Available' : 'Disponible';
                  }

                  return (
                    <motion.tr 
                      key={exam.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="py-5 px-6">
                        <span className="inline-block bg-navy-700 border border-gold-400/20 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                          {getLevelLabel(exam.exam_type)}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-white font-bold">
                        {formatDate(exam.exam_date)}
                      </td>
                      <td className="py-5 px-6 text-white">{formatTime(exam.exam_time)}</td>
                      <td className="py-5 px-6 text-xs text-navy-300">
                        {formatDate(exam.registration_deadline)}
                      </td>
                      <td className="py-5 px-6">
                        <span className={spotsRatio <= 0.25 && !isFull ? 'text-gold-400 font-bold' : 'text-white'}>
                          {isFull ? '0' : exam.available_spots} / {exam.total_spots}
                        </span>
                      </td>
                      <td className="py-5 px-6 font-bold text-white">{exam.price_eur} DH</td>
                      <td className="py-5 px-6">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${statusClass}`}>
                          ● {statusText}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <Link
                          href={`?register=${exam.id}`}
                          className={`inline-block px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                            isFull
                              ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed opacity-50'
                              : 'btn-gold-grad border-transparent hover:scale-105'
                          }`}
                          onClick={(e) => isFull && e.preventDefault()}
                        >
                          {isFull
                            ? lang === 'de'
                              ? 'Voll'
                              : lang === 'en'
                              ? 'Full'
                              : 'Complet'
                            : lang === 'de'
                            ? 'Anmelden'
                            : lang === 'en'
                            ? 'Register'
                            : 'S\'inscrire'}
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </section>
  );
}
