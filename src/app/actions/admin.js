"use server";

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Check if we are running in Demo Mode (when keys are missing)
const isDemoMode = !process.env.SUPABASE_SERVICE_ROLE_KEY;

// ── In-Memory Database for Demo Mode ─────────────────────────────────
// These mock tables persist in-memory on the server during the dev server runtime.

let demoExams = [
  { id: 'demo-1', exam_type: 'B1', exam_date: '2026-07-12', exam_time: '09:00:00', registration_deadline: '2026-07-05', total_spots: 20, available_spots: 14, price_eur: 180, location: 'Sigma Deutsch Institut', notes: 'Examen complet écrit + oral', status: 'open' },
  { id: 'demo-2', exam_type: 'B2', exam_date: '2026-07-19', exam_time: '09:00:00', registration_deadline: '2026-07-12', total_spots: 20, available_spots: 8, price_eur: 220, location: 'Sigma Deutsch Institut', notes: 'Dernières places disponibles', status: 'open' },
  { id: 'demo-3', exam_type: 'B1_oral', exam_date: '2026-07-26', exam_time: '10:00:00', registration_deadline: '2026-07-19', total_spots: 10, available_spots: 10, price_eur: 80, location: 'Sigma Deutsch Institut', notes: 'Oral uniquement', status: 'open' },
  { id: 'demo-4', exam_type: 'B1_written', exam_date: '2026-07-26', exam_time: '09:00:00', registration_deadline: '2026-07-19', total_spots: 15, available_spots: 15, price_eur: 120, location: 'Sigma Deutsch Institut', notes: 'Écrit uniquement', status: 'open' }
];

let demoRegistrations = [
  { id: 'reg-1', exam_date_id: 'demo-1', first_name: 'Amine', last_name: 'El Idrissi', email: 'amine@example.com', phone: '+212 612 345678', whatsapp: '+212 612 345678', nationality: 'Marocaine', payment_method: 'on_site', payment_status: 'confirmed', notes: 'Règlement effectué sur place en espèces.', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'reg-2', exam_date_id: 'demo-1', first_name: 'Sarah', last_name: 'Martin', email: 'sarah@example.com', phone: '+33 612 345678', whatsapp: '', nationality: 'Française', payment_method: 'transfer', payment_status: 'pending', notes: 'En attente de réception du virement bancaire.', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'reg-3', exam_date_id: 'demo-2', first_name: 'Youssef', last_name: 'Naciri', email: 'youssef@example.com', phone: '+212 699 887766', whatsapp: '+212 699 887766', nationality: 'Marocaine', payment_method: 'on_site', payment_status: 'confirmed', notes: '', created_at: new Date(Date.now() - 172800000).toISOString() },
];

let demoConsultations = [
  { id: 'con-1', first_name: 'Fatima', last_name: 'Zahra', email: 'fatima@example.com', phone: '+212 655 443322', preferred_date: '2026-06-10', preferred_time: '10:00 - 11:00', topic: 'telc B1 Exam', status: 'pending', created_at: new Date().toISOString() },
  { id: 'con-2', first_name: 'Mehdi', last_name: 'Alaoui', email: 'mehdi@example.com', phone: '+212 611 223344', preferred_date: '2026-06-12', preferred_time: '15:00 - 16:00', topic: 'Preparation Course', status: 'confirmed', created_at: new Date(Date.now() - 7200000).toISOString() }
];

let demoMessages = [
  { id: 'msg-1', name: 'Karim Bensalah', email: 'karim@example.com', phone: '+212 677 665544', subject: 'Horaires des cours B2', message: 'Bonjour, proposez-vous des cours de préparation B2 en soirée ? Merci d\'avance.', read: false, created_at: new Date().toISOString() },
  { id: 'msg-2', name: 'Lina Rossi', email: 'lina@example.com', phone: '', subject: 'Inscription telc B1', message: 'Je voudrais savoir s\'il reste des places pour la session du 12 Juillet. Cordialement.', read: true, created_at: new Date(Date.now() - 43200000).toISOString() }
];

// Helper to initialize privileged Supabase client on the server
function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  });
}

// ── Authentication Actions ───────────────────────────────────────────

