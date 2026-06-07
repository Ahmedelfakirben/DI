// ============================================================
// Sigma DI — Académie de Langue Allemande (telc)
// app.js — UI Logic + Supabase Integration
// ============================================================

'use strict';

// ── Supabase Client ─────────────────────────────────────────
let supabase = null;

function initSupabase() {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('[Sigma DI] Supabase client initialized.');
  } catch (e) {
    console.warn('[Sigma DI] Supabase init failed — running in offline/demo mode.', e);
  }
}

// ── State ────────────────────────────────────────────────────
let allExamDates   = [];
let currentFilter  = 'all';
let currentExamId  = null;
let currentLevel   = null;
let regCurrentStep = 1;

// ── Helpers ─────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  const lang = i18n.getCurrentLanguage();
  const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
  return d.toLocaleDateString(locales[lang] || 'fr-FR', { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '—';
  return timeStr.substring(0, 5);
}

function formatPrice(price) {
  if (!price && price !== 0) return '—';
  return `${Number(price).toFixed(0)} €`;
}

function getLevelLabel(type) {
  const map = { B1: 'B1', B2: 'B2', B1_oral: 'B1 Oral', B1_written: 'B1 Écrit', B2_oral: 'B2 Oral', B2_written: 'B2 Écrit' };
  return map[type] || type;
}

function getCategoryEmoji(cat) {
  const map = { telc: '🏅', conseils: '💡', integration: '🌍', examen: '📝', general: '📖' };
  return map[cat] || '📰';
}

// ── Toast Notifications ──────────────────────────────────────
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// ── Theme Toggle ─────────────────────────────────────────────
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const iconSun  = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');
  const saved = localStorage.getItem('sigma-di-theme') || 'light';

  applyTheme(saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('sigma-di-theme', next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (iconSun && iconMoon) {
      iconSun.style.display  = theme === 'dark'  ? 'block' : 'none';
      iconMoon.style.display = theme === 'light' ? 'block' : 'none';
    }
  }
}

// ── Navbar ────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  // Scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on mobile nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ── Scroll Animations ────────────────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

// ── Exam Tabs ─────────────────────────────────────────────────
function switchTab(level) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const activeBtn = document.getElementById(`tab-${level}`);
  const activeContent = document.getElementById(`content-${level}`);
  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
}

// ── Exam Dates — Fetch ────────────────────────────────────────
async function fetchExamDates() {
  const demoData = [
    { id: 'demo-1', exam_type: 'B1', exam_date: '2026-07-12', exam_time: '09:00', registration_deadline: '2026-07-05', available_spots: 14, total_spots: 20, price_eur: 180, status: 'open', location: 'Sigma Deutsch Institut' },
    { id: 'demo-2', exam_type: 'B2', exam_date: '2026-07-19', exam_time: '09:00', registration_deadline: '2026-07-12', available_spots: 8,  total_spots: 20, price_eur: 220, status: 'open', location: 'Sigma Deutsch Institut' },
    { id: 'demo-3', exam_type: 'B1', exam_date: '2026-08-09', exam_time: '09:00', registration_deadline: '2026-08-02', available_spots: 20, total_spots: 20, price_eur: 180, status: 'open', location: 'Sigma Deutsch Institut' },
    { id: 'demo-4', exam_type: 'B2', exam_date: '2026-08-23', exam_time: '09:00', registration_deadline: '2026-08-16', available_spots: 3,  total_spots: 20, price_eur: 220, status: 'open', location: 'Sigma Deutsch Institut' },
    { id: 'demo-5', exam_type: 'B1_oral',    exam_date: '2026-07-26', exam_time: '10:00', registration_deadline: '2026-07-19', available_spots: 10, total_spots: 10, price_eur: 80,  status: 'open', location: 'Sigma Deutsch Institut' },
    { id: 'demo-6', exam_type: 'B1_written', exam_date: '2026-07-26', exam_time: '09:00', registration_deadline: '2026-07-19', available_spots: 0,  total_spots: 15, price_eur: 120, status: 'full', location: 'Sigma Deutsch Institut' },
  ];

  if (!supabase || SUPABASE_URL.includes('VOTRE_PROJECT_ID')) {
    console.info('[Sigma DI] Using demo exam data (Supabase not configured).');
    allExamDates = demoData;
    renderExamTable(allExamDates);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('exam_dates')
      .select('*')
      .neq('status', 'cancelled')
      .gte('exam_date', new Date().toISOString().split('T')[0])
      .order('exam_date', { ascending: true });

    if (error) throw error;
    allExamDates = data || [];
    renderExamTable(allExamDates);
  } catch (err) {
    console.error('[Sigma DI] fetchExamDates error:', err);
    allExamDates = demoData;
    renderExamTable(allExamDates);
  }
}

