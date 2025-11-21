-- Run this script inside Supabase SQL editor (or supabase db push) to create
-- the tables consumed by the Expo client for individualized progress.

create extension if not exists "pgcrypto";

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  color_hex text not null default '#2563EB',
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  module text not null,
  order_index integer not null default 0,
  duration_minutes integer not null default 15,
  difficulty text not null default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  subject_tag text not null default 'geral',
  description text,
  video_url text,
  thumbnail_url text,
  resource_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  percent_complete integer not null default 0 check (percent_complete between 0 and 100),
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists lesson_progress_user_lesson_idx on public.lesson_progress(user_id, lesson_id);

create table if not exists public.daily_study_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  minutes integer not null default 0,
  completed_lessons integer not null default 0,
  streak integer not null default 0,
  created_at timestamptz not null default now()
);
create unique index if not exists daily_stats_user_day_idx on public.daily_study_stats(user_id, day);

create or replace function public.set_lesson_progress_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists lesson_progress_updated_at on public.lesson_progress;
create trigger lesson_progress_updated_at
before update on public.lesson_progress
for each row execute procedure public.set_lesson_progress_updated_at();

alter table public.subjects enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.daily_study_stats enable row level security;

drop policy if exists "Public lessons read" on public.lessons;
create policy "Public lessons read" on public.lessons
  for select using (true);

drop policy if exists "Public subjects read" on public.subjects;
create policy "Public subjects read" on public.subjects
  for select using (true);

drop policy if exists "Users read lesson progress" on public.lesson_progress;
create policy "Users read lesson progress" on public.lesson_progress
  for select using (auth.uid() = user_id);

drop policy if exists "Users mutate lesson progress" on public.lesson_progress;
create policy "Users mutate lesson progress" on public.lesson_progress
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users update lesson progress" on public.lesson_progress;
create policy "Users update lesson progress" on public.lesson_progress
  for update using (auth.uid() = user_id);

drop policy if exists "Users read study stats" on public.daily_study_stats;
create policy "Users read study stats" on public.daily_study_stats
  for select using (auth.uid() = user_id);

drop policy if exists "Users mutate study stats" on public.daily_study_stats;
create policy "Users mutate study stats" on public.daily_study_stats
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users update study stats" on public.daily_study_stats;
create policy "Users update study stats" on public.daily_study_stats
  for update using (auth.uid() = user_id);

create table if not exists public.study_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  exam text default 'enem',
  color_hex text not null default '#4F46E5',
  cover_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.study_track_items (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.study_tracks(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  order_index integer not null default 0,
  kind text not null default 'lesson',
  title text,
  description text,
  resource_url text,
  estimated_minutes integer not null default 20,
  created_at timestamptz not null default now()
);
create index if not exists study_track_items_track_idx on public.study_track_items(track_id);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  exam text not null default 'enem',
  subject text not null default 'geral',
  difficulty text not null default 'medio' check (difficulty in ('facil','medio','dificil')),
  question text not null,
  options text[] not null,
  correct_option integer not null,
  explanation text,
  reference_url text,
  created_at timestamptz not null default now()
);

alter table public.study_tracks enable row level security;
alter table public.study_track_items enable row level security;
alter table public.quiz_questions enable row level security;

drop policy if exists "Public study tracks read" on public.study_tracks;
create policy "Public study tracks read" on public.study_tracks
  for select using (true);

drop policy if exists "Public study track items read" on public.study_track_items;
create policy "Public study track items read" on public.study_track_items
  for select using (true);

drop policy if exists "Public quiz questions read" on public.quiz_questions;
create policy "Public quiz questions read" on public.quiz_questions
  for select using (true);

insert into public.subjects (slug, name, color_hex, icon)
values
  ('matematica', 'Matematica', '#3B82F6', 'calculator-outline'),
  ('ciencias', 'Ciencias', '#10B981', 'flask-outline'),
  ('humanas', 'Humanas', '#F59E0B', 'book-outline')
on conflict (slug) do nothing;

insert into public.lessons (subject_id, title, module, order_index, duration_minutes, difficulty)
select s.id, data.title, data.module, data.order_index, data.duration_minutes, data.difficulty
from public.subjects s
join (
  values
    ('matematica', 'Equacoes do 2 grau', 'Algebra', 1, 18, 'intermediate'),
    ('matematica', 'Funcoes Quadraticas', 'Algebra', 2, 22, 'intermediate'),
    ('ciencias', 'Sistema Solar', 'Astronomia', 1, 15, 'beginner'),
    ('humanas', 'Historia da Arte', 'Arte Moderna', 1, 20, 'beginner')
) as data(slug, title, module, order_index, duration_minutes, difficulty)
  on s.slug = data.slug
where not exists (
  select 1
  from public.lessons l
  where l.title = data.title
    and l.subject_id = s.id
);