export async function verifyAdminUser(email, password) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    const cookieStore = await cookies();
    cookieStore.set('sigma_admin_session', 'authenticated_session_2026', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/'
    });
    return { success: true };
  } catch (err) {
    console.error("verifyAdminUser error:", err);
    return { success: false, error: err.message || 'Authentication error' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('sigma_admin_session');
  return { success: true };
}

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('sigma_admin_session')?.value;
  return session === 'authenticated_session_2026';
}

async function requireAuth() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) {
    throw new Error("Unauthorized access. Admin login required.");
  }
}

// ── Dashboard Analytics & Stats ──────────────────────────────────────

export async function getDashboardStats() {
  await requireAuth();

  if (isDemoMode) {
    let totalEarnings = 0;
    let totalRegistrations = 0;
    let pendingRegistrations = 0;

    demoRegistrations.forEach(r => {
      if (r.payment_status === 'confirmed') {
        const exam = demoExams.find(e => e.id === r.exam_date_id);
        totalEarnings += Number(exam?.price_eur || 0);
      }
      if (r.payment_status === 'pending') {
        pendingRegistrations++;
      }
      if (r.payment_status !== 'cancelled') {
        totalRegistrations++;
      }
    });

    const activeExams = demoExams.filter(e => e.status !== 'cancelled').length;
    const pendingConsultations = demoConsultations.filter(c => c.status === 'pending').length;
    const unreadMessages = demoMessages.filter(m => !m.read).length;

    const recentRegs = demoRegistrations.slice(0, 5).map(r => ({
      first_name: r.first_name,
      last_name: r.last_name,
      payment_status: r.payment_status,
      created_at: r.created_at,
      exam_dates: demoExams.find(e => e.id === r.exam_date_id) || null
    }));

    return {
      success: true,
      demoMode: true,
      stats: {
        totalEarnings,
        totalRegistrations,
        pendingRegistrations,
        activeExams,
        pendingConsultations,
        unreadMessages,
        totalInquiries: pendingConsultations + unreadMessages
      },
      recentRegs
    };
  }

  const supabase = getAdminSupabase();
  try {
    const { data: regs, error: regsErr } = await supabase
      .from('registrations')
      .select('payment_status, exam_dates(price_eur)');

    if (regsErr) throw regsErr;

    let totalEarnings = 0;
    let totalRegistrations = 0;
    let pendingRegistrations = 0;

    if (regs) {
      regs.forEach(r => {
        if (r.payment_status === 'confirmed') {
          totalEarnings += Number(r.exam_dates?.price_eur || 0);
        }
        if (r.payment_status === 'pending') {
          pendingRegistrations++;
        }
        if (r.payment_status !== 'cancelled') {
          totalRegistrations++;
        }
      });
    }

    const { count: activeExams, error: examsErr } = await supabase
      .from('exam_dates')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'cancelled');

    if (examsErr) throw examsErr;

    const { count: pendingConsultations, error: consErr } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (consErr) throw consErr;

    const { count: unreadMessages, error: msgErr } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);

    if (msgErr) throw msgErr;

    const { data: recentRegs } = await supabase
      .from('registrations')
      .select('first_name, last_name, payment_status, created_at, exam_dates(exam_type, exam_date)')
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      success: true,
      demoMode: false,
      stats: {
        totalEarnings,
        totalRegistrations,
        pendingRegistrations,
        activeExams: activeExams || 0,
        pendingConsultations: pendingConsultations || 0,
        unreadMessages: unreadMessages || 0,
        totalInquiries: (pendingConsultations || 0) + (unreadMessages || 0)
      },
      recentRegs: recentRegs || []
    };
  } catch (e) {
    console.error("Dashboard stats fetch failed:", e);
    return { success: false, error: e.message };
  }
}

// ── Exam Dates CRUD Actions ──────────────────────────────────────────

export async function getExamsList() {
  await requireAuth();

  if (isDemoMode) {
    return { success: true, exams: [...demoExams] };
  }

  const supabase = getAdminSupabase();
  try {
    const { data, error } = await supabase
      .from('exam_dates')
      .select('*')
      .order('exam_date', { ascending: true });

    if (error) throw error;
    return { success: true, exams: data || [] };
  } catch (e) {
    console.error("Exams fetch failed:", e);
    return { success: false, error: e.message };
  }
}

