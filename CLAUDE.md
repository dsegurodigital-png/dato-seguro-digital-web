# Dato Seguro Digital — contexto del proyecto

Sitio web de **Dato Seguro Digital**, empresa colombiana que orienta y acompaña a
personas que sufren acoso por parte de aplicaciones de crédito digital ilegales
("gota a gota digital"). El sitio recibe datos personales y descripciones de
situaciones sensibles de personas vulnerables: trátalo siempre con ese nivel
de cuidado y prioriza seguridad y privacidad sobre velocidad de entrega.

Dominio: `datosegurodigital.com`. Marca: azul marino `#0B2340`, verde azulado
`#028090`, verde menta `#02C39A`, dorado `#C9A84C`. Toda la interfaz va en
español.

## Stack

- Next.js 16.4.0, App Router, Turbopack, TypeScript, React 19.
- Tailwind CSS 4 (vía `@tailwindcss/turbopack`, ver `next.config.ts`).
- Supabase: Auth (panel admin) + Postgres (tabla `public.solicitudes_dsd`).
- `@supabase/ssr` para los clientes de navegador/servidor, `@supabase/supabase-js`
  directo para el cliente con service role (solo en endpoints admin).

`next.config.ts` tiene `cacheComponents: true`, `partialPrefetching: true` y
`experimental.agentFeedback: true`. Son deliberados — no los desactives solo
para esquivar un error; entiende primero el error.

Comandos:
```bash
npm run dev     # servidor local, http://localhost:3000
npm run build   # build de producción
npx tsc --noEmit  # chequeo de tipos (úsalo tras cualquier cambio)
npm run lint
```

## Mapa de archivos

- `app/page.tsx` — landing pública (hero, servicios, FAQ, WhatsApp real: +57 312 379 7011).
- `app/politica-de-datos/page.tsx` — política de tratamiento de datos.
- `app/api/solicitudes/route.ts` — endpoint público `POST`: recibe el formulario
  de contacto, valida consentimiento (`version_autorizacion = "web-consent-v1.0"`),
  inserta en `solicitudes_dsd` usando la service role key (el navegador nunca
  toca esta tabla directamente).
- `app/admin/login/page.tsx` — login con Supabase Auth (email + password).
- `lib/auth/admin.ts` — **capa de acceso a datos (DAL), server-only**.
  `verificarAdministrador()` (getUser + ADMIN_EMAIL → `autorizado` |
  `sin_sesion` | `no_autorizado` | `error`), `consultarPanel()` (lista con
  límite 200 + conteos reales por estado) y `actualizarEstado()` (solo
  columna `estado`). Las funciones con service role exigen el resultado
  `autorizado` como parámetro. Todo acceso admin pasa por aquí.
- `lib/auth/respuestas.ts` — respuestas JSON admin (`Cache-Control: private,
  no-store`; 401 sin sesión, 403 no autorizado, 503 fallo de Auth).
- `app/admin/page.tsx` — Server Component. Shell estático + `<Suspense>`
  (obligatorio con `cacheComponents`: leer cookies fuera de Suspense rompe
  el build). Dentro verifica admin y carga los datos iniciales en el
  servidor; se los pasa a `solicitudes-client.tsx`. No hay fetch al montar.
- `app/admin/panel-ui.tsx` — encabezado, esqueleto de carga y error.
- `app/admin/solicitudes-client.tsx` — Client Component: indicadores,
  búsqueda/filtros (sobre lo cargado), tabla (escritorio) / tarjetas
  (móvil), detalle en `<dialog>`, cambio de estado (PATCH), recarga manual
  con AbortController, cierre de sesión. Recarga y PATCH se bloquean entre sí.
- `app/api/admin/solicitudes/route.ts` — `GET` (datos del panel) y `PATCH`
  (estado). PATCH: Origin/Sec-Fetch-Site mismo host, JSON obligatorio,
  cuerpo ≤ 1 KB, UUID + enum.
- `app/api/admin/sesion/route.ts` — `GET` 200/401/403 sin datos; lo usa el
  login para no exponer ADMIN_EMAIL en el navegador.
- `proxy.ts` — (antes `middleware.ts`, renombrado en Next 16) refresca
  cookies de Supabase en `/admin/:path*` y redirige (307) sin sesión. No es
  el control de acceso; la página y la API verifican por su cuenta.
- `lib/supabase/client.ts` / `server.ts` — clientes `@supabase/ssr` estándar
  (browser / server con cookies). **No reemplazar sin motivo fuerte** —
  ya fueron revisados y validados.
- `lib/supabase/admin.ts` — `createAdminClient()` con service role
  (server-only). Usado únicamente desde `lib/auth/admin.ts`.
- `supabase/migrations/0001_estado_solicitudes.sql` — agrega columna `estado`
  (default `nuevo`, check constraint), índice por fecha, confirma RLS activo
  sin políticas públicas. **Pendiente de confirmar que se ejecutó** en el
  SQL Editor del proyecto Supabase.

## Esquema de `public.solicitudes_dsd` (verificado 2026-10-09, OpenAPI de PostgREST)

