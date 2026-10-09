
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { obtenerIp, permitir } from "@/lib/rate-limit";

const VERSION_AUTORIZACION = "web-consent-v1.0";

const TEXTO_AUTORIZACION =
  "Declaro que he leído la Política de Tratamiento de Datos Personales de Dato Seguro Digital y autorizo, de manera libre, previa, expresa e informada, el tratamiento de mis datos personales para las finalidades allí informadas.";

const MAX_BODY_BYTES = 10_000;

// Máximo 5 solicitudes por IP cada 60 minutos.
const LIMITE_SOLICITUDES = 5;
const VENTANA_LIMITE_MS = 60 * 60 * 1000;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null;

function textoValido(
  value: unknown,
  minimo: number,
  maximo: number,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= minimo &&
    value.trim().length <= maximo
  );
}

export async function POST(request: Request) {
  const ip = obtenerIp(request);
  const limite = permitir(ip, LIMITE_SOLICITUDES, VENTANA_LIMITE_MS);

  if (!limite.ok) {
    const segundos = Math.max(1, Math.ceil(limite.reintentarEnMs / 1000));
    return NextResponse.json(
      {
        ok: false,
        mensaje: "Has enviado demasiadas solicitudes. Inténtalo más tarde.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(segundos) },
      },
    );
  }

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        mensaje: "Servicio temporalmente no disponible.",
      },
      { status: 503 },
    );
  }

  // Limitar el tamaño del cuerpo de la solicitud.
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, mensaje: "La solicitud supera el tamaño permitido." },
      { status: 413 },
    );
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { ok: false, mensaje: "No fue posible leer la solicitud." },
      { status: 400 },
    );
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, mensaje: "La solicitud supera el tamaño permitido." },
      { status: 413 },
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, mensaje: "La solicitud no tiene un formato válido." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, mensaje: "Datos inválidos." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;

  if (
    !textoValido(data.nombre, 2, 100) ||
    !textoValido(data.contacto, 5, 150) ||
    (data.descripcion !== undefined &&
      data.descripcion !== null &&
      data.descripcion !== "" &&
      !textoValido(data.descripcion, 1, 1500))
  ) {
    return NextResponse.json(
      {
        ok: false,
        mensaje: "Revisa el nombre, el contacto y la descripción.",
      },
      { status: 400 },
    );
  }

  if (
    data.consentimiento !== true ||
    data.version_autorizacion !== VERSION_AUTORIZACION
  ) {
    return NextResponse.json(
      {
        ok: false,
        mensaje: "Debes aceptar la autorización vigente para continuar.",
      },
      { status: 400 },
    );
  }

  const descripcion =
    typeof data.descripcion === "string" && data.descripcion.trim()
      ? data.descripcion.trim()
      : null;

  try {
    const { error } = await supabase
      .from("solicitudes_dsd")
      .insert({
        nombre: data.nombre.trim(),
        contacto: data.contacto.trim(),
        descripcion,
        version_autorizacion: VERSION_AUTORIZACION,
        consentimiento: true,
        texto_autorizacion: TEXTO_AUTORIZACION,
        consentimiento_registrado_en: new Date().toISOString(),
      });

    if (error) {
      // No registrar datos personales ni mensajes internos del proveedor.
      console.error("Error al registrar solicitud:", error.code);

      return NextResponse.json(
        {
          ok: false,
          mensaje: "No pudimos registrar la solicitud. Inténtalo más tarde.",
        },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        mensaje: "Servicio temporalmente no disponible.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      mensaje: "Tu solicitud fue recibida correctamente.",
    },
    { status: 201 },
  );
}
