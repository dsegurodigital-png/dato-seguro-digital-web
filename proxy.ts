import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión de Supabase (cookies) en cada request a /admin/*,
 * siguiendo el patrón recomendado de @supabase/ssr para Next.js.
 * Sin esto, la sesión del panel administrativo puede expirar de forma
 * inconsistente entre navegaciones de Server Components.
 *
 * Next.js 16 renombró `middleware` a `proxy`. Esto NO es el control de
 * acceso: cada página y ruta admin vuelve a verificar la identidad en el
 * servidor (ver lib/auth/admin.ts).
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Fuerza la validación/refresco del token. Si Auth no responde, se deja
  // pasar: la página/ruta decide con su propia verificación.
  let sinSesion = false;
  try {
    const { data, error } = await supabase.auth.getUser();
    sinSesion = !data.user && error?.name !== "AuthRetryableFetchError";
  } catch {
    // Sin log: no hay nada útil que registrar sin exponer datos de sesión.
  }

  // Redirección temprana (307) sin sesión. Es solo una mejora de UX/defensa
  // en profundidad; la autorización real (ADMIN_EMAIL) se hace en el servidor.
  if (sinSesion && request.nextUrl.pathname !== "/admin/login") {
    const destino = request.nextUrl.clone();
    destino.pathname = "/admin/login";
    destino.search = "";
    const redireccion = NextResponse.redirect(destino);
    supabaseResponse.cookies.getAll().forEach((cookie) => redireccion.cookies.set(cookie));
    return redireccion;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
