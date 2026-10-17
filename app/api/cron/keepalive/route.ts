import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Ping diario (Vercel Cron, ver vercel.json) para que Supabase no pause el
 * proyecto por inactividad (plan gratuito: pausa tras ~7 días sin actividad).
 *
 * Hace una lectura mínima (solo cuenta filas, no devuelve datos). Si la
 * variable CRON_SECRET está definida en Vercel, Vercel la envía como
 * `Authorization: Bearer <CRON_SECRET>` y aquí se exige; así nadie más
 * puede invocar esta ruta.
 */
export async function GET(request: NextRequest) {
  const secreto = process.env.CRON_SECRET;
  if (secreto && request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("solicitudes_dsd")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Keepalive Supabase falló:", error.code, error.message);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Keepalive error:", e instanceof Error ? e.message : "desconocido");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
