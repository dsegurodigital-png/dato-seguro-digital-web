import {
  actualizarEstado,
  consultarPanel,
  esEstado,
  verificarAdministrador,
} from "@/lib/auth/admin";
import { respuestaAccesoDenegado, responder } from "@/lib/auth/respuestas";

const MAX_BODY_BYTES = 1_000;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Protección CSRF para mutaciones: exige cabecera Origin del mismo host.
 * Se compara contra la URL de la petición y contra Host / X-Forwarded-Host
 * (necesario detrás de un proxy inverso). Un navegador no puede falsificar
 * Origin, y X-Forwarded-Host en una petición cross-site forzaría un preflight
 * CORS que esta API no autoriza.
 */
function origenPermitido(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  let hostOrigen: string;
  try {
    hostOrigen = new URL(origin).host;
  } catch {
    return false;
  }

  const candidatos = [
    new URL(request.url).host,
    request.headers.get("host"),
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
  ].filter(Boolean);

  return candidatos.includes(hostOrigen);
}

export async function GET() {
  const verificacion = await verificarAdministrador();

  if (verificacion.estado !== "autorizado") {
    return respuestaAccesoDenegado(verificacion);
  }

  const datos = await consultarPanel(verificacion);

  if (!datos) {
    return responder(
      { ok: false, mensaje: "No fue posible consultar las solicitudes." },
      500,
    );
  }

  return responder({ ok: true, ...datos });
}

export async function PATCH(request: Request) {
  if (!origenPermitido(request)) {
    return responder({ ok: false, mensaje: "Origen de solicitud no permitido." }, 403);
  }

  const verificacion = await verificarAdministrador();

  if (verificacion.estado !== "autorizado") {
    return respuestaAccesoDenegado(verificacion);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return responder({ ok: false, mensaje: "Formato de solicitud no admitido." }, 415);
  }

  let body: unknown;

  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return responder({ ok: false, mensaje: "La solicitud supera el tamaño permitido." }, 413);
    }
    body = JSON.parse(raw);
  } catch {
    return responder({ ok: false, mensaje: "El cuerpo de la solicitud no es válido." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return responder({ ok: false, mensaje: "Datos inválidos." }, 400);
  }

  const { id, estado } = body as Record<string, unknown>;

  if (typeof id !== "string" || !UUID_RE.test(id) || !esEstado(estado)) {
    return responder({ ok: false, mensaje: "Identificador o estado inválido." }, 400);
  }

  const resultado = await actualizarEstado(verificacion, id, estado);

  if (resultado.estado === "no_encontrada") {
    return responder({ ok: false, mensaje: "No se encontró la solicitud." }, 404);
  }

  if (resultado.estado === "error") {
    return responder({ ok: false, mensaje: "No fue posible actualizar la solicitud." }, 500);
  }

  return responder({
    ok: true,
    solicitud: resultado.solicitud,
    conteos: resultado.conteos,
  });
}
