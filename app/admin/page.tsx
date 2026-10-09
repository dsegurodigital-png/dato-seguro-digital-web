import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { consultarPanel, verificarAdministrador } from "@/lib/auth/admin";
import SolicitudesClient from "./solicitudes-client";
import { PanelCargando, PanelError } from "./panel-ui";

export const metadata: Metadata = {
  title: "Panel administrativo · Dato Seguro Digital",
  robots: { index: false, follow: false },
};

/**
 * Con `cacheComponents`, leer la sesión (cookies) fuera de <Suspense> es un
 * error de build. El shell estático se prerenderiza; la verificación de
 * identidad y los datos se resuelven en el servidor, por petición, dentro
 * del boundary. Nada de esto se cachea.
 */
export default function AdminPage() {
  return (
    <Suspense fallback={<PanelCargando />}>
      <PanelAdmin />
    </Suspense>
  );
}

async function PanelAdmin() {
  const verificacion = await verificarAdministrador();

  if (verificacion.estado === "sin_sesion" || verificacion.estado === "no_autorizado") {
    redirect("/admin/login");
  }

  if (verificacion.estado === "error") {
    return (
      <PanelError mensaje="No fue posible verificar tu sesión. Inténtalo de nuevo en unos segundos." />
    );
  }

  const datos = await consultarPanel(verificacion);

  if (!datos) {
    return (
      <PanelError mensaje="No fue posible consultar las solicitudes. Inténtalo de nuevo en unos segundos." />
    );
  }

  return <SolicitudesClient inicial={datos} />;
}
