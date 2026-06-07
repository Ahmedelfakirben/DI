-- ============================================================
-- Sigma DI — Académie de Langue Allemande (telc)
-- Supabase Schema : Tables, RLS Policies, Triggers, Seed Data
-- ============================================================
-- Run this entire script in the Supabase SQL Editor once.
-- ============================================================

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. TABLES
-- ============================================================

-- 1.1 exam_dates
create table if not exists public.exam_dates (
  id                    uuid primary key default uuid_generate_v4(),
  exam_type             text not null check (exam_type in ('B1','B2','B1_oral','B1_written','B2_oral','B2_written')),
  exam_date             date not null,
  exam_time             time not null,
  registration_deadline date not null,
  total_spots           integer not null default 20,
  available_spots       integer not null default 20,
  price_eur             numeric(8,2) not null default 0,
  location              text not null default 'Sigma Deutsch Institut',
  notes                 text,
  status                text not null default 'open' check (status in ('open','full','cancelled')),
  created_at            timestamptz not null default now()
);

-- 1.2 registrations
create table if not exists public.registrations (
  id              uuid primary key default uuid_generate_v4(),
  exam_date_id    uuid not null references public.exam_dates(id) on delete restrict,
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text not null,
  whatsapp        text,
  nationality     text,
  payment_method  text not null default 'on_site' check (payment_method in ('transfer','on_site')),
  payment_status  text not null default 'pending' check (payment_status in ('pending','confirmed','cancelled')),
  notes           text,
  created_at      timestamptz not null default now()
);

-- 1.3 consultations
create table if not exists public.consultations (
  id              uuid primary key default uuid_generate_v4(),
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text not null,
  preferred_date  date,
  preferred_time  text,
  topic           text,
  status          text not null default 'pending' check (status in ('pending','confirmed','done','cancelled')),
  created_at      timestamptz not null default now()
);

