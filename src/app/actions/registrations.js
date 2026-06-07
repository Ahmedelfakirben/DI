"use server";

import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Privileged Supabase client to bypass RLS when inserting registrations or sending emails
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceKey) {
    return createClient(url, serviceKey, {
      auth: {
        persistSession: false
      }
    });
  }
  return supabase;
}

// Localized email templates and copy
const emailContent = {
  fr: {
    subject: "Confirmation de pré-inscription — Sigma Deutsch Institut",
    title: "Pré-inscription Reçue",
    greeting: "Bonjour",
    intro: "Merci de vous être préinscrit à notre examen telc. Votre demande est en cours de traitement, en attente de la validation de votre paiement.",
    exam_details: "Détails de l'Examen",
    exam_type: "Type d'examen",
    exam_date: "Date",
    exam_time: "Heure",
    price: "Tarif",
    payment_method: "Mode de paiement",
    payment_cash: "Paiement en espèces sur place",
    payment_transfer: "Virement bancaire",
    instructions_cash: "Merci de vous présenter dans nos locaux dans un délai de <strong>3 jours ouvrables</strong> pour régler les frais d'examen et valider définitivement votre place.",
    instructions_transfer: "Merci d'effectuer le virement bancaire sur notre compte ci-dessous sous <strong>48 heures</strong> et de nous envoyer le reçu par email ou WhatsApp :<br/><br/><strong>Banque :</strong> BMCE Bank<br/><strong>Titulaire :</strong> Sigma Deutsch Institut<br/><strong>RIB :</strong> 011 780 0000099999999999 99<br/><strong>Référence :</strong> Votre Nom + Examen telc",
    closing: "Si vous avez des questions, n'hésitez pas à contacter notre secrétariat.",
    footer: "L'équipe du Sigma Deutsch Institut<br/>Casablanca, Maroc"
  },
  en: {
    subject: "Pre-registration Confirmation — Sigma Deutsch Institut",
    title: "Pre-registration Received",
    greeting: "Hello",
    intro: "Thank you for pre-registering for our telc exam. Your request is being processed, pending validation of your payment.",
    exam_details: "Exam Details",
    exam_type: "Exam Type",
    exam_date: "Date",
    exam_time: "Time",
    price: "Price",
    payment_method: "Payment Method",
    payment_cash: "Cash payment on site",
    payment_transfer: "Bank Transfer",
    instructions_cash: "Please visit our center within <strong>3 working days</strong> to settle the exam fees and definitively secure your seat.",
    instructions_transfer: "Please complete the bank transfer to the account below within <strong>48 hours</strong> and send us the receipt by email or WhatsApp:<br/><br/><strong>Bank:</strong> BMCE Bank<br/><strong>Account Owner:</strong> Sigma Deutsch Institut<br/><strong>RIB:</strong> 011 780 0000099999999999 99<br/><strong>Reference:</strong> Your Name + telc Exam",
    closing: "If you have any questions, please do not hesitate to contact our office.",
    footer: "The Sigma Deutsch Institut Team<br/>Casablanca, Morocco"
  },
  de: {
    subject: "Voranmeldung Bestätigung — Sigma Deutsch Institut",
    title: "Voranmeldung eingegangen",
    greeting: "Hallo",
    intro: "Vielen Dank für Ihre Voranmeldung zu unserer telc-Prüfung. Ihre Anmeldung wird derzeit bearbeitet, bis Ihre Zahlung bestätigt ist.",
    exam_details: "Prüfungsdetails",
    exam_type: "Prüfungstyp",
    exam_date: "Datum",
    exam_time: "Uhrzeit",
    price: "Preis",
    payment_method: "Zahlungsmethode",
    payment_cash: "Barzahlung vor Ort",
    payment_transfer: "Banküberweisung",
    instructions_cash: "Bitte kommen Sie innerhalb von <strong>3 Werktagen</strong> in unser Prüfungszentrum, um die Prüfungsgebühren zu entrichten und Ihren Platz endgültig zu sichern.",
    instructions_transfer: "Bitte führen Sie die Banküberweisung innerhalb von <strong>48 Stunden</strong> auf das unten angegebene Konto durch und senden Sie uns den Beleg per E-Mail oder WhatsApp:<br/><br/><strong>Bank:</strong> BMCE Bank<br/><strong>Kontoinhaber:</strong> Sigma Deutsch Institut<br/><strong>RIB:</strong> 011 780 0000099999999999 99<br/><strong>Verwendungszweck:</strong> Ihr Name + telc Prüfung",
    closing: "Bei Fragen steht Ihnen unser Sekretariat gerne zur Verfügung.",
    footer: "Ihr Sigma Deutsch Institut Team<br/>Casablanca, Marokko"
  }
};

