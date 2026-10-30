-- P1 · Entrar com segurança
-- Quem pode entrar na área do produtor. No MVP é só o Rafael.
-- Não há política de insert: o cadastro é feito pelo painel da Supabase.
create table public.produtores (
  user_id uuid primary key references auth.users (id) on delete cascade,
  criado_em timestamptz not null default now()
);

comment on table public.produtores is 'Contas com acesso à área do produtor (P1).';

alter table public.produtores enable row level security;

create policy "produtor lê o próprio cadastro"
  on public.produtores
  for select
  to authenticated
  using ((select auth.uid()) = user_id);
