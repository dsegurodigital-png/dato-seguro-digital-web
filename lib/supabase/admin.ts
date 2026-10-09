import "server-only";

import { createClient as createServiceClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la clave de servicio (service role).
 *
 * SOLO debe usarse en código de servidor que YA verificó la sesión del
 * usuario y confirmó que su correo coincide con ADMIN_EMAIL. Esta clave
 * se salta Row Level Security, así que nunca debe llegar al navegador
 * ni usarse para atender solicitudes públicas sin verificación previa.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) {
    throw new Error("Faltan las variables de configuración de Supabase (admin).");
  }

  return createServiceClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
