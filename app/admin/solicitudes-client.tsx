"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  ConteoEstados,
  DatosPanel,
  Estado,
  SolicitudAdmin,
} from "@/lib/auth/admin";
import { EncabezadoPanel, TituloBandeja } from "./panel-ui";

const ESTADOS: Estado[] = ["nuevo", "en_revision", "cerrado"];

const ETIQUETAS: Record<Estado, string> = {
  nuevo: "Nueva",
  en_revision: "En revisión",
  cerrado: "Cerrada",
};

const ESTILO_ESTADO: Record<Estado, string> = {
  nuevo: "bg-[#028090]/10 text-[#02606c] ring-[#028090]/30",
  en_revision: "bg-[#C9A84C]/15 text-[#6f5718] ring-[#C9A84C]/40",
  cerrado: "bg-[#02C39A]/15 text-[#016b55] ring-[#02C39A]/40",
};

// Zona horaria fija: el servidor y el navegador deben producir el mismo texto.
const FORMATO_FECHA = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

function formatearFecha(iso: string) {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? "Sin fecha" : FORMATO_FECHA.format(fecha);
}

function ajustarConteos(conteos: ConteoEstados, de: Estado, a: Estado): ConteoEstados {
  if (de === a) return conteos;
  return { ...conteos, [de]: Math.max(0, conteos[de] - 1), [a]: conteos[a] + 1 };
}

/** Error con mensaje ya apto para mostrar al usuario. */
class ErrorPanel extends Error {}

type RespuestaApi = { ok?: boolean; mensaje?: string } & Record<string, unknown>;

async function leerJson(response: Response): Promise<RespuestaApi | null> {
  try {
    return (await response.json()) as RespuestaApi;
  } catch {
    return null;
  }
}

type Aviso = { tipo: "exito" | "error"; texto: string } | null;

