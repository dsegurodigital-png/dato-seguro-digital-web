import "server-only";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Capa de acceso a datos (DAL) del panel administrativo.
 *
 * Toda lectura o escritura de `solicitudes_dsd` hecha por el panel pasa por
 * aquí. Las funciones que usan la service role key exigen un
 * `AdministradorVerificado`, que solo se obtiene de `verificarAdministrador()`
 * (sesión validada con `auth.getUser()` + comparación con ADMIN_EMAIL).
 */

export const ESTADOS = ["nuevo", "en_revision", "cerrado"] as const;
export type Estado = (typeof ESTADOS)[number];

export const LIMITE_SOLICITUDES = 200;

const TABLA = "solicitudes_dsd";
const COLUMNAS =
  "id, nombre, contacto, descripcion, fecha_registro, estado, consentimiento, version_autorizacion";

export type SolicitudAdmin = {
  id: string;
  nombre: string;
  contacto: string;
  descripcion: string | null;
  fecha_registro: string;
  estado: Estado;
  consentimiento: boolean;
  version_autorizacion: string;
};

export type ConteoEstados = Record<"total" | Estado, number>;

export type DatosPanel = {
  solicitudes: SolicitudAdmin[];
  conteos: ConteoEstados;
  limite: number;
};

export type AdministradorVerificado = { estado: "autorizado"; user: User };

export type ResultadoVerificacion =
  | AdministradorVerificado
  | { estado: "sin_sesion" }
  | { estado: "no_autorizado" }
  | { estado: "error" };

export function esEstado(valor: unknown): valor is Estado {
  return typeof valor === "string" && (ESTADOS as readonly string[]).includes(valor);
}

export async function verificarAdministrador(): Promise<ResultadoVerificacion> {
  // Fuera del try: cookies() puede suspender el render y eso no debe capturarse.
  const supabase = await createClient();

  let user: User | null;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      // Fallo de red o del servicio de Auth: no es un problema de credenciales.
      return error.name === "AuthRetryableFetchError"
        ? { estado: "error" }
        : { estado: "sin_sesion" };
    }

    user = data.user;
  } catch {
    return { estado: "error" };
  }

  if (!user) {
    return { estado: "sin_sesion" };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = user.email?.trim().toLowerCase();

  if (!adminEmail || !userEmail || userEmail !== adminEmail) {
    return { estado: "no_autorizado" };
  }

  return { estado: "autorizado", user };
}

/** Defensa en profundidad: nunca usar la service role sin verificación previa. */
function exigirAdministrador(admin: AdministradorVerificado) {
  if (admin?.estado !== "autorizado") {
    throw new Error("Operación administrativa sin verificación previa.");
  }
}

class ErrorConsulta extends Error {}

async function consultarConteos(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<ConteoEstados> {
  const contar = async (estado?: Estado) => {
    let consulta = supabase.from(TABLA).select("id", { count: "exact", head: true });
    if (estado) consulta = consulta.eq("estado", estado);

    const { count, error } = await consulta;
    if (error) {
      console.error("Error al contar solicitudes:", error.code);
      throw new ErrorConsulta();
    }
    return count ?? 0;
  };

  const [total, nuevo, en_revision, cerrado] = await Promise.all([
    contar(),
    contar("nuevo"),
    contar("en_revision"),
    contar("cerrado"),
  ]);

  return { total, nuevo, en_revision, cerrado };
}

/** Devuelve `null` si la consulta falla (el detalle solo va al log, sin datos personales). */
export async function consultarPanel(
  admin: AdministradorVerificado,
): Promise<DatosPanel | null> {
  exigirAdministrador(admin);

  try {
    const supabase = createAdminClient();

    const [lista, conteos] = await Promise.all([
      supabase
        .from(TABLA)
        .select(COLUMNAS)
        .order("fecha_registro", { ascending: false })
        .limit(LIMITE_SOLICITUDES),
      consultarConteos(supabase),
    ]);

    if (lista.error) {
      console.error("Error al consultar solicitudes:", lista.error.code);
      return null;
    }

    return {
      solicitudes: (lista.data ?? []) as SolicitudAdmin[],
      conteos,
      limite: LIMITE_SOLICITUDES,
    };
  } catch {
    return null;
  }
}

export type ResultadoActualizacion =
  | {
      estado: "ok";
      solicitud: { id: string; estado: Estado };
      /** `null` si el cambio se guardó pero no se pudieron recalcular los totales. */
      conteos: ConteoEstados | null;
    }
  | { estado: "no_encontrada" }
  | { estado: "error" };

/** Solo modifica la columna `estado`; nunca consentimiento ni versión de autorización. */
export async function actualizarEstado(
  admin: AdministradorVerificado,
  id: string,
  estado: Estado,
): Promise<ResultadoActualizacion> {
  exigirAdministrador(admin);

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(TABLA)
      .update({ estado })
      .eq("id", id)
      .select("id, estado")
      .maybeSingle();

    if (error) {
      console.error("Error al actualizar solicitud:", error.code);
      return { estado: "error" };
    }

    if (!data) {
      return { estado: "no_encontrada" };
    }

    const conteos = await consultarConteos(supabase).catch(() => null);

    return {
      estado: "ok",
      solicitud: data as { id: string; estado: Estado },
      conteos,
    };
  } catch {
    return { estado: "error" };
  }
}