`id` uuid default gen_random_uuid(), `nombre` text NOT NULL, `contacto`
text NOT NULL, `descripcion` text, `version_autorizacion` text NOT NULL,
`fecha_registro` timestamptz NOT NULL default now(), `estado` text NOT NULL
default 'nuevo', `consentimiento` bool NOT NULL default false,
`texto_autorizacion` text, `consentimiento_registrado_en` timestamptz (nullable).

- `fecha_registro` es la fecha de recepción (la pone la BD). 
  `consentimiento_registrado_en` es la marca de la autorización que escribe
  el endpoint público; está vacía en registros anteriores a ese campo. Ambas
  existen: no hay columna obsoleta, no tocar.
- La clave publicable (anon) recibe 401 al leer la tabla.
- Hay al menos un registro con `nombre` mal codificado (mojibake `Ã…`),
  probablemente de una prueba hecha desde PowerShell 5.1. No se modificó.

## Variables de entorno (`.env.local`, nunca las imprimas ni las subas a git)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SECRET_KEY` (service role, solo servidor), `ADMIN_EMAIL`
(verificación server-side). `NEXT_PUBLIC_ADMIN_EMAIL` ya **no se usa** en el
código (se puede retirar de `.env.local` y del hosting).
`.env*` ya está en `.gitignore`.

## Reglas de seguridad (no negociables)

- Verificar identidad con `supabase.auth.getUser()` **en el servidor** en
  cada operación admin; nunca confiar solo en checks del navegador.
- Comprobar `ADMIN_EMAIL` en el servidor en cada ruta/acción admin, no una
  sola vez "aguas arriba".
- `SUPABASE_SECRET_KEY` nunca llega al cliente ni a una ruta pública sin
  verificación previa.
- `solicitudes_dsd` sin lectura/escritura pública (RLS activo, sin políticas
  para `anon`/`authenticated`); todo el acceso pasa por rutas de servidor.
- Validar siempre: UUID del id, enum de `estado`, método HTTP, origen de la
  petición en mutaciones.
- Respuestas de error genéricas al cliente (nunca el detalle interno de
  Supabase); no loguear datos personales ni descripciones de casos.
- No eliminar registros. No modificar `consentimiento` ni
  `version_autorizacion` de registros existentes. No migraciones
  destructivas. No `npm audit fix --force`.
- El formulario público y su validación de consentimiento informado no se
  tocan salvo que el cambio lo pida explícitamente.

## Estado actual / pendientes conocidos (2026-10-09)

1. `npm run build`, `npx tsc --noEmit` y `npm run lint` pasan sin errores.
2. Columna `estado` existe (0001 se aplicó al menos en esa parte). Pendiente
   ejecutar `supabase/migrations/0002_indice_fecha_registro.sql` (índices,
   no destructiva).
3. Causa del "cero / Cargando… y luego aparecen registros": la página no
   enviaba datos y el cliente hacía fetch en `useEffect` (doble en dev por
   Strict Mode). Corregido: datos iniciales renderizados en el servidor.
4. Pendiente probar con sesión real: admin autorizado (lectura + cambio de
   estado en un registro de prueba y restaurarlo) y usuario no autorizado.
5. Antes de producción: rate limiting / anti-abuso en `/api/solicitudes`,
   paginación si se superan 200 solicitudes, revisión legal de las
   políticas de datos, NIT de la empresa, correo admin dedicado (hoy
   coincide con el correo público de contacto), metadata del layout raíz.

## Estilo de trabajo esperado de Claude Code aquí

- Lee el archivo relevante completo antes de modificarlo; no sobrescribas
  sin inspeccionar el contenido actual primero (el proyecto puede haber
  cambiado entre sesiones).
- Cambios pequeños y verificables: corre `npx tsc --noEmit` después de cada
  cambio no trivial.
- Reporta en español, con diagnóstico separado de hipótesis, y qué pruebas
  ejecutaste realmente (no afirmes que algo "pasó" si no lo corriste).

## Despliegue (9 oct 2026)

- **Repo**: https://github.com/dsegurodigital-png/dato-seguro-digital-web (privado, cuenta propia de Dato Seguro Digital — independiente de NeurallFlow).
- **Hosting**: Vercel, proyecto `dato-seguro-digital-web` bajo la cuenta `dsegurodigital-png`.
- **Variables de entorno** cargadas en Vercel (Project → Settings → Environment Variables): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `ADMIN_EMAIL`.
- **Dominio**: `datosegurodigital.com` y `www.datosegurodigital.com` agregados en Vercel; DNS en Cloudflare con registros CNAME (`@` y `www`) hacia `5040b2864e8b784b.vercel-dns-017.com`, en modo "DNS only" (sin proxy naranja de Cloudflare — necesario para que Vercel emita el certificado SSL).
- **Migraciones SQL** (0001, 0002) confirmadas ejecutadas en el proyecto real de Supabase.
- Para futuros cambios: trabajar en local, `git add -A && git commit && git push origin master` — Vercel re-despliega automático en cada push a `master`.

### Pendiente antes de anunciar el lanzamiento
- Confirmar que `datosegurodigital.com` y `www` pasen a "Valid Configuration" en Vercel (propagación DNS).
- Login real de admin en producción (no solo en local).
- Revisión legal de las políticas de datos y NIT cuando la empresa esté constituida.
