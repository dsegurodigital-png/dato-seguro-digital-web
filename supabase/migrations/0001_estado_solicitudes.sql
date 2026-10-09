-- Dato Seguro Digital — columna de estado para el panel administrativo
-- Ejecutar una sola vez en el SQL Editor del proyecto de Supabase.

alter table public.solicitudes_dsd
  add column if not exists estado text not null default 'nuevo';

alter table public.solicitudes_dsd
  drop constraint if exists solicitudes_dsd_estado_check;

alter table public.solicitudes_dsd
  add constraint solicitudes_dsd_estado_check
  check (estado in ('nuevo', 'en_revision', 'cerrado'));

create index if not exists solicitudes_dsd_fecha_idx
  on public.solicitudes_dsd (consentimiento_registrado_en desc);

-- RLS activado y sin políticas para anon/authenticated: todo el acceso
-- (lectura pública del formulario y panel admin) pasa exclusivamente por
-- rutas de servidor que usan la service role key, nunca desde el navegador.
alter table public.solicitudes_dsd enable row level security;