export async function saveExamSession(examData) {
  await requireAuth();

  if (isDemoMode) {
    const payload = {
      id: examData.id || `demo-${Date.now()}`,
      exam_type: examData.exam_type,
      exam_date: examData.exam_date,
      exam_time: examData.exam_time,
      registration_deadline: examData.registration_deadline,
      total_spots: parseInt(examData.total_spots, 10),
      price_eur: parseFloat(examData.price_eur),
      location: examData.location || 'Sigma Deutsch Institut',
      notes: examData.notes || '',
      status: examData.status || 'open'
    };

    if (examData.id) {
      const idx = demoExams.findIndex(e => e.id === examData.id);
      if (idx !== -1) {
        const spotsDiff = payload.total_spots - demoExams[idx].total_spots;
        payload.available_spots = Math.max(0, demoExams[idx].available_spots + spotsDiff);
        demoExams[idx] = payload;
      }
    } else {
      payload.available_spots = payload.total_spots;
      demoExams.push(payload);
    }
    return { success: true, exam: payload };
  }

  const supabase = getAdminSupabase();
  try {
    const payload = {
      exam_type: examData.exam_type,
      exam_date: examData.exam_date,
      exam_time: examData.exam_time,
      registration_deadline: examData.registration_deadline,
      total_spots: parseInt(examData.total_spots, 10),
      price_eur: parseFloat(examData.price_eur),
      location: examData.location || 'Sigma Deutsch Institut',
      notes: examData.notes || '',
      status: examData.status || 'open'
    };

    if (examData.id) {
      const { data: currentExam } = await supabase
        .from('exam_dates')
        .select('total_spots, available_spots')
        .eq('id', examData.id)
        .single();

      if (currentExam) {
        const spotsDiff = payload.total_spots - currentExam.total_spots;
        payload.available_spots = Math.max(0, currentExam.available_spots + spotsDiff);
      }

      const { data, error } = await supabase
        .from('exam_dates')
        .update(payload)
        .eq('id', examData.id)
        .select();

      if (error) throw error;
      return { success: true, exam: data[0] };
    } else {
      payload.available_spots = payload.total_spots;
      const { data, error } = await supabase
        .from('exam_dates')
        .insert(payload)
        .select();

      if (error) throw error;
      return { success: true, exam: data[0] };
    }
  } catch (e) {
    console.error("Exam save failed:", e);
    return { success: false, error: e.message };
  }
}

export async function deleteExamSession(id) {
  await requireAuth();

  if (isDemoMode) {
    const activeRegs = demoRegistrations.filter(r => r.exam_date_id === id && r.payment_status !== 'cancelled');
    if (activeRegs.length > 0) {
      const idx = demoExams.findIndex(e => e.id === id);
      if (idx !== -1) demoExams[idx].status = 'cancelled';
      return { success: true, status: 'cancelled_due_to_regs' };
    }
    demoExams = demoExams.filter(e => e.id !== id);
    return { success: true, status: 'deleted' };
  }

  const supabase = getAdminSupabase();
  try {
    const { data: activeRegs } = await supabase
      .from('registrations')
      .select('id')
      .eq('exam_date_id', id)
      .neq('payment_status', 'cancelled')
      .limit(1);

    if (activeRegs && activeRegs.length > 0) {
      const { error } = await supabase
        .from('exam_dates')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      return { success: true, status: 'cancelled_due_to_regs' };
    }

    const { error } = await supabase
      .from('exam_dates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, status: 'deleted' };
  } catch (e) {
    console.error("Exam delete failed:", e);
    return { success: false, error: e.message };
  }
}

// ── Registrations CRUD Actions ───────────────────────────────────────

export async function getRegistrationsList() {
  await requireAuth();

  if (isDemoMode) {
    const list = demoRegistrations.map(r => ({
      ...r,
      exam_dates: demoExams.find(e => e.id === r.exam_date_id) || null
    })).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    return { success: true, registrations: list };
  }

  const supabase = getAdminSupabase();
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, exam_dates(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, registrations: data || [] };
  } catch (e) {
    console.error("Registrations fetch failed:", e);
    return { success: false, error: e.message };
  }
}

