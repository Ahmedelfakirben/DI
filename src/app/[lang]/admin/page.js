"use client";

import { useState, useEffect, useTransition, use } from 'react';
import Link from 'next/link';
import { 
  checkAdminAuth, 
  verifyAdminUser, 
  logoutAdmin, 
  getDashboardStats, 
  getExamsList, 
  saveExamSession, 
  deleteExamSession, 
  getRegistrationsList, 
  updateRegistrationStatus, 
  reassignRegistrationExam, 
  deleteRegistration, 
  getConsultationsList, 
  updateConsultationStatus, 
  getContactMessages, 
  markContactMessageRead 
} from '@/app/actions/admin';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Mail, 
  Plus, 
  Search, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  RefreshCw, 
  Trash2, 
  Edit2, 
  Phone, 
  Globe,
  FileText,
  UserCheck,
  TrendingUp,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Localized translation dictionaries for the administrative dashboard
const adminT = {
  fr: {
    admin_portal: "Portail Administration",
    admin_subtitle: "Gestion officielle des examens, inscriptions et demandes",
    passcode_label: "Code d'accès administrateur",
    passcode_placeholder: "Entrez le code secret...",
    btn_login: "Se connecter",
    login_error: "Code d'accès incorrect.",
    btn_logout: "Déconnexion",
    tab_overview: "Aperçu",
    tab_exams: "Examens telc",
    tab_regs: "Inscriptions",
    tab_inquiries: "Inbox & Citas",
    
    // Overview tab
    stats_earnings: "Chiffre d'affaires",
    stats_regs: "Inscriptions actives",
    stats_pending: "En attente",
    stats_exams: "Sessions d'examens",
    stats_inquiries: "Demandes à traiter",
    stats_fill_rate: "Taux de remplissage",
    recent_activity: "Inscriptions récentes",
    no_recent_activity: "Aucune inscription enregistrée.",
    quick_stats: "Statistiques Clés",
    overview_description: "Indicateurs clés et inscriptions en temps réel",
    
    // Exams tab
    btn_create_exam: "Créer une Session",
    edit_exam_title: "Modifier la session",
    create_exam_title: "Créer une nouvelle session d'examen",
    exam_type: "Niveau",
    exam_date: "Date",
    exam_time: "Heure",
    exam_deadline: "Limite d'inscription",
    exam_spots: "Places (Max / Libres)",
    exam_price: "Prix (DH)",
    exam_location: "Lieu",
    exam_status: "Statut",
    exam_notes: "Notes administratifs",
    actions: "Actions",
    
    // Registrations tab
    filter_all_exams: "Filtrer par session d'examen...",
    search_placeholder: "Rechercher un candidat (Nom, Email, Tél)...",
    export_csv: "Exporter en CSV",
    table_candidate: "Candidat",
    table_exam: "Date d'examen",
    table_payment: "Paiement / Statut",
    table_registered: "Date d'inscription",
    payment_status_pending: "En attente",
    payment_status_confirmed: "Payé (Confirmé)",
    payment_status_cancelled: "Annulé",
    btn_reassign: "Réassigner",
    reassign_modal_title: "Réassigner le candidat à une autre session",
    
    // Inquiries tab
    col_consultations: "Demandes de Consultations",
    col_messages: "Messages de Contact",
    mark_read: "Marquer lu",
    mark_unread: "Marquer non lu",
    status_resolved: "Résolu",
    status_pending: "En attente",
    status_done: "Terminé",
    status_cancelled: "Annulé",
    
    // Generic
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    confirm_delete: "Confirmer la suppression ?",
    no_records: "Aucun enregistrement trouvé."
  },
  en: {
    admin_portal: "Admin Portal",
    admin_subtitle: "Official management of exams, registrations, and inquiries",
    passcode_label: "Administrator Passcode",
    passcode_placeholder: "Enter secret passcode...",
    btn_login: "Unlock Dashboard",
    login_error: "Incorrect passcode.",
    btn_logout: "Sign Out",
    tab_overview: "Overview",
    tab_exams: "telc Exams",
    tab_regs: "Registrations",
    tab_inquiries: "Inbox & Consultation",
    
    stats_earnings: "Total Revenue",
    stats_regs: "Active Candidates",
    stats_pending: "Pending Payments",
    stats_exams: "Active Exam Sessions",
    stats_inquiries: "Inbox Inquiries",
    stats_fill_rate: "Spots Utilization",
    recent_activity: "Recent Registrations",
    no_recent_activity: "No registrations recorded.",
    quick_stats: "Key Performance Indicators",
    overview_description: "Main metrics and real-time candidate signups",
    
    btn_create_exam: "Create Session",
    edit_exam_title: "Edit Exam Session",
    create_exam_title: "Create New Exam Session",
    exam_type: "Level",
    exam_date: "Date",
    exam_time: "Time",
    exam_deadline: "Registration Deadline",
    exam_spots: "Spots (Total / Available)",
    exam_price: "Price (DH)",
    exam_location: "Location",
    exam_status: "Status",
    exam_notes: "Administrative Notes",
    actions: "Actions",
    
    filter_all_exams: "Filter by exam session...",
    search_placeholder: "Search candidate (Name, Email, Phone)...",
    export_csv: "Export CSV",
    table_candidate: "Candidate",
    table_exam: "Exam Date",
    table_payment: "Payment / Status",
    table_registered: "Date Signed Up",
    payment_status_pending: "Pending",
    payment_status_confirmed: "Confirmed (Paid)",
    payment_status_cancelled: "Cancelled",
    btn_reassign: "Reassign",
    reassign_modal_title: "Reassign Candidate to another session",
    
    col_consultations: "Consultation Bookings",
    col_messages: "Contact Messages",
    mark_read: "Mark Read",
    mark_unread: "Mark Unread",
    status_resolved: "Resolved",
    status_pending: "Pending",
    status_done: "Done",
    status_cancelled: "Cancelled",
    
    loading: "Loading...",
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    confirm_delete: "Confirm deletion?",
    no_records: "No records found."
  },
  de: {
    admin_portal: "Admin-Portal",
    admin_subtitle: "Offizielle Verwaltung von Prüfungen, Anmeldungen und Anfragen",
    passcode_label: "Administrator-Passwort",
    passcode_placeholder: "Passwort eingeben...",
    btn_login: "Anmelden",
    login_error: "Ungültiges Passwort.",
    btn_logout: "Abmelden",
    tab_overview: "Übersicht",
    tab_exams: "telc Prüfungen",
    tab_regs: "Anmeldungen",
    tab_inquiries: "Posteingang & Beratung",
    
    stats_earnings: "Gesamtumsatz",
    stats_regs: "Aktive Anmeldungen",
    stats_pending: "Ausstehende Zahlungen",
    stats_exams: "Aktive Prüfungen",
    stats_inquiries: "Offene Anfragen",
    stats_fill_rate: "Auslastungsquote",
    recent_activity: "Kürzliche Anmeldungen",
    no_recent_activity: "Keine Anmeldungen verzeichnet.",
    quick_stats: "Leistungskennzahlen",
    overview_description: "Wichtigste Kennzahlen und Echtzeitdaten",
    
    btn_create_exam: "Prüfung erstellen",
    edit_exam_title: "Prüfungssitzung bearbeiten",
    create_exam_title: "Neue Prüfungssitzung erstellen",
    exam_type: "Niveau",
    exam_date: "Datum",
    exam_time: "Uhrzeit",
    exam_deadline: "Anmeldefrist",
    exam_spots: "Plätze (Gesamt / Frei)",
    exam_price: "Preis (DH)",
    exam_location: "Ort",
    exam_status: "Status",
    exam_notes: "Administrative Notizen",
    actions: "Aktionen",
    
    filter_all_exams: "Nach Prüfung filtern...",
    search_placeholder: "Kandidaten suchen (Name, E-Mail, Telefon)...",
    export_csv: "Als CSV exportieren",
    table_candidate: "Kandidat",
    table_exam: "Prüfungstermin",
    table_payment: "Zahlung / Status",
    table_registered: "Anmeldedatum",
    payment_status_pending: "Ausstehend",
    payment_status_confirmed: "Bezahlt (Bestätigt)",
    payment_status_cancelled: "Storniert",
    btn_reassign: "Umbuchen",
    reassign_modal_title: "Kandidaten auf anderen Termin umbuchen",
    
    col_consultations: "Beratungstermine",
    col_messages: "Kontaktanfragen",
    mark_read: "Als gelesen markieren",
    mark_unread: "Als ungelesen markieren",
    status_resolved: "Gelöst",
    status_pending: "Ausstehend",
    status_done: "Erledigt",
    status_cancelled: "Abgesagt",
    
    loading: "Laden...",
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    confirm_delete: "Löschen bestätigen?",
    no_records: "Keine Einträge gefunden."
  }
};