export default function SolicitudesClient({ inicial }: { inicial: DatosPanel }) {
  const router = useRouter();

  // Los datos iniciales llegan renderizados desde el servidor: no hay fetch al montar.
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>(inicial.solicitudes);
  const [conteos, setConteos] = useState<ConteoEstados>(inicial.conteos);
  const [filtro, setFiltro] = useState<"todos" | Estado>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [recargando, setRecargando] = useState(false);
  const [pendientes, setPendientes] = useState<Record<string, Estado>>({});
  const [aviso, setAviso] = useState<Aviso>(null);
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const controladorRef = useRef<AbortController | null>(null);
  const dialogoRef = useRef<HTMLDialogElement>(null);

  const hayPendientes = Object.keys(pendientes).length > 0;
  const seleccionada = seleccionadaId
    ? (solicitudes.find((s) => s.id === seleccionadaId) ?? null)
    : null;

  useEffect(() => () => controladorRef.current?.abort(), []);

  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    if (seleccionada && !dialogo.open) dialogo.showModal();
    if (!seleccionada && dialogo.open) dialogo.close();
  }, [seleccionada]);

  /** Devuelve true si la respuesta fue un rechazo de acceso ya gestionado. */
  function gestionarAccesoDenegado(status: number) {
    if (status === 401) {
      router.replace("/admin/login");
      return true;
    }
    if (status === 403) {
      setAviso({
        tipo: "error",
        texto: "Tu cuenta no tiene permiso para usar el panel. Cierra sesión e ingresa con la cuenta autorizada.",
      });
      return true;
    }
    return false;
  }

  async function recargar() {
    // No recargar mientras se guarda un cambio: evita sobrescribirlo con datos viejos.
    if (hayPendientes) return;

    controladorRef.current?.abort();
    const controlador = new AbortController();
    controladorRef.current = controlador;

    setRecargando(true);
    setAviso(null);

    try {
      const response = await fetch("/api/admin/solicitudes", {
        cache: "no-store",
        credentials: "same-origin",
        signal: controlador.signal,
      });
      const result = await leerJson(response);

      if (!response.ok || !result?.ok) {
        if (gestionarAccesoDenegado(response.status)) return;
        throw new ErrorPanel(result?.mensaje || "No fue posible cargar las solicitudes.");
      }

      setSolicitudes((result.solicitudes as SolicitudAdmin[]) ?? []);
      setConteos(result.conteos as ConteoEstados);
      setAviso({ tipo: "exito", texto: "Listado actualizado." });
    } catch (e) {
      if (controlador.signal.aborted) return;
      setAviso({
        tipo: "error",
        texto:
          e instanceof ErrorPanel
            ? e.message
            : "Error de conexión. Revisa tu red e inténtalo de nuevo.",
      });
    } finally {
      if (controladorRef.current === controlador) {
        controladorRef.current = null;
        setRecargando(false);
      }
    }
  }

  async function cambiarEstado(solicitud: SolicitudAdmin, estado: Estado) {
    const { id, estado: anterior } = solicitud;
    if (estado === anterior || pendientes[id] || recargando) return;

    setPendientes((actual) => ({ ...actual, [id]: estado }));
    setAviso(null);

    try {
      const response = await fetch("/api/admin/solicitudes", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado }),
      });
      const result = await leerJson(response);

      if (!response.ok || !result?.ok) {
        if (gestionarAccesoDenegado(response.status)) return;
        throw new ErrorPanel(result?.mensaje || "No fue posible actualizar el estado.");
      }

      // Se aplica el estado que confirma el servidor, no el solicitado.
      const confirmado = (result.solicitud as { estado: Estado }).estado;
      const conteosServidor = result.conteos as ConteoEstados | null;

      setSolicitudes((actuales) =>
        actuales.map((s) => (s.id === id ? { ...s, estado: confirmado } : s)),
      );
      setConteos((actual) => conteosServidor ?? ajustarConteos(actual, anterior, confirmado));
      setAviso({
        tipo: "exito",
        texto: `Estado de «${solicitud.nombre}» actualizado a «${ETIQUETAS[confirmado]}».`,
      });
    } catch (e) {
      setAviso({
        tipo: "error",
        texto:
          e instanceof ErrorPanel
            ? e.message
            : "Error de conexión. El estado no se modificó.",
      });
    } finally {
      setPendientes((actual) => {
        const resto = { ...actual };
        delete resto[id];
        return resto;
      });
    }
  }

  async function cerrarSesion() {
    setCerrandoSesion(true);
    try {
      await createClient().auth.signOut();
    } catch {
      // Aunque falle la red, el cliente elimina la sesión local.
    }
    router.replace("/admin/login");
    router.refresh();
  }

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLocaleLowerCase("es");

    return solicitudes.filter((s) => {
      const coincideEstado = filtro === "todos" || s.estado === filtro;
      const coincideTexto =
        !q ||
        s.nombre.toLocaleLowerCase("es").includes(q) ||
        s.contacto.toLocaleLowerCase("es").includes(q) ||
        (s.descripcion ?? "").toLocaleLowerCase("es").includes(q);

      return coincideEstado && coincideTexto;
    });
  }, [solicitudes, filtro, busqueda]);

  const listadoTruncado = conteos.total > solicitudes.length;
  const filtrosActivos = filtro !== "todos" || busqueda.trim() !== "";

  const indicadores = [
    { label: "Total", value: conteos.total, color: "text-[#0B2340]", borde: "border-t-[#0B2340]" },
    { label: "Nuevas", value: conteos.nuevo, color: "text-[#028090]", borde: "border-t-[#028090]" },
    { label: "En revisión", value: conteos.en_revision, color: "text-[#8a6d1f]", borde: "border-t-[#C9A84C]" },
    { label: "Cerradas", value: conteos.cerrado, color: "text-[#01866a]", borde: "border-t-[#02C39A]" },
  ];

  function selectorEstado(s: SolicitudAdmin, compacto = false) {
    const pendiente = pendientes[s.id];
    return (
      <div className="flex items-center gap-2">
        <select
          aria-label={`Cambiar estado de la solicitud de ${s.nombre}`}
          disabled={Boolean(pendiente) || recargando}
          value={pendiente ?? s.estado}
          onChange={(e) => void cambiarEstado(s, e.target.value as Estado)}
          className={`rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#028090] focus:outline-none focus:ring-2 focus:ring-[#028090]/20 disabled:cursor-wait disabled:opacity-60 ${compacto ? "w-full" : ""}`}
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {ETIQUETAS[e]}
            </option>
          ))}
        </select>
        {pendiente && (
          <span className="text-xs text-slate-500" aria-hidden="true">
            Guardando…
          </span>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f6fa] text-slate-800">
      <EncabezadoPanel
        acciones={
          <>
            <button
              type="button"
              onClick={() => void recargar()}
              disabled={recargando || hayPendientes}
              className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#02C39A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {recargando ? "Actualizando…" : "Actualizar"}
            </button>
            <button
              type="button"
              onClick={() => void cerrarSesion()}
              disabled={cerrandoSesion}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0B2340] hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#02C39A] disabled:opacity-60"
            >
              {cerrandoSesion ? "Cerrando…" : "Cerrar sesión"}
            </button>
          </>
        }
      />

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <TituloBandeja />

        <div
          className={`grid grid-cols-2 gap-3 transition-opacity lg:grid-cols-4 ${recargando ? "opacity-60" : ""}`}
          aria-busy={recargando}
        >
          {indicadores.map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border border-t-4 border-slate-200 bg-white p-5 shadow-sm ${item.borde}`}
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {aviso && (
          <div
            role={aviso.tipo === "error" ? "alert" : "status"}
            className={`flex items-start justify-between gap-4 rounded-xl border p-4 text-sm ${
              aviso.tipo === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-[#02C39A]/40 bg-[#02C39A]/10 text-[#014d3e]"
            }`}
          >
            <p>{aviso.texto}</p>
            <button
              type="button"
              onClick={() => setAviso(null)}
              aria-label="Descartar mensaje"
              className="rounded px-2 font-semibold opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        )}

        <section
          aria-labelledby="titulo-listado"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <h3 id="titulo-listado" className="sr-only">
            Listado de solicitudes
          </h3>
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row">
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, contacto o descripción…"
              aria-label="Buscar solicitudes"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#028090] focus:outline-none focus:ring-2 focus:ring-[#028090]/20"
            />
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as "todos" | Estado)}
              aria-label="Filtrar por estado"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#028090] focus:outline-none focus:ring-2 focus:ring-[#028090]/20"
            >
              <option value="todos">Todos los estados</option>
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {ETIQUETAS[e]}
                </option>
              ))}
            </select>
          </div>

          {solicitudes.length === 0 ? (
            <p className="p-10 text-center text-sm text-slate-500">
              Aún no hay solicitudes registradas.
            </p>
          ) : visibles.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              <p>Ninguna solicitud coincide con la búsqueda o el filtro.</p>
              {filtrosActivos && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda("");
                    setFiltro("todos");
                  }}
                  className="mt-3 font-semibold text-[#028090] hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Móvil: tarjetas */}
              <ul className="divide-y divide-slate-100 md:hidden">
                {visibles.map((s) => (
                  <li key={s.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#0B2340]">{s.nombre}</p>
                        <p className="truncate text-sm text-slate-500">{s.contacto}</p>
                      </div>
                      <InsigniaEstado estado={s.estado} />
                    </div>
                    <p className="text-xs text-slate-500">
                      <time dateTime={s.fecha_registro} suppressHydrationWarning>
                        {formatearFecha(s.fecha_registro)}
                      </time>
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        {selectorEstado(s, true)}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSeleccionadaId(s.id)}
                        className="rounded-lg border border-[#028090]/40 px-3 py-2 text-sm font-semibold text-[#028090] hover:bg-[#028090]/5"
                      >
                        Ver caso
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Escritorio: tabla */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th scope="col" className="px-5 py-4 font-semibold">Solicitante</th>
                      <th scope="col" className="px-5 py-4 font-semibold">Contacto</th>
                      <th scope="col" className="px-5 py-4 font-semibold">Fecha</th>
                      <th scope="col" className="px-5 py-4 font-semibold">Estado</th>
                      <th scope="col" className="px-5 py-4 font-semibold">Seguimiento</th>
                      <th scope="col" className="px-5 py-4 font-semibold">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibles.map((s) => (
                      <tr key={s.id} className="align-middle hover:bg-slate-50/70">
                        <td className="max-w-[16rem] px-5 py-4">
                          <p className="truncate font-semibold text-[#0B2340]">{s.nombre}</p>
                        </td>
                        <td className="max-w-[16rem] px-5 py-4">
                          <p className="truncate text-slate-600">{s.contacto}</p>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          <time dateTime={s.fecha_registro} suppressHydrationWarning>
                            {formatearFecha(s.fecha_registro)}
                          </time>
                        </td>
                        <td className="px-5 py-4">
                          <InsigniaEstado estado={s.estado} />
                        </td>
                        <td className="px-5 py-4">
                          {selectorEstado(s)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSeleccionadaId(s.id)}
                            className="whitespace-nowrap font-semibold text-[#028090] hover:underline"
                          >
                            Ver caso
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="space-y-1 border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
            <p>
              Mostrando {visibles.length} de {solicitudes.length} solicitudes cargadas ·{" "}
              {conteos.total} en total.
            </p>
            {listadoTruncado && (
              <p className="font-medium text-[#8a6d1f]">
                Se cargan solo las {inicial.limite} solicitudes más recientes. La búsqueda y
                los filtros aplican únicamente a ellas; los indicadores sí cuentan todas.
              </p>
            )}
          </div>
        </section>
      </section>

      <dialog
        ref={dialogoRef}
        aria-labelledby="detalle-titulo"
        onClose={() => setSeleccionadaId(null)}
        onClick={(e) => {
          // Clic en el fondo (fuera del contenido) cierra el detalle.
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-slate-950/50"
      >
        {seleccionada && (
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-[#028090]">
                  Detalle privado
                </p>
                <h2
                  id="detalle-titulo"
                  className="mt-2 break-words text-2xl font-bold text-[#0B2340]"
                >
                  {seleccionada.nombre}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => dialogoRef.current?.close()}
                aria-label="Cerrar detalle"
                className="rounded-lg px-3 py-2 text-xl leading-none text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">Contacto</dt>
                <dd className="mt-1 break-words text-slate-800">{seleccionada.contacto}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Fecha de recepción</dt>
                <dd className="mt-1 text-slate-800">
                  <time dateTime={seleccionada.fecha_registro} suppressHydrationWarning>
                    {formatearFecha(seleccionada.fecha_registro)}
                  </time>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Descripción del caso</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words leading-6 text-slate-800">
                  {seleccionada.descripcion || "No se proporcionó una descripción."}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Consentimiento</dt>
                <dd className="mt-1 text-slate-800">
                  {seleccionada.consentimiento ? "Registrado" : "No registrado"} · versión{" "}
                  {seleccionada.version_autorizacion}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-500">Estado actual</dt>
                <dd className="mt-1">
                  <InsigniaEstado estado={seleccionada.estado} />
                </dd>
              </div>
            </dl>

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold text-slate-500">Cambiar estado</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {ESTADOS.map((e) => {
                  const actual = seleccionada.estado === e;
                  const guardando = pendientes[seleccionada.id] === e;
                  return (
                    <button
                      key={e}
                      type="button"
                      aria-pressed={actual}
                      disabled={actual || Boolean(pendientes[seleccionada.id]) || recargando}
                      onClick={() => void cambiarEstado(seleccionada, e)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${
                        actual
                          ? "bg-[#0B2340] text-white"
                          : "border border-slate-300 text-[#0B2340] hover:bg-slate-50 disabled:opacity-50"
                      }`}
                    >
                      {guardando ? "Guardando…" : ETIQUETAS[e]}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => dialogoRef.current?.close()}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </dialog>
    </main>
  );
}

function InsigniaEstado({ estado }: { estado: Estado }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${ESTILO_ESTADO[estado]}`}
    >
      {ETIQUETAS[estado]}
    </span>
  );
}