export async function updateRegistrationStatus(id, payment_status, notes) {
  await requireAuth();

  if (isDemoMode) {
    const idx = demoRegistrations.findIndex(r => r.id === id);
    if (idx !== -1) {
      const reg = demoRegistrations[idx];
      const examIdx = demoExams.findIndex(e => e.id === reg.exam_date_id);
      
      if (examIdx !== -1) {
        const oldStatus = reg.payment_status;
        if (oldStatus !== 'cancelled' && payment_status === 'cancelled') {
          // Restore spot
          demoExams[examIdx].available_spots = Math.min(demoExams[examIdx].available_spots + 1, demoExams[examIdx].total_spots);
          if (demoExams[examIdx].status === 'full') demoExams[examIdx].status = 'open';
        } else if (oldStatus === 'cancelled' && payment_status !== 'cancelled') {
          // Consume spot
          demoExams[examIdx].available_spots = Math.max(demoExams[examIdx].available_spots - 1, 0);
          if (demoExams[examIdx].available_spots === 0) demoExams[examIdx].status = 'full';
        }
      }

      demoRegistrations[idx].payment_status = payment_status;
      demoRegistrations[idx].notes = notes;
      return { success: true, registration: demoRegistrations[idx] };
    }
    return { success: false, error: 'Registration not found' };
  }

  const supabase = getAdminSupabase();
  try {
    const { data, error } = await supabase
      .from('registrations')
      .update({ payment_status, notes })
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, registration: data[0] };
  } catch (e) {
    console.error("Registration update failed:", e);
    return { success: false, error: e.message };
  }
}

export async function reassignRegistrationExam(id, new_exam_date_id) {
  await requireAuth();

  if (isDemoMode) {
    const idx = demoRegistrations.findIndex(r => r.id === id);
    if (idx !== -1) {
      const reg = demoRegistrations[idx];
      if (reg.exam_date_id !== new_exam_date_id) {
        const oldExamIdx = demoExams.findIndex(e => e.id === reg.exam_date_id);
        const newExamIdx = demoExams.findIndex(e => e.id === new_exam_date_id);
        
        if (newExamIdx !== -1 && demoExams[newExamIdx].status !== 'cancelled') {
          if (reg.payment_status !== 'cancelled') {
            // Re-allocate spots in demo mode
            if (oldExamIdx !== -1) {
              demoExams[oldExamIdx].available_spots = Math.min(demoExams[oldExamIdx].available_spots + 1, demoExams[oldExamIdx].total_spots);
              if (demoExams[oldExamIdx].status === 'full') demoExams[oldExamIdx].status = 'open';
            }
            demoExams[newExamIdx].available_spots = Math.max(demoExams[newExamIdx].available_spots - 1, 0);
            if (demoExams[newExamIdx].available_spots === 0) demoExams[newExamIdx].status = 'full';
          }
          demoRegistrations[idx].exam_date_id = new_exam_date_id;
          return { success: true, registration: demoRegistrations[idx] };
        }
      }
    }
    return { success: false, error: 'Reassignment failed' };
  }

  const supabase = getAdminSupabase();
  try {
    const { data: reg, error: fetchErr } = await supabase
      .from('registrations')
      .select('exam_date_id, payment_status')
      .eq('id', id)
      .single();

    if (fetchErr || !reg) throw new Error("Registration not found.");

    if (reg.exam_date_id !== new_exam_date_id) {
      const { data: newExam } = await supabase
        .from('exam_dates')
        .select('available_spots, status')
        .eq('id', new_exam_date_id)
        .single();

      if (!newExam || newExam.status === 'cancelled') {
        throw new Error("Target exam session is cancelled or not found.");
      }
      if (newExam.available_spots <= 0 && reg.payment_status !== 'cancelled') {
        throw new Error("Target exam session has no spots available.");
      }

      if (reg.payment_status !== 'cancelled') {
        const { data: oldExam } = await supabase
          .from('exam_dates')
          .select('available_spots, total_spots')
          .eq('id', reg.exam_date_id)
          .single();

        if (oldExam) {
          await supabase
            .from('exam_dates')
            .update({ available_spots: Math.min(oldExam.available_spots + 1, oldExam.total_spots) })
            .eq('id', reg.exam_date_id);
        }

        await supabase
          .from('exam_dates')
          .update({ available_spots: Math.max(newExam.available_spots - 1, 0) })
          .eq('id', new_exam_date_id);
      }

      const { data, error } = await supabase
        .from('registrations')
        .update({ exam_date_id: new_exam_date_id })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, registration: data[0] };
    }
    return { success: true };
  } catch (e) {
    console.error("Reassignment failed:", e);
    return { success: false, error: e.message };
  }
}