function renderExamTable(dates) {
  const tbody = document.getElementById('exam-table-body');
  const noResultsMsg = document.getElementById('no-results-msg');
  if (!tbody) return;

  if (!dates || dates.length === 0) {
    tbody.innerHTML = '';
    if (noResultsMsg) noResultsMsg.style.display = 'block';
    return;
  }
  if (noResultsMsg) noResultsMsg.style.display = 'none';

  // Limit home page table preview to next 3 sessions
  let list = dates;
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('index')) {
    list = dates.slice(0, 3);
  }

  tbody.innerHTML = list.map(exam => {
    const spotsRatio = exam.available_spots / exam.total_spots;
    let statusBadge, statusClass;
    const isFull = exam.status === 'full' || exam.available_spots === 0;

    const lang = i18n.getCurrentLanguage();
    if (isFull) {
      statusBadge = lang === 'de' ? '● Ausgebucht' : (lang === 'en' ? '● Full' : '● Complet');
      statusClass = 'status-badge status-full';
    } else if (spotsRatio <= 0.25) {
      statusBadge = lang === 'de' ? '● Fast voll' : (lang === 'en' ? '● Almost full' : '● Presque complet');
      statusClass = 'status-badge status-almost';
    } else {
      statusBadge = lang === 'de' ? '● Verfügbar' : (lang === 'en' ? '● Available' : '● Disponible');
      statusClass = 'status-badge status-open';
    }

    const enrollLabel = lang === 'de' ? 'Anmelden' : (lang === 'en' ? 'Register' : 'S\'inscrire');
    const fullLabel = lang === 'de' ? 'Voll' : (lang === 'en' ? 'Full' : 'Complet');

    return `
      <tr>
        <td><span class="level-badge">${getLevelLabel(exam.exam_type)}</span></td>
        <td style="font-weight:600;">${formatDate(exam.exam_date)}</td>
        <td>${formatTime(exam.exam_time)}</td>
        <td>${formatDate(exam.registration_deadline)}</td>
        <td>
          <span style="font-weight:600; color:${spotsRatio <= 0.25 && !isFull ? 'var(--gold-400)' : 'inherit'}">
            ${isFull ? '0' : exam.available_spots} / ${exam.total_spots}
          </span>
        </td>
        <td style="font-weight:600;">${formatPrice(exam.price_eur)}</td>
        <td><span class="${statusClass}">${statusBadge}</span></td>
        <td>
          <button
            class="btn btn-navy btn-sm"
            id="btn-exam-${exam.id}"
            onclick="openRegistrationModal(null, '${exam.id}')"
            ${isFull ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}
          >
            ${isFull ? fullLabel : enrollLabel}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ── Exam Filters ──────────────────────────────────────────────
function filterExams(filter, searchQuery = '') {
  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`filter-${filter}`);
  if (activeBtn) activeBtn.classList.add('active');

  const query = (searchQuery || document.getElementById('exam-search')?.value || '').toLowerCase();

  let filtered = allExamDates;

  if (filter !== 'all') {
    if (filter === 'modules') {
      filtered = filtered.filter(e => e.exam_type.includes('_'));
    } else {
      filtered = filtered.filter(e => e.exam_type === filter || e.exam_type.startsWith(filter + '_'));
    }
  }

  if (query) {
    filtered = filtered.filter(e =>
      getLevelLabel(e.exam_type).toLowerCase().includes(query) ||
      formatDate(e.exam_date).toLowerCase().includes(query) ||
      (e.notes || '').toLowerCase().includes(query)
    );
  }

  renderExamTable(filtered);
}

// ── Blog ─────────────────────────────────────────────────────
const demoPosts = [
  // French
  { id: 1, slug: '5-conseils-telc-b1-fr', title: '5 conseils pour réussir votre examen telc B1', summary: 'Découvrez les stratégies essentielles pour aborder sereinement chaque épreuve.', category: 'telc', published_at: '2026-06-01', lang: 'fr', content: '<p>Pour réussir l\'examen telc B1, il est crucial de bien gérer son temps lors de l\'épreuve écrite et de s\'entraîner avec des simulations audio réelles pour l\'épreuve orale.</p>' },
  { id: 2, slug: 'erreurs-expression-ecrite-fr', title: 'Les erreurs les plus fréquentes en expression écrite', summary: 'Orthographe, grammaire : voici les pièges à éviter absolument lors de votre examen.', category: 'conseils', published_at: '2026-05-25', lang: 'fr', content: '<p>L\'utilisation incorrecte des conjonctions de subordination (weil, dass) et l\'oubli de la structure de phrase allemande sont les fautes les plus pénalisantes.</p>' },
  // English
  { id: 3, slug: '5-tips-telc-b1-en', title: '5 tips to pass your telc B1 exam', summary: 'Discover essential strategies to approach each section of the telc B1 exam with confidence.', category: 'telc', published_at: '2026-06-01', lang: 'en', content: '<p>To pass the telc B1 exam, it is vital to manage your time effectively during the written test and practice with real audio simulations for the oral portion.</p>' },
  { id: 4, slug: 'common-writing-mistakes-en', title: 'Most common writing mistakes', summary: 'Spelling, grammar: here are the traps you must avoid during your exam.', category: 'conseils', published_at: '2026-05-25', lang: 'en', content: '<p>The incorrect use of subordinating conjunctions (weil, dass) and forgetting the German sentence structure are the most common pitfalls.</p>' },
  // German
  { id: 5, slug: '5-tipps-telc-b1-de', title: '5 Tipps zum Bestehen Ihrer telc B1-Prüfung', summary: 'Entdecken Sie wichtige Strategien, um jeden Teil der telc B1-Prüfung selbstbewusst anzugehen.', category: 'telc', published_at: '2026-06-01', lang: 'de', content: '<p>Um die telc B1-Prüfung zu bestehen, ist es entscheidend, Ihre Zeit während der schriftlichen Prüfung effektiv einzuteilen und mit echten Hörsimulationen für den mündlichen Teil zu üben.</p>' },
  { id: 6, slug: 'haeufige-schreibfehler-de', title: 'Die häufigsten Fehler im schriftlichen Ausdruck', summary: 'Rechtschreibung, Grammatik: Hier sind die Fallen, die Sie bei der Prüfung unbedingt vermeiden sollten.', category: 'conseils', published_at: '2026-05-25', lang: 'de', content: '<p>Die falsche Verwendung von untergeordneten Konjunktionen (weil, dass) und das Vergessen der deutschen Satzstruktur gehören zu den häufigsten Fehlern.</p>' }
];

async function fetchBlogPosts() {
  const currentLang = i18n.getCurrentLanguage();
  let posts = demoPosts.filter(p => p.lang === currentLang);

  if (supabase && !SUPABASE_URL.includes('VOTRE_PROJECT_ID')) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, summary, category, cover_image_url, published_at')
        .eq('published', true)
        .eq('lang', currentLang)
        .order('published_at', { ascending: false });
      if (!error && data && data.length > 0) posts = data;
    } catch (err) {
      console.warn('[Sigma DI] fetchBlogPosts error:', err);
    }
  }

  // Limit to 4 cards on preview
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('index')) {
    posts = posts.slice(0, 4);
  }

  renderBlogCards(posts);
}

function renderBlogCards(posts) {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  grid.innerHTML = posts.map((post, i) => `
    <article class="blog-card" data-animate data-animate-delay="${i + 1}" style="opacity:0; transform:translateY(30px); transition:opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s;">
      <a href="article.html?slug=${post.slug || post.id}">
        <div class="blog-card__thumb">
          ${getCategoryEmoji(post.category)}
        </div>
        <div class="blog-card__body">
          <div class="blog-card__cat">${post.category?.toUpperCase() || 'BLOG'}</div>
          <h3 class="blog-card__title">${post.title}</h3>
          <p class="blog-card__summary">${post.summary}</p>
        </div>
      </a>
    </article>
  `).join('');

  setTimeout(() => {
    grid.querySelectorAll('.blog-card').forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  }, 100);
}

// ── Dynamic Article Fetch (article.html) ──────────────────────
async function fetchSinglePost(slug) {
  const skeleton = document.getElementById('article-skeleton');
  const body = document.getElementById('article-body');
  const errorState = document.getElementById('article-error');
  if (!slug || !body) return;

  const currentLang = i18n.getCurrentLanguage();
  let post = null;

  if (supabase && !SUPABASE_URL.includes('VOTRE_PROJECT_ID')) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('lang', currentLang)
        .single();
      if (!error && data) post = data;
    } catch (err) {
      console.warn('[Sigma DI] fetchSinglePost error:', err);
    }
  }

  if (!post) {
    post = demoPosts.find(p => p.lang === currentLang && (p.slug === slug || p.id == slug));
  }

  if (skeleton) skeleton.style.display = 'none';

  if (post) {
    document.getElementById('article-title').textContent = post.title;
    document.getElementById('article-cat').textContent = post.category?.toUpperCase();
    document.getElementById('article-date').textContent = `Publié le ${formatDate(post.published_at)}`;
    document.getElementById('article-content').innerHTML = post.content || post.summary;
    document.getElementById('page-title').textContent = `${post.title} — Sigma DI`;
    body.style.display = 'block';
    if (errorState) errorState.style.display = 'none';
  } else {
    body.style.display = 'none';
    if (errorState) errorState.style.display = 'block';
  }
}

// ── FAQs ─────────────────────────────────────────────────────
const demoFAQs = [
  // French
  { id: 1, question: 'Comment m\'inscrire à un examen ?', answer: 'Vous pouvez vous inscrire en ligne via notre formulaire d\'inscription sur cette page, ou directement sur place pendant nos horaires d\'ouverture (Lundi–Vendredi 09h00–16h00).', lang: 'fr' },
  { id: 2, question: 'Quand recevrai-je mon certificat ?', answer: 'En général, vous recevrez votre certificat telc 4 à 6 semaines après la date de l\'examen. Il vous sera envoyé par courrier postal ou disponible au retrait en académie.', lang: 'fr' },
  { id: 3, question: 'Puis-je repasser l\'examen ?', answer: 'Oui, en cas d\'échec, vous pouvez vous réinscrire à la prochaine session disponible. Aucune limite de tentatives n\'est imposée.', lang: 'fr' },
  // English
  { id: 4, question: 'How do I register for an exam?', answer: 'You can register online using our registration form on this page, or directly on-site during our opening hours.', lang: 'en' },
  { id: 5, question: 'When will I receive my certificate?', answer: 'Generally, you will receive your telc certificate 4 to 6 weeks after the exam date.', lang: 'en' },
  { id: 6, question: 'Can I retake the exam?', answer: 'Yes, in case of failure, you can register for the next available session.', lang: 'en' },
  // German
  { id: 7, question: 'Wie melde ich mich für eine Prüfung an?', answer: 'Sie können sich online über unser Anmeldeformular auf dieser Seite oder direkt vor Ort während unserer Öffnungszeiten anmelden.', lang: 'de' },
  { id: 8, question: 'Wann erhalte ich mein Zertifikat?', answer: 'In der Regel erhalten Sie Ihr telc-Zertifikat 4 bis 6 Wochen nach dem Prüfungstermin.', lang: 'de' },
  { id: 9, question: 'Kann ich die Prüfung wiederholen?', answer: 'Ja, im Falle des Nichtbestehens können Sie sich für den nächsten verfügbaren Termin anmelden.', lang: 'de' }
];

async function fetchFAQs() {
  const currentLang = i18n.getCurrentLanguage();
  let faqs = demoFAQs.filter(f => f.lang === currentLang);

  if (supabase && !SUPABASE_URL.includes('VOTRE_PROJECT_ID')) {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('active', true)
        .eq('lang', currentLang)
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) faqs = data;
    } catch (err) {
      console.warn('[Sigma DI] fetchFAQs error:', err);
    }
  }

  // Limit preview list on index
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('index')) {
    faqs = faqs.slice(0, 3);
  }

  renderFAQAccordion(faqs);
}

function renderFAQAccordion(faqs) {
  const list = document.getElementById('faq-list');
  if (!list) return;

  list.innerHTML = faqs.map((faq, i) => `
    <div class="faq-item" id="faq-item-${i}">
      <button class="faq-q" id="faq-btn-${i}" aria-expanded="false" aria-controls="faq-a-${i}" onclick="toggleFAQ(${i})">
        <span>${faq.question}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-btn-${i}">
        <div class="faq-a-inner">${faq.answer}</div>
      </div>
    </div>
  `).join('');
}

function toggleFAQ(index) {
  const item    = document.getElementById(`faq-item-${index}`);
  const answer  = document.getElementById(`faq-a-${index}`);
  const btn     = document.getElementById(`faq-btn-${index}`);
  if (!item || !answer) return;

  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    const ans = el.querySelector('.faq-a');
    if (ans) ans.style.maxHeight = null;
    const b = el.querySelector('.faq-q');
    if (b) b.setAttribute('aria-expanded', 'false');
  });

  // Open clicked (if was closed)
  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }
}

// ── Registration Modal ────────────────────────────────────────
function openRegistrationModal(level = null, examId = null) {
  currentExamId = examId;
  currentLevel  = level;
  regCurrentStep = 1;

  // Show exam summary if specific exam selected
  const summaryEl = document.getElementById('exam-summary');
  if (summaryEl && examId) {
    const exam = allExamDates.find(e => e.id === examId);
    if (exam) {
      const lang = i18n.getCurrentLanguage();
      const headers = {
        fr: "📋 Examen sélectionné :",
        en: "📋 Selected Exam:",
        de: "📋 Ausgewählte Prüfung:"
      };
      const spotsLabel = {
        fr: "Places disponibles :",
        en: "Available spots:",
        de: "Verfügbare Plätze:"
      };
      const priceLabel = {
        fr: "Prix :",
        en: "Price:",
        de: "Preis:"
      };

      summaryEl.innerHTML = `
        <strong>${headers[lang] || headers.fr}</strong><br>
        <span>telc ${getLevelLabel(exam.exam_type)} — ${formatDate(exam.exam_date)} à ${formatTime(exam.exam_time)}</span><br>
        <span>${spotsLabel[lang] || spotsLabel.fr} <strong>${exam.available_spots}</strong> | ${priceLabel[lang] || priceLabel.fr} <strong>${formatPrice(exam.price_eur)}</strong></span>
      `;
      summaryEl.style.display = 'block';
    }
  } else if (summaryEl) {
    summaryEl.style.display = 'none';
  }

  regStep(1);
  document.getElementById('reg-success').classList.remove('show');
  document.getElementById('reg-step-1').style.display = '';
  document.getElementById('reg-step-2').style.display = 'none';
  document.getElementById('reg-footer').style.display = '';
  openModal('modal-registration');
}

function regStep(step) {
  regCurrentStep = step;

  document.getElementById('step-1').classList.toggle('active', step === 1);
  document.getElementById('step-1').classList.toggle('done', step > 1);
  document.getElementById('step-2').classList.toggle('active', step === 2);

  document.getElementById('reg-step-1').style.display = step === 1 ? '' : 'none';
  document.getElementById('reg-step-2').style.display = step === 2 ? '' : 'none';
  document.getElementById('btn-reg-back').style.display = step > 1 ? '' : 'none';
  
  const lang = i18n.getCurrentLanguage();
  const ctaContinue = lang === 'de' ? 'Weiter →' : (lang === 'en' ? 'Continue →' : 'Continuer →');
  const ctaConfirm = lang === 'de' ? 'Anmeldung bestätigen' : (lang === 'en' ? 'Confirm Registration' : 'Confirmer l\'inscription');
  
  document.getElementById('btn-reg-next').textContent = step === 1 ? ctaContinue : ctaConfirm;
}

function regNextStep() {
  if (regCurrentStep === 1) {
    if (!validateStep1()) return;

    // Fill recap
    const recap = document.getElementById('reg-recap');
    if (recap) {
      const lang = i18n.getCurrentLanguage();
      const labels = {
        fr: { recap: 'Récapitulatif :', exam: 'Examen' },
        en: { recap: 'Summary:', exam: 'Exam' },
        de: { recap: 'Zusammenfassung:', exam: 'Prüfung' }
      };
      const activeLabels = labels[lang] || labels.fr;

      recap.innerHTML = `
        <strong>${activeLabels.recap}</strong><br>
        👤 ${document.getElementById('reg-firstname').value} ${document.getElementById('reg-lastname').value}<br>
        ✉️ ${document.getElementById('reg-email').value}<br>
        📞 ${document.getElementById('reg-phone').value}<br>
        ${currentExamId ? `🎓 ${activeLabels.exam} : ${getLevelLabel(allExamDates.find(e=>e.id===currentExamId)?.exam_type || '')} — ${formatDate(allExamDates.find(e=>e.id===currentExamId)?.exam_date)}` : ''}
      `;
    }
    regStep(2);
  } else if (regCurrentStep === 2) {
    submitRegistration();
  }
}

function validateStep1() {
  const fields = [
    { id: 'reg-firstname' },
    { id: 'reg-lastname' },
    { id: 'reg-email' },
    { id: 'reg-phone' },
  ];
  let valid = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el || !el.value.trim()) {
      el?.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
    }
  });
  
  const lang = i18n.getCurrentLanguage();
  const alertFields = {
    fr: "Veuillez remplir tous les champs obligatoires.",
    en: "Please fill in all required fields.",
    de: "Bitte füllen Sie alle Pflichtfelder aus."
  };
  const alertEmail = {
    fr: "Veuillez entrer un e-mail valide.",
    en: "Please enter a valid email address.",
    de: "Bitte geben Sie eine gültige E-Mail-Adresse ein."
  };

  if (!valid) { showToast(alertFields[lang] || alertFields.fr, 'error'); return false; }

  const emailEl = document.getElementById('reg-email');
  if (emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('error');
    showToast(alertEmail[lang] || alertEmail.fr, 'error');
    return false;
  }
  return true;
}

async function submitRegistration() {
  const termsEl = document.getElementById('reg-terms');
  const lang = i18n.getCurrentLanguage();
  const alertTerms = {
    fr: "Veuillez accepter les conditions générales.",
    en: "Please accept the terms and conditions.",
    de: "Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen."
  };

  if (!termsEl?.checked) {
    showToast(alertTerms[lang] || alertTerms.fr, 'error');
    return;
  }

  const payload = {
    exam_date_id:   currentExamId,
    first_name:     document.getElementById('reg-firstname').value.trim(),
    last_name:      document.getElementById('reg-lastname').value.trim(),
    email:          document.getElementById('reg-email').value.trim(),
    phone:          document.getElementById('reg-phone').value.trim(),
    whatsapp:       document.getElementById('reg-whatsapp').value.trim() || null,
    nationality:    document.getElementById('reg-nationality').value.trim() || null,
    payment_method: document.getElementById('reg-payment').value,
  };

  const submitBtn = document.getElementById('btn-reg-next');
  const loadingLabels = {
    fr: "Envoi en cours…",
    en: "Sending…",
    de: "Wird gesendet…"
  };

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = loadingLabels[lang] || loadingLabels.fr; }

  if (supabase && !SUPABASE_URL.includes('VOTRE_PROJECT_ID') && payload.exam_date_id) {
    try {
      const { error } = await supabase.from('registrations').insert([payload]);
      if (error) throw error;
    } catch (err) {
      console.error('[Sigma DI] submitRegistration error:', err);
      const alertErr = {
        fr: "Une erreur est survenue. Veuillez réessayer.",
        en: "An error occurred. Please try again.",
        de: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
      };
      showToast(alertErr[lang] || alertErr.fr, 'error');
      if (submitBtn) { submitBtn.disabled = false; regStep(2); }
      return;
    }
  } else {
    // Demo mode delay
    await new Promise(r => setTimeout(r, 800));
  }

  document.getElementById('reg-step-2').style.display = 'none';
  document.getElementById('reg-footer').style.display = 'none';
  document.getElementById('reg-success').classList.add('show');
  
  const alertSuccess = {
    fr: "Inscription enregistrée avec succès !",
    en: "Registration successfully recorded!",
    de: "Anmeldung erfolgreich registriert!"
  };
  showToast(alertSuccess[lang] || alertSuccess.fr, 'success');

  // Refresh
  setTimeout(fetchExamDates, 1500);
}

// ── Consultation Modal ────────────────────────────────────────
function openConsultationModal() {
  document.getElementById('cons-success').classList.remove('show');
  document.getElementById('cons-form').style.display = '';
  document.getElementById('cons-footer').style.display = '';
  openModal('modal-consultation');
}

async function submitConsultation() {
  const required = ['cons-firstname', 'cons-lastname', 'cons-email', 'cons-phone'];
  let valid = true;
  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el?.value.trim()) { el?.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });

  const lang = i18n.getCurrentLanguage();
  const alertFields = {
    fr: "Veuillez remplir tous les champs obligatoires.",
    en: "Please fill in all required fields.",
    de: "Bitte füllen Sie alle Pflichtfelder aus."
  };

  if (!valid) { showToast(alertFields[lang] || alertFields.fr, 'error'); return; }

  const payload = {
    first_name:     document.getElementById('cons-firstname').value.trim(),
    last_name:      document.getElementById('cons-lastname').value.trim(),
    email:          document.getElementById('cons-email').value.trim(),
    phone:          document.getElementById('cons-phone').value.trim(),
    preferred_date: document.getElementById('cons-date').value || null,
    preferred_time: document.getElementById('cons-time').value || null,
    topic:          document.getElementById('cons-topic').value,
  };

  const btn = document.getElementById('btn-cons-submit');
  const loadingBtn = { fr: "Envoi…", en: "Sending…", de: "Senden…" };
  if (btn) { btn.disabled = true; btn.textContent = loadingBtn[lang] || loadingBtn.fr; }

  if (supabase && !SUPABASE_URL.includes('VOTRE_PROJECT_ID')) {
    try {
      const { error } = await supabase.from('consultations').insert([payload]);
      if (error) throw error;
    } catch (err) {
      console.error('[Sigma DI] submitConsultation error:', err);
      const alertErr = {
        fr: "Erreur lors de l'envoi. Réessayez.",
        en: "Error while sending. Try again.",
        de: "Fehler beim Senden. Versuchen Sie es erneut."
      };
      showToast(alertErr[lang] || alertErr.fr, 'error');
      if (btn) { btn.disabled = false; btn.textContent = lang === 'de' ? 'Termin bestätigen' : (lang === 'en' ? 'Confirm Appointment' : 'Confirmer le rendez-vous'); }
      return;
    }
  } else {
    await new Promise(r => setTimeout(r, 700));
  }

  document.getElementById('cons-form').style.display = 'none';
  document.getElementById('cons-footer').style.display = 'none';
  document.getElementById('cons-success').classList.add('show');
  
  const alertSuccess = {
    fr: "Rendez-vous demandé avec succès !",
    en: "Appointment successfully requested!",
    de: "Termin erfolgreich angefragt!"
  };
  showToast(alertSuccess[lang] || alertSuccess.fr, 'success');
}

// ── Contact Form ──────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const requiredFields = [
      { id: 'contact-name' },
      { id: 'contact-email' },
      { id: 'contact-message' },
    ];

    let valid = true;
    requiredFields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el?.value.trim()) { el?.classList.add('error'); valid = false; }
      else el.classList.remove('error');
    });

    const lang = i18n.getCurrentLanguage();
    const alertFields = {
      fr: "Veuillez remplir tous les champs obligatoires.",
      en: "Please fill in all required fields.",
      de: "Bitte füllen Sie alle Pflichtfelder aus."
    };

    if (!valid) { showToast(alertFields[lang] || alertFields.fr, 'error'); return; }

    const submitBtn = document.getElementById('btn-contact-submit');
    const loadingLabels = { fr: "Envoi en cours…", en: "Sending…", de: "Wird gesendet…" };
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = loadingLabels[lang] || loadingLabels.fr; }

    const payload = {
      name:    document.getElementById('contact-name').value.trim(),
      email:   document.getElementById('contact-email').value.trim(),
      phone:   document.getElementById('contact-phone').value.trim() || null,
      subject: document.getElementById('contact-subject').value.trim() || null,
      message: document.getElementById('contact-message').value.trim(),
    };

    if (supabase && !SUPABASE_URL.includes('VOTRE_PROJECT_ID')) {
      try {
        const { error } = await supabase.from('contact_messages').insert([payload]);
        if (error) throw error;
      } catch (err) {
        console.error('[Sigma DI] contact form error:', err);
        const alertErr = {
          fr: "Erreur lors de l'envoi. Réessayez.",
          en: "Error while sending. Try again.",
          de: "Fehler beim Senden. Versuchen Sie es erneut."
        };
        showToast(alertErr[lang] || alertErr.fr, 'error');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = lang === 'de' ? 'Nachricht senden' : (lang === 'en' ? 'Send Message' : 'Envoyer le message'); }
        return;
      }
    } else {
      await new Promise(r => setTimeout(r, 800));
    }

    form.reset();
    
    const alertSuccess = {
      fr: "Message envoyé avec succès ! Nous vous répondrons rapidement.",
      en: "Message successfully sent! We will reply shortly.",
      de: "Nachricht erfolgreich gesendet! Wir antworten Ihnen in Kürze."
    };
    showToast(alertSuccess[lang] || alertSuccess.fr, 'success');
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = lang === 'de' ? 'Nachricht senden' : (lang === 'en' ? 'Send Message' : 'Envoyer le message'); }
  });

  // Live feedback
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) input.classList.remove('error');
    });
  });
}

// ── Modal Helpers ────────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(id); }, { once: true });
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modals on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Prevent animation flashes
  document.body.classList.add('js-ready');

  initSupabase();
  initTheme();
  initNavbar();
  initScrollAnimations();
  initContactForm();

  // Initialize translation engine
  if (window.i18n) {
    window.i18n.init();
  }

  // Reactive listener to language change
  document.addEventListener('languageChanged', () => {
    fetchExamDates();
    fetchBlogPosts();
    fetchFAQs();
  });

  // Load lists
  fetchExamDates();
  fetchBlogPosts();
  fetchFAQs();

  // Parse routing parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Dynamic register target
  const registerId = urlParams.get('register');
  if (registerId) {
    setTimeout(() => {
      openRegistrationModal(null, registerId);
    }, 600);
  }

  // Filter parameter (e.g. filter dates by default)
  const filterVal = urlParams.get('filter');
  if (filterVal) {
    currentFilter = filterVal;
    setTimeout(() => filterExams(filterVal), 300);
  }

  // Dynamic Single Blog Article fetching
  const articleSlug = urlParams.get('slug');
  if (articleSlug && window.location.pathname.endsWith('article.html')) {
    fetchSinglePost(articleSlug);
  }

  console.log('[Sigma DI] Application initialized successfully.');
});
