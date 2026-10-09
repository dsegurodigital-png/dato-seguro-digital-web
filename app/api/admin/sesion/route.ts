import { verificarAdministrador } from "@/lib/auth/admin";
import { respuestaAccesoDenegado, responder } from "@/lib/auth/respuestas";

/**
 * Indica si la sesión actual pertenece al administrador autorizado.
 * Lo usa la pantalla de login para no exponer ADMIN_EMAIL en el navegador.
 * No devuelve datos personales.
 */
export async function GET() {
  const verificacion = await verificarAdministrador();

  if (verificacion.estado !== "autorizado") {
    return respuestaAccesoDenegado(verificacion);
  }

  return responder({ ok: true });
}
