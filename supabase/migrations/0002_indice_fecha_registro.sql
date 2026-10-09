-- Dato Seguro Digital — índice para el orden del panel administrativo.
-- No destructiva: solo crea un índice si no existe. Ejecutar una vez en el
-- SQL Editor de Supabase (no se ha ejecutado automáticamente).
--
-- Contexto: el panel ordena por `fecha_registro` (NOT NULL, default now()),
-- pero 0001 creó el índice sobre `consentimiento_registrado_en`, que es
-- nullable y está vacía en registros antiguos. Ese índice se conserva.

create index if not exists solicitudes_dsd_fecha_registro_idx
  on public.solicitudes_dsd (fecha_registro desc);

create index if not exists solicitudes_dsd_estado_idx
  on public.solicitudes_dsd (estado);