update public.lessons set
  subject_tag = case
    when title ilike '%Funcoes%' then 'matematica'
    when title ilike '%Equacoes%' then 'matematica'
    when title ilike '%Sistema Solar%' then 'ciencias'
    when title ilike '%Historia%' then 'humanas'
    else 'geral'
  end,
  description = case
    when title ilike '%Funcoes%' then 'Aula guiada sobre funcoes quadraticas com resolucao passo a passo.'
    when title ilike '%Equacoes%' then 'Revisao rapida de equacoes do 2 grau com exercicios resolvidos.'
    when title ilike '%Sistema Solar%' then 'Video com curiosidades e questoes do ENEM sobre astronomia.'
    when title ilike '%Historia%' then 'Resumo visual sobre o modernismo e a Independencia do Brasil.'
    else 'Conteudo introdutorio.'
  end,
  video_url = case
    when title ilike '%Funcoes%' then 'https://www.youtube.com/watch?v=q19n2s5NpoE'
    when title ilike '%Equacoes%' then 'https://www.youtube.com/watch?v=pZ2wS5NQMY8'
    when title ilike '%Sistema Solar%' then 'https://www.youtube.com/watch?v=libKVRa01L8'
    when title ilike '%Historia%' then 'https://www.youtube.com/watch?v=l9nJ0u8a6QY'
    else null
  end,
  thumbnail_url = case
    when title ilike '%Funcoes%' then 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=60'
    when title ilike '%Equacoes%' then 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=600&q=60'
    when title ilike '%Sistema Solar%' then 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=600&q=60'
    when title ilike '%Historia%' then 'https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=600&q=60'
    else null
  end,
  is_featured = true
where title in ('Equacoes do 2 grau','Funcoes Quadraticas','Sistema Solar','Historia da Arte');

insert into public.study_tracks (slug, title, description, exam, color_hex)
values
  ('combo-enem-inicial', 'Combo ENEM Inicial', 'Sequencia curta para revisar matematica e ciencias da natureza.', 'enem', '#4F46E5'),
  ('trilha-humanas-raiz', 'Trilha Humanas Express', 'Recursos oficiais para Historia e Geografia.', 'enem', '#F59E0B')
on conflict (slug) do nothing;

insert into public.study_track_items (track_id, lesson_id, order_index, kind, title, description, resource_url, estimated_minutes)
select t.id, l.id, idx.order_index, idx.kind, idx.title, idx.description, idx.resource_url, idx.estimated_minutes
from (
  values
    ('combo-enem-inicial', 'Equacoes do 2 grau', 1, 'lesson', null, null, null, 25),
    ('combo-enem-inicial', 'Funcoes Quadraticas', 2, 'lesson', null, null, null, 30),
    ('combo-enem-inicial', 'Sistema Solar', 3, 'lesson', null, null, null, 20),
    ('trilha-humanas-raiz', 'Historia da Arte', 1, 'lesson', null, null, null, 25),
    ('trilha-humanas-raiz', null, 2, 'resource', 'Banco oficial ENEM', 'PDF oficial com provas recentes.', 'https://download.inep.gov.br/educacao_basica/enem/provas/2022/1_dia_caderno_1_azul_aplicacao_regular.pdf', 40),
    ('trilha-humanas-raiz', null, 3, 'resource', 'Portal UFPR provas', 'Site com provas anteriores e editais.', 'https://www.nc.ufpr.br/concursos_institucionais/ufpr/ufpr_provas.html', 15)
) as idx(track_slug, lesson_title, order_index, kind, title, description, resource_url, estimated_minutes)
join public.study_tracks t on t.slug = idx.track_slug
left join public.lessons l on l.title = idx.lesson_title
where not exists (
  select 1 from public.study_track_items i
  where i.track_id = t.id
    and coalesce(i.lesson_id::text, '') = coalesce(l.id::text, '')
    and i.title is not distinct from idx.title
);

insert into public.quiz_questions (exam, subject, difficulty, question, options, correct_option, explanation, reference_url)
values
  (
    'enem',
    'matematica',
    'medio',
    'Uma funcao do 2 grau possui delta igual a zero. Quantas raizes reais ela possui?',
    ARRAY['Nenhuma', 'Uma raiz real dupla', 'Duas raizes distintas', 'Infinitas raizes'],
    2,
    'Delta igual a zero implica em uma unica raiz real (raiz dupla).',
    'https://www.proenem.com.br/blog/funcao-quadratica'
  ),
  (
    'enem',
    'ciencias',
    'facil',
    'Qual planeta do sistema solar possui o maior numero de luas conhecidas?',
    ARRAY['Terra', 'Marte', 'Jupiter', 'Mercurio'],
    3,
    'Jupiter lidera o ranking de luas catalogadas ate o momento.',
    'https://www.nasa.gov/moons'
  ),
  (
    'enem',
    'humanas',
    'medio',
    'O movimento modernista no Brasil foi lançado oficialmente em que evento?',
    ARRAY['Semana de 22', 'Inconfidencia Mineira', 'Diretas Ja', 'Semana literaria de 1960'],
    1,
    'A Semana de Arte Moderna de 1922 marcou o inicio oficial do modernismo brasileiro.',
    'https://www.museudoimon.br'
  )
on conflict do nothing;