// Formats date nicely for email
function formatEmailDate(dateStr, lang) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
  return d.toLocaleDateString(locales[lang] || 'fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Generate premium HTML Email template
function getHtmlEmailTemplate(regData, exam, langCopy, lang) {
  const isTransfer = regData.payment_method === 'transfer';
  const paymentMethodLabel = isTransfer ? langCopy.payment_transfer : langCopy.payment_cash;
  const paymentInstructions = isTransfer ? langCopy.instructions_transfer : langCopy.instructions_cash;
  
  const examTypeFormatted = exam ? exam.exam_type.replace('_', ' ') : 'telc';
  const examDateFormatted = exam ? formatEmailDate(exam.exam_date, lang) : '—';
  const examTimeFormatted = exam ? exam.exam_time.substring(0, 5) : '—';
  const examPriceFormatted = exam ? `${exam.price_eur} DH` : '—';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${langCopy.subject}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f6fb;
            color: #060d1f;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(13, 27, 62, 0.03);
            border: 1px solid rgba(13, 27, 62, 0.05);
          }
          .header {
            background-color: #060d1f;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 3px solid #c9a227;
          }
          .logo {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #ffffff;
            margin: 0;
            text-transform: uppercase;
          }
          .logo-sub {
            font-size: 10px;
            color: #c9a227;
            letter-spacing: 3px;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 5px;
            display: block;
          }
          .body {
            padding: 40px 30px;
          }
          h2 {
            font-size: 22px;
            font-weight: 800;
            color: #0d1b3e;
            margin-top: 0;
            margin-bottom: 20px;
          }
          p {
            font-size: 15px;
            line-height: 1.6;
            color: #273d85;
            margin-bottom: 25px;
          }
          .table-container {
            border: 1px solid rgba(13, 27, 62, 0.08);
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 14px 18px;
            text-align: left;
            font-size: 14px;
          }
          th {
            background-color: #f9fbfd;
            font-weight: 700;
            color: #0d1b3e;
            border-bottom: 1px solid rgba(13, 27, 62, 0.08);
          }
          td {
            border-bottom: 1px solid rgba(13, 27, 62, 0.05);
            color: #273d85;
          }
          tr:last-child td {
            border-bottom: none;
          }
          .instructions-box {
            background-color: #faf7ee;
            border-left: 4px solid #c9a227;
            border-radius: 0 16px 16px 0;
            padding: 20px;
            font-size: 14px;
            line-height: 1.6;
            color: #8a6c0a;
            margin-bottom: 30px;
          }
          .footer {
            background-color: #f4f6fb;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid rgba(13, 27, 62, 0.05);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Sigma DI</div>
            <span class="logo-sub">Deutsch Institut</span>
          </div>
          <div class="body">
            <h2>${langCopy.title}</h2>
            <p>${langCopy.greeting} <strong>${regData.first_name} ${regData.last_name}</strong>,</p>
            <p>${langCopy.intro}</p>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th colspan="2">${langCopy.exam_details}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="width: 40%; font-weight: 600;">${langCopy.exam_type}</td>
                    <td>telc ${examTypeFormatted}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600;">${langCopy.exam_date}</td>
                    <td>${examDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600;">${langCopy.exam_time}</td>
                    <td>${examTimeFormatted}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600;">${langCopy.price}</td>
                    <td style="font-weight: bold; color: #b8920f;">${examPriceFormatted}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600;">${langCopy.payment_method}</td>
                    <td>${paymentMethodLabel}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="instructions-box">
              ${paymentInstructions}
            </div>

            <p>${langCopy.closing}</p>
            <p style="margin-bottom: 0;">
              ${langCopy.footer}
            </p>
          </div>
          <div class="footer">
            &copy; 2026 Sigma Deutsch Institut. Tous droits réservés.
          </div>
        </div>
      </body>
    </html>
  `;
}

// Nodemailer SMTP Transporter
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.office365.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("SMTP credentials (SMTP_USER, SMTP_PASS) are missing in environment variables. Email dispatcher is disabled.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false, // TLS (587) requires secure to be false
    auth: { user, pass },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });
}

/**
 * Server Action: Registers a student and sends a confirmation email.
 */
export async function registerStudentAction(formData, lang) {
  const copy = emailContent[lang] || emailContent.fr;
  const isDemo = !formData.exam_date_id || String(formData.exam_date_id).startsWith('demo-');
  
  let insertedRegistration = null;
  let examDetails = null;

  try {
    // 1. Insert registration in database or mock it if Demo
    if (!isDemo) {
      const db = getServiceSupabase();
      const { data, error } = await db
        .from('registrations')
        .insert([{
          exam_date_id: formData.exam_date_id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp || null,
          nationality: formData.nationality || null,
          payment_method: formData.payment_method,
          payment_status: 'pending',
          notes: ''
        }])
        .select()
        .single();

      if (error) throw error;
      insertedRegistration = data;

      // Fetch official exam details
      const { data: examData, error: examErr } = await db
        .from('exam_dates')
        .select('*')
        .eq('id', formData.exam_date_id)
        .single();
      
      if (examErr) throw examErr;
      examDetails = examData;
    } else {
      // Mock details for testing in Demo mode
      insertedRegistration = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        payment_method: formData.payment_method
      };
      
      // Mock exam data based on standard dates
      examDetails = {
        exam_type: 'B1',
        exam_date: '2026-07-12',
        exam_time: '09:00:00',
        price_eur: 180
      };
    }

    // 2. Dispatch Confirmation Email
    const transporter = getTransporter();
    if (transporter) {
      const emailHtml = getHtmlEmailTemplate(insertedRegistration, examDetails, copy, lang);
      
      await transporter.sendMail({
        from: `"${copy.title}" <${process.env.SMTP_USER}>`,
        to: insertedRegistration.email,
        subject: copy.subject,
        html: emailHtml
      });
      
      console.log(`Successfully sent pre-registration confirmation email to ${insertedRegistration.email}`);
      return { success: true, emailSent: true };
    } else {
      console.log('Pre-registration inserted successfully, but confirmation email was skipped (SMTP config missing/disabled).');
      return { success: true, emailSent: false, warning: 'SMTP credentials missing' };
    }
  } catch (error) {
    console.error("Error in registerStudentAction:", error);
    // If the error occurred after saving to database (email failed), we still return success to the client
    if (insertedRegistration && !isDemo) {
      return { 
        success: true, 
        emailSent: false, 
        warning: `Database entry saved, but confirmation email failed to send: ${error.message}` 
      };
    }
    return { success: false, error: error.message };
  }
}