export default function AdminDashboard({ params }) {
  const { lang } = use(params);
  const t = adminT[lang] || adminT.fr;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, startLoginTransition] = useTransition();

  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Database Data States
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentRegs, setRecentRegs] = useState([]);
  const [exams, setExams] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [messages, setMessages] = useState([]);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState('');

  // Modals & Editing States
  const [editingExam, setEditingExam] = useState(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [reassigningReg, setReassigningReg] = useState(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  // Check auth cookie on mount
  useEffect(() => {
    async function checkAuth() {
      const isAuth = await checkAdminAuth();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        loadAllData();
      } else {
        setIsLoadingData(false);
      }
    }
    checkAuth();
  }, []);

  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const statsRes = await getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentRegs(statsRes.recentRegs);
        setIsDemoMode(!!statsRes.demoMode);
      }

      const examsRes = await getExamsList();
      if (examsRes.success) setExams(examsRes.exams);

      const regsRes = await getRegistrationsList();
      if (regsRes.success) setRegistrations(regsRes.registrations);

      const consRes = await getConsultationsList();
      if (consRes.success) setConsultations(consRes.consultations);

      const msgRes = await getContactMessages();
      if (msgRes.success) setMessages(msgRes.messages);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    startLoginTransition(async () => {
      const res = await verifyAdminUser(email, password);
      if (res.success) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setLoginError(res.error || t.login_error);
      }
    });
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // ── Exam Dates CRUD handlers ───────────────────────────────────────

  const openExamCreateModal = () => {
    setEditingExam({
      exam_type: 'B1',
      exam_date: new Date().toISOString().split('T')[0],
      exam_time: '09:00',
      registration_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_spots: 20,
      price_eur: 180.00,
      location: 'Sigma Deutsch Institut',
      notes: '',
      status: 'open'
    });
    setIsExamModalOpen(true);
  };

  const openExamEditModal = (exam) => {
    setEditingExam({ ...exam });
    setIsExamModalOpen(true);
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    try {
      const res = await saveExamSession(editingExam);
      if (res.success) {
        setIsExamModalOpen(false);
        setEditingExam(null);
        loadAllData(); // Reload stats and lists
      } else {
        alert("Error saving exam session: " + res.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteExam = async (id) => {
    if (!confirm(t.confirm_delete)) return;
    try {
      const res = await deleteExamSession(id);
      if (res.success) {
        if (res.status === 'cancelled_due_to_regs') {
          alert("Note: Examen non supprimé car il comporte des inscriptions actives. Son statut a été basculé sur 'cancelled' pour préserver l'historique.");
        }
        loadAllData();
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // ── Registration Status update & reassign ─────────────────────────

  const handleUpdateRegStatus = async (id, status, notes) => {
    try {
      const res = await updateRegistrationStatus(id, status, notes);
      if (res.success) {
        loadAllData();
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteReg = async (id) => {
    if (!confirm(t.confirm_delete)) return;
    try {
      const res = await deleteRegistration(id);
      if (res.success) {
        loadAllData();
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleReassign = async (newExamId) => {
    try {
      const res = await reassignRegistrationExam(reassigningReg.id, newExamId);
      if (res.success) {
        setIsReassignModalOpen(false);
        setReassigningReg(null);
        loadAllData();
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // ── Consultation & Message status togglers ─────────────────────────

  const handleUpdateConsStatus = async (id, status) => {
    try {
      const res = await updateConsultationStatus(id, status);
      if (res.success) loadAllData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleToggleMessageRead = async (id, currentRead) => {
    try {
      const res = await markContactMessageRead(id, !currentRead);
      if (res.success) loadAllData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // ── Exporter (CSV) ──────────────────────────────────────────────────

  const handleExportCSV = () => {
    const headers = ["Nom", "Prenom", "Email", "Telephone", "WhatsApp", "Nationalite", "Exam Type", "Exam Date", "Paiement Status", "Methode", "Date Inscription\n"];
    const rows = filteredRegistrations.map(r => {
      const examDetail = r.exam_dates ? `${r.exam_dates.exam_type} (${r.exam_dates.exam_date})` : 'N/A';
      return [
        `"${r.last_name}"`,
        `"${r.first_name}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        `"${r.whatsapp || ''}"`,
        `"${r.nationality || ''}"`,
        `"${r.exam_dates?.exam_type || ''}"`,
        `"${r.exam_dates?.exam_date || ''}"`,
        `"${r.payment_status}"`,
        `"${r.payment_method}"`,
        `"${new Date(r.created_at).toLocaleDateString()}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sigma_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering Logic
  const filteredRegistrations = registrations.filter(r => {
    const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.phone.includes(searchTerm);
    const matchesExam = examFilter === '' || r.exam_date_id === examFilter;
    return matchesSearch && matchesExam;
  });

  // Calculate spots fill rate
  const totalCapacity = exams.reduce((acc, e) => acc + e.total_spots, 0);
  const totalAvailable = exams.reduce((acc, e) => acc + e.available_spots, 0);
  const fillRate = totalCapacity > 0 ? Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100) : 0;

  // Unauthenticated Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden bg-grid-pattern text-white">
        {/* Glow Spheres */}
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-gold-400/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-navy-500/5 blur-[80px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-8 text-center">
            <div className="text-4xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gold-300 font-display">SIGMA DI</div>
            <span className="text-[10px] text-gold-400 tracking-[0.3em] font-bold uppercase">{t.admin_portal}</span>
          </div>

          {/* Login Card */}
          <div className="premium-glass-card rounded-[32px] p-8 border border-white/10 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0">
              <div className="german-flag-accent w-full" />
            </div>

            <div className="flex flex-col gap-1 mb-6 text-center mt-3">
              <h2 className="text-xl font-bold font-display">{t.admin_portal}</h2>
              <p className="text-xs text-navy-200">{t.admin_subtitle}</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gold-400">E-mail</label>
                <input 
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-900/60 border border-white/15 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gold-400">Password</label>
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-900/60 border border-white/15 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
                  required
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-red-400 bg-red-950/30 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs mt-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{loginError}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="btn-gold-grad w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
              >
                {isLoggingIn ? t.loading : t.btn_login}
              </button>
            </form>
          </div>

          <div className="text-center mt-8">
            <Link href={`/${lang}`} className="text-xs text-navy-200 hover:text-gold-400 transition-colors">
              ← {lang === 'de' ? 'Zurück zur Website' : lang === 'en' ? 'Back to website' : 'Retour au site'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Loader State
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-text-soft">{t.loading}</span>
        </div>
      </div>
    );
  }

  // Authenticated Main View
  return (
    <div className="min-h-screen bg-bg text-text relative bg-grid-pattern pb-12">
      {/* Top Banner Accent */}
      <div className="german-flag-accent w-full" />

      {isDemoMode && (
        <div className="bg-amber-500/10 dark:bg-amber-500/5 border-b border-gold-500/20 py-2.5 px-6 text-center text-[10px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest flex items-center justify-center gap-2 relative z-50">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span>Mode Démo Actif — Configurez SUPABASE_SERVICE_ROLE_KEY dans .env.local pour lier la base de données réelle.</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-bg-card/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-text to-gold-600 font-display">SIGMA DI</div>
            <span className="px-2.5 py-0.5 rounded-full bg-gold-400 text-navy-950 text-[9px] font-black uppercase tracking-wider">Admin</span>
          </div>

          <nav className="flex items-center gap-2">
            {[
              { id: 'overview', label: t.tab_overview, icon: LayoutDashboard },
              { id: 'exams', label: t.tab_exams, icon: Calendar },
              { id: 'regs', label: t.tab_regs, icon: Users },
              { id: 'inquiries', label: t.tab_inquiries, icon: Mail },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-md' 
                    : 'hover:bg-bg-alt text-text-soft'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-border hover:bg-red-500/10 hover:border-red-500/30 text-text-soft hover:text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.btn_logout}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{t.tab_overview}</h1>
              <p className="text-xs text-text-soft">{t.overview_description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Earnings */}
              <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t.stats_earnings}</span>
                  <span className="text-2xl font-extrabold font-display text-text">{stats?.totalEarnings || 0} DH</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gold-100 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center text-xl">
                  💶
                </div>
              </div>

              {/* Total registrations */}
              <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t.stats_regs}</span>
                  <span className="text-2xl font-extrabold font-display text-text">{stats?.totalRegistrations || 0}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
                  👨‍🎓
                </div>
              </div>

              {/* Pending */}
              <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t.stats_pending}</span>
                  <span className="text-2xl font-extrabold font-display text-text">{stats?.pendingRegistrations || 0}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl">
                  ⏳
                </div>
              </div>

              {/* Inquiries */}
              <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{t.stats_inquiries}</span>
                  <span className="text-2xl font-extrabold font-display text-text">{stats?.totalInquiries || 0}</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl">
                  📬
                </div>
              </div>
            </div>

            {/* Sub grids: fill rate and activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Load gauge */}
              <div className="bg-bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[300px]">
                <div className="flex flex-col gap-1 mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text">{t.stats_fill_rate}</h3>
                  <span className="text-xs text-text-muted">{lang === 'de' ? 'Gesamte Auslastung der Plätze' : lang === 'en' ? 'Overall exam seats utilization' : 'Remplissage des places disponibles'}</span>
                </div>

                <div className="flex flex-col items-center justify-center py-4 relative">
                  {/* Custom SVG ring chart */}
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle cx="72" cy="72" r="60" stroke="rgba(13, 27, 62, 0.04)" strokeWidth="12" fill="transparent" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      stroke="url(#goldGradient)" 
                      strokeWidth="12" 
                      fill="transparent" 
                      strokeDasharray="376.8" 
                      strokeDashoffset={376.8 - (376.8 * fillRate) / 100}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#b8920f" />
                        <stop offset="100%" stopColor="#c9a227" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-text font-display">{fillRate}%</span>
                    <span className="text-[9px] uppercase tracking-widest font-black text-gold-600 mt-1">{lang === 'de' ? 'GEBUCHT' : lang === 'en' ? 'BOOKED' : 'RÉSERVÉ'}</span>
                  </div>
                </div>

                <div className="w-full text-center mt-4">
                  <p className="text-xs text-text-soft font-semibold">
                    {lang === 'de' 
                      ? `${totalCapacity - totalAvailable} von ${totalCapacity} Plätzen belegt` 
                      : lang === 'en' 
                      ? `${totalCapacity - totalAvailable} out of ${totalCapacity} spots filled` 
                      : `${totalCapacity - totalAvailable} places réservées sur ${totalCapacity} au total`}
                  </p>
                </div>
              </div>

              {/* Recent activity */}
              <div className="lg:col-span-2 bg-bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
                <div className="flex flex-col gap-1 mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text">{t.recent_activity}</h3>
                  <span className="text-xs text-text-muted">{lang === 'de' ? 'Die letzten 5 Anmeldungen' : lang === 'en' ? 'Last 5 candidate registrations' : 'Les 5 dernières inscriptions'}</span>
                </div>

                <div className="flex flex-col gap-3.5 flex-1">
                  {recentRegs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-8 text-text-muted text-xs font-semibold">
                      {t.no_recent_activity}
                    </div>
                  ) : (
                    recentRegs.map((reg, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-bg-alt/50 border border-border/60 hover:bg-bg-alt transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gold-100 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 flex items-center justify-center text-xs font-bold">
                            {reg.first_name[0]}{reg.last_name[0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-text">{reg.first_name} {reg.last_name}</h4>
                            <p className="text-[10px] text-text-muted font-semibold mt-0.5">
                              {reg.exam_dates?.exam_type} — {new Date(reg.exam_dates?.exam_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] text-text-muted font-mono">{new Date(reg.created_at).toLocaleDateString()}</span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            reg.payment_status === 'confirmed' 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                              : reg.payment_status === 'pending' 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' 
                              : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400'
                          }`}>
                            {reg.payment_status === 'confirmed' ? t.payment_status_confirmed.split(' ')[0] : reg.payment_status === 'pending' ? t.payment_status_pending : t.payment_status_cancelled}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: EXAMS (CRUD) */}
        {activeTab === 'exams' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{t.tab_exams}</h1>
                <p className="text-xs text-text-soft">{lang === 'de' ? 'Prüfungstermine verwalten und erstellen' : lang === 'en' ? 'Manage and create exam sessions' : 'Gérer et créer les sessions d\'examens'}</p>
              </div>
              <button 
                onClick={openExamCreateModal}
                className="btn-gold-grad px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 active:scale-100 shadow-md"
              >
                <Plus className="w-4 h-4" />
                {t.btn_create_exam}
              </button>
            </div>

            {/* Table Card */}
            <div className="bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-bg-alt/70 border-b border-border text-text-soft font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">{t.exam_type}</th>
                      <th className="px-6 py-4">{t.exam_date}</th>
                      <th className="px-6 py-4">{t.exam_time}</th>
                      <th className="px-6 py-4">{t.exam_deadline}</th>
                      <th className="px-6 py-4">{t.exam_spots}</th>
                      <th className="px-6 py-4">{t.exam_price}</th>
                      <th className="px-6 py-4">{t.exam_location}</th>
                      <th className="px-6 py-4">{t.exam_status}</th>
                      <th className="px-6 py-4 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {exams.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center py-10 text-text-muted font-bold">{t.no_records}</td>
                      </tr>
                    ) : (
                      exams.map((exam) => (
                        <tr key={exam.id} className="hover:bg-bg-alt/30 transition-colors">
                          <td className="px-6 py-4 font-extrabold text-gold-600 dark:text-gold-400 text-sm">{exam.exam_type}</td>
                          <td className="px-6 py-4 font-semibold text-text">{new Date(exam.exam_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-text-soft">{exam.exam_time.substring(0,5)}</td>
                          <td className="px-6 py-4 text-text-muted font-semibold">{new Date(exam.registration_deadline).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-semibold">
                            <span className="text-text">{exam.total_spots}</span>
                            <span className="text-text-muted mx-1">/</span>
                            <span className={`font-bold ${exam.available_spots <= 3 ? 'text-red-500' : 'text-emerald-500'}`}>{exam.available_spots}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-text">{exam.price_eur} DH</td>
                          <td className="px-6 py-4 text-text-muted max-w-[120px] truncate">{exam.location}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              exam.status === 'open' 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                                : exam.status === 'full' 
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400'
                            }`}>
                              {exam.status === 'open' ? 'ouvert' : exam.status === 'full' ? 'complet' : 'annulé'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-2 mt-1">
                            <button 
                              onClick={() => openExamEditModal(exam)}
                              className="p-1.5 rounded-lg border border-border hover:bg-gold-500/10 text-text-soft hover:text-gold-600 transition-colors"
                              title={t.edit}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteExam(exam.id)}
                              className="p-1.5 rounded-lg border border-border hover:bg-red-500/10 text-text-soft hover:text-red-500 transition-colors"
                              title={t.delete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTRATIONS */}
        {activeTab === 'regs' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{t.tab_regs}</h1>
                <p className="text-xs text-text-soft">{lang === 'de' ? 'Kandidatenliste und Zahlungsstatus bearbeiten' : lang === 'en' ? 'Manage candidate list and payment statuses' : 'Gérer les candidats et statuts de paiements'}</p>
              </div>
              
              <button 
                onClick={handleExportCSV}
                className="px-5 py-3 rounded-full border border-border hover:bg-bg-alt text-text-soft font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                {t.export_csv}
              </button>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input 
                  type="text"
                  placeholder={t.search_placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-card border border-border text-text placeholder-text-muted focus:outline-none focus:border-gold-400 transition-colors text-xs font-semibold"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={examFilter}
                  onChange={(e) => setExamFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-text focus:outline-none focus:border-gold-400 transition-colors text-xs font-semibold"
                >
                  <option value="">{t.filter_all_exams}</option>
                  {exams.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.exam_type} — {new Date(e.exam_date).toLocaleDateString()} ({e.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table Card */}
            <div className="bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-bg-alt/70 border-b border-border text-text-soft font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">{t.table_candidate}</th>
                      <th className="px-6 py-4">{t.table_exam}</th>
                      <th className="px-6 py-4">{t.table_payment}</th>
                      <th className="px-6 py-4">{t.table_registered}</th>
                      <th className="px-6 py-4 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10 text-text-muted font-bold">{t.no_records}</td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-bg-alt/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-extrabold text-text text-sm">{reg.first_name} {reg.last_name}</span>
                              <span className="text-text-muted text-[10px] font-semibold">{reg.email}</span>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-text-soft font-bold uppercase">
                                <span className="flex items-center gap-0.5 text-blue-500"><Phone className="w-2.5 h-2.5" /> {reg.phone}</span>
                                {reg.nationality && <span className="flex items-center gap-0.5 text-orange-500"><Globe className="w-2.5 h-2.5" /> {reg.nationality}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {reg.exam_dates ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-gold-600 dark:text-gold-400">{reg.exam_dates.exam_type} Exam</span>
                                <span className="text-text font-semibold">{new Date(reg.exam_dates.exam_date).toLocaleDateString()}</span>
                                <span className="text-[10px] text-text-muted font-semibold">{reg.exam_dates.exam_time.substring(0,5)}</span>
                              </div>
                            ) : (
                              <span className="text-red-500 font-bold">N/A (Deleted)</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-start gap-1">
                              {/* Payment Status Switcher Trigger */}
                              <select
                                value={reg.payment_status}
                                onChange={(e) => handleUpdateRegStatus(reg.id, e.target.value, reg.notes)}
                                className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg focus:outline-none border border-transparent ${
                                  reg.payment_status === 'confirmed' 
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400' 
                                    : reg.payment_status === 'pending' 
                                    ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400' 
                                    : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-400'
                                }`}
                              >
                                <option value="pending">{t.payment_status_pending}</option>
                                <option value="confirmed">{t.payment_status_confirmed.split(' ')[0]}</option>
                                <option value="cancelled">{t.payment_status_cancelled}</option>
                              </select>
                              <span className="text-[9px] text-text-muted font-bold uppercase mt-0.5">
                                {reg.payment_method === 'transfer' ? 'Virement' : 'Espèces'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-text-muted font-mono">{new Date(reg.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-2 mt-2">
                            <button 
                              onClick={() => {
                                setReassigningReg(reg);
                                setIsReassignModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 border border-border hover:bg-gold-500/10 text-text-soft hover:text-gold-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                              title={t.btn_reassign}
                            >
                              {t.btn_reassign}
                            </button>
                            <button 
                              onClick={() => handleDeleteReg(reg.id)}
                              className="p-1.5 rounded-lg border border-border hover:bg-red-500/10 text-text-soft hover:text-red-500 transition-colors"
                              title={t.delete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INQUIRIES & MESSAGES */}
        {activeTab === 'inquiries' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Consultations Column */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-display text-text">{t.col_consultations}</h2>
                <span className="text-xs text-text-muted">{lang === 'de' ? 'Buchungen für Beratungsgespräche' : lang === 'en' ? 'Personalized consultation bookings' : 'Créneaux conseil réservés par les prospects'}</span>
              </div>

              <div className="flex flex-col gap-4">
                {consultations.length === 0 ? (
                  <div className="bg-bg-card border border-border rounded-2xl p-8 text-center text-text-muted font-bold text-xs">{t.no_records}</div>
                ) : (
                  consultations.map((con) => (
                    <div key={con.id} className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-extrabold text-sm text-text">{con.first_name} {con.last_name}</h3>
                          <p className="text-[10px] text-text-muted font-semibold mt-0.5">{con.email} • {con.phone}</p>
                        </div>
                        <select
                          value={con.status}
                          onChange={(e) => handleUpdateConsStatus(con.id, e.target.value)}
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg focus:outline-none border ${
                            con.status === 'confirmed' 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400' 
                              : con.status === 'done' 
                              ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/30 dark:text-blue-400' 
                              : con.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400'
                              : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/30 dark:text-red-400'
                          }`}
                        >
                          <option value="pending">{t.status_pending}</option>
                          <option value="confirmed">{t.status_resolved}</option>
                          <option value="done">{t.status_done}</option>
                          <option value="cancelled">{t.status_cancelled}</option>
                        </select>
                      </div>

                      <div className="w-full h-[0.5px] bg-border/60" />

                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <span className="block text-text-muted font-semibold">{lang === 'de' ? 'Consulting Thema' : lang === 'en' ? 'Consultation Topic' : 'Sujet de consultation'}</span>
                          <span className="font-bold text-text-soft">{con.topic || 'General Info'}</span>
                        </div>
                        <div>
                          <span className="block text-text-muted font-semibold">{lang === 'de' ? 'Termin & Uhrzeit' : lang === 'en' ? 'Date & Time' : 'Date & Créneau'}</span>
                          <span className="font-bold text-text">
                            {con.preferred_date ? new Date(con.preferred_date).toLocaleDateString() : 'N/A'} • {con.preferred_time || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Contact Messages Column */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold font-display text-text">{t.col_messages}</h2>
                <span className="text-xs text-text-muted">{lang === 'de' ? 'Nachrichten aus dem Kontaktformular' : lang === 'en' ? 'Direct contact form messages' : 'Messages reçus via le formulaire de contact'}</span>
              </div>

              <div className="flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="bg-bg-card border border-border rounded-2xl p-8 text-center text-text-muted font-bold text-xs">{t.no_records}</div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`bg-bg-card border rounded-2xl p-5 shadow-sm flex flex-col gap-3 transition-colors ${
                      msg.read ? 'border-border opacity-75' : 'border-gold-400/40 shadow-gold-500/2 bg-gold-50/5 dark:bg-gold-950/2'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-text">{msg.name}</h3>
                            {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-ping shrink-0" />}
                          </div>
                          <p className="text-[10px] text-text-muted font-semibold mt-0.5">{msg.email} {msg.phone ? `• ${msg.phone}` : ''}</p>
                        </div>
                        <button 
                          onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                          className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors border ${
                            msg.read 
                              ? 'hover:bg-bg-alt text-text-soft border-border' 
                              : 'bg-gold-500 text-navy-950 border-transparent hover:bg-gold-600'
                          }`}
                        >
                          {msg.read ? t.mark_unread : t.mark_read}
                        </button>
                      </div>

                      <div className="w-full h-[0.5px] bg-border/60" />

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gold-600 dark:text-gold-400 font-bold uppercase tracking-wide">
                          {msg.subject || 'Message de Contact'}
                        </span>
                        <p className="text-xs text-text leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      
                      <div className="text-right text-[8px] text-text-muted font-mono">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ── EXAM MODAL (Create/Edit) ─────────────────────────────────── */}
      <AnimatePresence>
        {isExamModalOpen && editingExam && (
          <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-card border border-border w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative text-text"
            >
              <div className="german-flag-accent w-full" />
              
              <div className="p-6 md:p-8 flex flex-col gap-5">
                <h2 className="text-lg font-bold font-display text-text border-b border-border pb-3">
                  {editingExam.id ? t.edit_exam_title : t.create_exam_title}
                </h2>

                <form onSubmit={handleSaveExam} className="flex flex-col gap-4 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-text-muted">{t.exam_type}</label>
                      <select
                        value={editingExam.exam_type}
                        onChange={(e) => setEditingExam({ ...editingExam, exam_type: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400"
                        required
                      >
                        <option value="B1">B1 (Écrit + Oral)</option>
                        <option value="B2">B2 (Écrit + Oral)</option>
                        <option value="B1_oral">B1 Oral</option>
                        <option value="B1_written">B1 Écrit</option>
                        <option value="B2_oral">B2 Oral</option>
                        <option value="B2_written">B2 Écrit</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-text-muted">{t.exam_status}</label>
                      <select
                        value={editingExam.status}
                        onChange={(e) => setEditingExam({ ...editingExam, status: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400"
                        required
                      >
                        <option value="open">Open (Ouvert)</option>
                        <option value="full">Full (Complet)</option>
                        <option value="cancelled">Cancelled (Annulé)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-text-muted">{t.exam_date}</label>
                      <input 
                        type="date"
                        value={editingExam.exam_date}
                        onChange={(e) => setEditingExam({ ...editingExam, exam_date: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-text-muted">{t.exam_time}</label>
                      <input 
                        type="time"
                        value={editingExam.exam_time}
                        onChange={(e) => setEditingExam({ ...editingExam, exam_time: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-text-muted">{t.exam_deadline}</label>
                      <input 
                        type="date"
                        value={editingExam.registration_deadline}
                        onChange={(e) => setEditingExam({ ...editingExam, registration_deadline: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-text-muted">Places Max</label>
                      <input 
                        type="number"
                        min="1"
                        max="200"
                        value={editingExam.total_spots}
                        onChange={(e) => setEditingExam({ ...editingExam, total_spots: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-text-muted">{t.exam_price}</label>
                      <input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingExam.price_eur}
                        onChange={(e) => setEditingExam({ ...editingExam, price_eur: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-widest text-text-muted">{t.exam_location}</label>
                      <input 
                        type="text"
                        value={editingExam.location}
                        onChange={(e) => setEditingExam({ ...editingExam, location: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-text-muted">{t.exam_notes}</label>
                    <textarea 
                      value={editingExam.notes}
                      onChange={(e) => setEditingExam({ ...editingExam, notes: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-bg-alt border border-border text-text focus:outline-none focus:border-gold-400 h-20 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 border-t border-border pt-4 mt-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsExamModalOpen(false);
                        setEditingExam(null);
                      }}
                      className="px-5 py-2.5 border border-border hover:bg-bg-alt rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors"
                    >
                      {t.cancel}
                    </button>
                    <button 
                      type="submit" 
                      className="btn-gold-grad px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px]"
                    >
                      {t.save}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── REASSIGN MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isReassignModalOpen && reassigningReg && (
          <div className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-bg-card border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative text-text p-6 md:p-8"
            >
              <div className="german-flag-accent absolute top-0 left-0 right-0" />
              
              <h2 className="text-md font-bold font-display text-text border-b border-border pb-3 mb-4 mt-2">
                {t.reassign_modal_title}
              </h2>
              
              <p className="text-xs text-text-soft font-semibold mb-4 leading-normal">
                {lang === 'de' 
                  ? `Umbuchung für: ${reassigningReg.first_name} ${reassigningReg.last_name}` 
                  : lang === 'en' 
                  ? `Reassignment for: ${reassigningReg.first_name} ${reassigningReg.last_name}` 
                  : `Réaffectation de session pour : ${reassigningReg.first_name} ${reassigningReg.last_name}`}
              </p>

              <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {exams.filter(e => e.id !== reassigningReg.exam_date_id && e.status === 'open' && e.available_spots > 0).map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleReassign(e.id)}
                    className="w-full text-left p-3.5 rounded-xl border border-border bg-bg-alt/50 hover:bg-gold-500/10 hover:border-gold-400/40 text-xs font-semibold flex flex-col gap-1 transition-all"
                  >
                    <span className="font-extrabold text-gold-600 dark:text-gold-400">{e.exam_type} Exam</span>
                    <span className="text-text font-bold">{new Date(e.exam_date).toLocaleDateString()} at {e.exam_time.substring(0,5)}</span>
                    <span className="text-[10px] text-text-muted font-semibold mt-0.5">
                      {lang === 'de' ? `${e.available_spots} Plätze frei` : lang === 'en' ? `${e.available_spots} spots available` : `${e.available_spots} places disponibles`}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsReassignModalOpen(false);
                    setReassigningReg(null);
                  }}
                  className="px-5 py-2.5 border border-border hover:bg-bg-alt rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
