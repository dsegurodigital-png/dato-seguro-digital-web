import "server-only";

import { NextResponse } from "next/server";
import type { ResultadoVerificacion } from "@/lib/auth/admin";

/** Respuestas JSON de la API admin: nunca cacheables, mensajes genéricos. */
const SIN_CACHE = { "Cache-Control": "private, no-store" };
export function responder(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: SIN_CACHE });
}

export function respuestaAccesoDenegado(
  verificacion: Exclude<ResultadoVerificacion, { estado: "autorizado" }>,
) {
  switch (verificacion.estado) {
    case "sin_sesion":
      return responder(
        { ok: false, mensaje: "Inicia sesión con una cuenta autorizada." },
        401,
      );
    case "no_autorizado":
      return responder(
        { ok: false, mensaje: "Esta cuenta no tiene permiso para esta operación." },
        403,
      );
    default:
      return responder(
        { ok: false, mensaje: "Servicio temporalmente no disponible." },
        503,
      );
  }
}