-- 1.4 contact_messages
create table if not exists public.contact_messages (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  subject     text,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 1.5 blog_posts
create table if not exists public.blog_posts (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  summary         text not null,
  content         text,
  category        text not null default 'general' check (category in ('telc','conseils','integration','examen','general')),
  cover_image_url text,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now()
);

-- 1.6 faqs
create table if not exists public.faqs (
  id            uuid primary key default uuid_generate_v4(),
  question      text not null,
  answer        text not null,
  category      text not null default 'general' check (category in ('inscription','certificat','examen','general')),
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- 2. TRIGGERS — Gestion automatique des places disponibles
-- ============================================================

-- 2.1 Decrement available_spots when a registration is inserted
create or replace function public.decrement_available_spots()
returns trigger language plpgsql as $$
begin
  update public.exam_dates
  set
    available_spots = greatest(available_spots - 1, 0),
    status = case when available_spots - 1 <= 0 then 'full' else status end
  where id = NEW.exam_date_id;
  return NEW;
end;
$$;

drop trigger if exists trg_decrement_spots on public.registrations;
create trigger trg_decrement_spots
  after insert on public.registrations
  for each row execute function public.decrement_available_spots();

-- 2.2 Restore available_spots when a registration is cancelled
create or replace function public.restore_available_spots()
returns trigger language plpgsql as $$
begin
  if OLD.payment_status <> 'cancelled' and NEW.payment_status = 'cancelled' then
    update public.exam_dates
    set
      available_spots = least(available_spots + 1, total_spots),
      status = case when status = 'full' then 'open' else status end
    where id = NEW.exam_date_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_restore_spots on public.registrations;
create trigger trg_restore_spots
  after update on public.registrations
  for each row execute function public.restore_available_spots();

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.exam_dates       enable row level security;
alter table public.registrations    enable row level security;
alter table public.consultations    enable row level security;
alter table public.contact_messages enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.faqs             enable row level security;

-- exam_dates : public read, admin write
create policy "exam_dates_public_select"
  on public.exam_dates for select
  using (true);

-- registrations : anonymous insert only
create policy "registrations_anon_insert"
  on public.registrations for insert
  with check (true);

-- consultations : anonymous insert only
create policy "consultations_anon_insert"
  on public.consultations for insert
  with check (true);

-- contact_messages : anonymous insert only
create policy "contact_messages_anon_insert"
  on public.contact_messages for insert
  with check (true);

-- blog_posts : public read for published posts only
create policy "blog_posts_public_select"
  on public.blog_posts for select
  using (published = true);

-- faqs : public read for active faqs only
create policy "faqs_public_select"
  on public.faqs for select
  using (active = true);

-- ============================================================
-- 4. SEED DATA — Données initiales de démonstration
-- ============================================================

-- Dates d'examen (exemples)
insert into public.exam_dates (exam_type, exam_date, exam_time, registration_deadline, total_spots, available_spots, price_eur, notes, status)
values
  ('B1', '2026-07-12', '09:00', '2026-07-05', 20, 14, 180.00, 'Examen complet écrit + oral', 'open'),
  ('B2', '2026-07-19', '09:00', '2026-07-12', 20, 8,  220.00, 'Examen complet écrit + oral', 'open'),
  ('B1', '2026-08-09', '09:00', '2026-08-02', 20, 20, 180.00, 'Examen complet écrit + oral', 'open'),
  ('B2', '2026-08-23', '09:00', '2026-08-16', 20, 3,  220.00, 'Dernières places disponibles', 'open'),
  ('B1_oral', '2026-07-26', '10:00', '2026-07-19', 10, 10, 80.00, 'Module oral uniquement', 'open'),
  ('B1_written', '2026-07-26', '09:00', '2026-07-19', 15, 15, 120.00, 'Module écrit uniquement', 'open');

-- FAQs
insert into public.faqs (question, answer, category, display_order)
values
  ('Comment m''inscrire à un examen ?', 'Vous pouvez vous inscrire en ligne via notre formulaire d''inscription sur cette page, ou directement sur place pendant nos horaires d''ouverture (Lundi–Vendredi 09h00–16h00).', 'inscription', 1),
  ('Quand recevrai-je mon certificat ?', 'En général, vous recevrez votre certificat telc 4 à 6 semaines après la date de l''examen. Il vous sera envoyé par courrier postal ou disponible au retrait en académie.', 'certificat', 2),
  ('Puis-je repasser l''examen ?', 'Oui, en cas d''échec, vous pouvez vous réinscrire à la prochaine session disponible. Aucune limite de tentatives n''est imposée.', 'examen', 3),
  ('Quels documents dois-je apporter le jour de l''examen ?', 'Vous devez apporter une pièce d''identité valide (carte nationale ou passeport) et votre confirmation d''inscription.', 'examen', 4),
  ('Comment puis-je payer mon inscription ?', 'Le règlement s''effectue sur place en espèces ou par virement bancaire. Les informations de virement vous seront communiquées après votre inscription en ligne.', 'inscription', 5),
  ('Les certificats telc sont-ils reconnus internationalement ?', 'Oui, les certificats telc sont reconnus à l''international et acceptés pour les demandes de visa, de naturalisation, de formation professionnelle et d''études supérieures dans de nombreux pays.', 'general', 6);

-- Blog posts
insert into public.blog_posts (title, slug, summary, category, published, published_at)
values
  ('5 conseils pour réussir votre examen telc B1', '5-conseils-telc-b1', 'Découvrez les stratégies essentielles pour aborder sereinement chaque épreuve de l''examen telc B1 et maximiser vos chances de succès.', 'telc', true, now() - interval '5 days'),
  ('Les erreurs les plus fréquentes en expression écrite', 'erreurs-frequentes-expression-ecrite', 'Expression écrite, orthographe, grammaire : voici les pièges à éviter absolument pour ne pas perdre de points lors de votre examen.', 'conseils', true, now() - interval '12 days'),
  ('Comment améliorer son allemand au quotidien', 'ameliorer-allemand-quotidien', 'Des astuces simples et efficaces pour progresser en allemand en dehors des cours : podcasts, séries, applications et plus encore.', 'conseils', true, now() - interval '20 days'),
  ('Préparer le B2 : tout ce que vous devez savoir', 'preparer-b2-guide-complet', 'Guide complet pour préparer l''examen telc B2 : structure de l''examen, durée des épreuves, barème de notation et ressources recommandées.', 'examen', true, now() - interval '30 days');

-- ============================================================
-- END OF SCHEMA
-- ============================================================