export async function deleteRegistration(id) {
  await requireAuth();

  if (isDemoMode) {
    const idx = demoRegistrations.findIndex(r => r.id === id);
    if (idx !== -1) {
      const reg = demoRegistrations[idx];
      if (reg.payment_status !== 'cancelled') {
        const examIdx = demoExams.findIndex(e => e.id === reg.exam_date_id);
        if (examIdx !== -1) {
          demoExams[examIdx].available_spots = Math.min(demoExams[examIdx].available_spots + 1, demoExams[examIdx].total_spots);
          if (demoExams[examIdx].status === 'full') demoExams[examIdx].status = 'open';
        }
      }
      demoRegistrations = demoRegistrations.filter(r => r.id !== id);
      return { success: true };
    }
    return { success: false, error: 'Registration not found' };
  }

  const supabase = getAdminSupabase();
  try {
    const { data: reg } = await supabase
      .from('registrations')
      .select('exam_date_id, payment_status')
      .eq('id', id)
      .single();

    if (reg && reg.payment_status !== 'cancelled') {
      const { data: exam } = await supabase
        .from('exam_dates')
        .select('available_spots, total_spots')
        .eq('id', reg.exam_date_id)
        .single();

      if (exam) {
        await supabase
          .from('exam_dates')
          .update({ 
            available_spots: Math.min(exam.available_spots + 1, exam.total_spots),
            status: exam.status === 'full' ? 'open' : exam.status
          })
          .eq('id', reg.exam_date_id);
      }
    }

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (e) {
    console.error("Registration deletion failed:", e);
    return { success: false, error: e.message };
  }
}

// ── Consultations Actions ────────────────────────────────────────────

export async function getConsultationsList() {
  await requireAuth();

  if (isDemoMode) {
    return { success: true, consultations: [...demoConsultations] };
  }

  const supabase = getAdminSupabase();
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, consultations: data || [] };
  } catch (e) {
    console.error("Consultations fetch failed:", e);
    return { success: false, error: e.message };
  }
}

export async function updateConsultationStatus(id, status) {
  await requireAuth();

  if (isDemoMode) {
    const idx = demoConsultations.findIndex(c => c.id === id);
    if (idx !== -1) {
      demoConsultations[idx].status = status;
      return { success: true, consultation: demoConsultations[idx] };
    }
    return { success: false, error: 'Consultation not found' };
  }

  const supabase = getAdminSupabase();
  try {
    const { data, error } = await supabase
      .from('consultations')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, consultation: data[0] };
  } catch (e) {
    console.error("Consultation update failed:", e);
    return { success: false, error: e.message };
  }
}

// ── Contact Messages Actions ──────────────────────────────────────────

export async function getContactMessages() {
  await requireAuth();

  if (isDemoMode) {
    return { success: true, messages: [...demoMessages] };
  }

  const supabase = getAdminSupabase();
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, messages: data || [] };
  } catch (e) {
    console.error("Messages fetch failed:", e);
    return { success: false, error: e.message };
  }
}

export async function markContactMessageRead(id, read) {
  await requireAuth();

  if (isDemoMode) {
    const idx = demoMessages.findIndex(m => m.id === id);
    if (idx !== -1) {
      demoMessages[idx].read = read;
      return { success: true, message: demoMessages[idx] };
    }
    return { success: false, error: 'Message not found' };
  }

  const supabase = getAdminSupabase();
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ read })
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, message: data[0] };
  } catch (e) {
    console.error("Message update failed:", e);
    return { success: false, error: e.message };
  }
}
