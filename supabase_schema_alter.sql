-- ============================================================
-- Sigma DI — Migration Script for Multi-language Support
-- Run this in your Supabase SQL Editor to add language columns
-- and seed translation data.
-- ============================================================

-- 1. Modify blog_posts table
alter table public.blog_posts 
  add column if not exists lang text not null default 'fr' check (lang in ('fr', 'en', 'de'));

-- 2. Modify faqs table
alter table public.faqs 
  add column if not exists lang text not null default 'fr' check (lang in ('fr', 'en', 'de'));

-- 3. Clear existing seed data to prevent unique constraints or duplication
truncate table public.blog_posts cascade;
truncate table public.faqs cascade;

-- 4. Seed Blog Posts in French, English, and German
insert into public.blog_posts (title, slug, summary, category, published, published_at, lang)
values
  -- French Blog Posts
  ('5 conseils pour réussir votre examen telc B1', '5-conseils-telc-b1-fr', 'Découvrez les stratégies essentielles pour aborder sereinement chaque épreuve de l''examen telc B1.', 'telc', true, now() - interval '5 days', 'fr'),
  ('Les erreurs les plus fréquentes en expression écrite', 'erreurs-expression-ecrite-fr', 'Orthographe, grammaire : voici les pièges à éviter absolument lors de votre examen.', 'conseils', true, now() - interval '12 days', 'fr'),
  ('Comment améliorer son allemand au quotidien', 'ameliorer-allemand-quotidien-fr', 'Des astuces simples et efficaces : podcasts, séries, applications et plus encore.', 'conseils', true, now() - interval '20 days', 'fr'),
  ('Préparer le B2 : tout ce que vous devez savoir', 'preparer-b2-guide-complet-fr', 'Structure de l''examen, durée des épreuves, barème et ressources recommandées.', 'examen', true, now() - interval '30 days', 'fr'),
  
  -- English Blog Posts
  ('5 tips to pass your telc B1 exam', '5-tips-telc-b1-en', 'Discover essential strategies to approach each section of the telc B1 exam with confidence.', 'telc', true, now() - interval '5 days', 'en'),
  ('Most common writing mistakes', 'common-writing-mistakes-en', 'Spelling, grammar: here are the traps you must avoid during your exam.', 'conseils', true, now() - interval '12 days', 'en'),
  ('How to improve your German daily', 'improve-german-daily-en', 'Simple and effective tips: podcasts, shows, apps, and more.', 'conseils', true, now() - interval '20 days', 'en'),
  ('Preparing for B2: everything you need to know', 'preparing-b2-complete-guide-en', 'Exam structure, section durations, scoring, and recommended resources.', 'examen', true, now() - interval '30 days', 'en'),

  -- German Blog Posts
  ('5 Tipps zum Bestehen Ihrer telc B1-Prüfung', '5-tipps-telc-b1-de', 'Entdecken Sie wichtige Strategien, um jeden Teil der telc B1-Prüfung selbstbewusst anzugehen.', 'telc', true, now() - interval '5 days', 'de'),
  ('Die häufigsten Fehler im schriftlichen Ausdruck', 'haeufige-schreibfehler-de', 'Rechtschreibung, Grammatik: Hier sind die Fallen, die Sie bei der Prüfung unbedingt vermeiden sollten.', 'conseils', true, now() - interval '12 days', 'de'),
  ('Wie Sie Ihr Deutsch täglich verbessern können', 'deutsch-taeglich-verbessern-de', 'Einfache und effektive Tipps: Podcasts, Serien, Apps und mehr.', 'conseils', true, now() - interval '20 days', 'de'),
  ('Vorbereitung auf B2: Alles, was Sie wissen müssen', 'vorbereitung-b2-leitfaden-de', 'Prüfungsstruktur, Dauer der Abschnitte, Bewertung und empfohlene Ressourcen.', 'examen', true, now() - interval '30 days', 'de');

-- 5. Seed FAQs in French, English, and German
insert into public.faqs (question, answer, category, display_order, active, lang)
values
  -- French FAQs
  ('Comment m''inscrire à un examen ?', 'Vous pouvez vous inscrire en ligne via notre formulaire d''inscription sur cette page, ou directement sur place pendant nos horaires d''ouverture.', 'inscription', 1, true, 'fr'),
  ('Quand recevrai-je mon certificat ?', 'En général, vous recevrez votre certificat telc 4 à 6 semaines après la date de l''examen.', 'certificat', 2, true, 'fr'),
  ('Puis-je repasser l''examen ?', 'Oui, en cas d''échec, vous pouvez vous réinscrire à la prochaine session disponible.', 'examen', 3, true, 'fr'),
  ('Quels documents dois-je apporter le jour de l''examen ?', 'Vous devez apporter une pièce d''identité valide (carte nationale ou passeport) et votre confirmation d''inscription.', 'examen', 4, true, 'fr'),
  ('Comment puis-je payer mon inscription ?', 'Le règlement s''effectue sur place en espèces ou par virement bancaire. Aucune pasarela de paiement en ligne n''est requise.', 'inscription', 5, true, 'fr'),
  ('Les certificats telc sont-ils reconnus internationalement ?', 'Oui, les certificats telc sont reconnus à l''international et acceptés pour les demandes de visa, de naturalisation et d''études.', 'general', 6, true, 'fr'),

  -- English FAQs
  ('How do I register for an exam?', 'You can register online using our registration form on this page, or directly on-site during our opening hours.', 'inscription', 1, true, 'en'),
  ('When will I receive my certificate?', 'Generally, you will receive your telc certificate 4 to 6 weeks after the exam date.', 'certificat', 2, true, 'en'),
  ('Can I retake the exam?', 'Yes, in case of failure, you can register for the next available session.', 'examen', 3, true, 'en'),
  ('What documents should I bring on exam day?', 'You must bring a valid ID (national ID card or passport) and your registration confirmation.', 'examen', 4, true, 'en'),
  ('How can I pay for my registration?', 'Payment is made on-site in cash or by bank transfer. No online payment gateway is required.', 'inscription', 5, true, 'en'),
  ('Are telc certificates internationally recognized?', 'Yes, telc certificates are recognized internationally and accepted for visa, naturalization, and study applications.', 'general', 6, true, 'en'),

  -- German FAQs
  ('Wie melde ich mich für eine Prüfung an?', 'Sie können sich online über unser Anmeldeformular auf dieser Seite oder direkt vor Ort während unserer Öffnungszeiten anmelden.', 'inscription', 1, true, 'de'),
  ('Wann erhalte ich mein Zertifikat?', 'In der Regel erhalten Sie Ihr telc-Zertifikat 4 bis 6 Wochen nach dem Prüfungstermin.', 'certificat', 2, true, 'de'),
  ('Kann ich die Prüfung wiederholen?', 'Ja, im Falle des Nichtbestehens können Sie sich für den nächsten verfügbaren Termin anmelden.', 'examen', 3, true, 'de'),
  ('Welche Dokumente muss ich am Prüfungstag mitbringen?', 'Sie müssen einen gültigen Personalausweis oder Reisepass und Ihre Anmeldebestätigung mitbringen.', 'examen', 4, true, 'de'),
  ('Wie kann ich meine Anmeldung bezahlen?', 'Die Zahlung erfolgt vor Ort in bar oder per Banküberweisung. Es ist kein Online-Zahlungsgateway erforderlich.', 'inscription', 5, true, 'de'),
  ('Sind telc-Zertifikate international anerkannt?', 'Ja, telc-Zertifikate sind international anerkannt und werden für Visums-, Einbürgerungs- und Studienanträge akzeptiert.', 'general', 6, true, 'de');
