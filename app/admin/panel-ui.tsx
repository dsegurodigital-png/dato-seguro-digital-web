import type { ReactNode } from "react";
import Image from "next/image";

/** Piezas visuales del panel sin estado, reutilizables en servidor y cliente. */

export function EncabezadoPanel({ acciones }: { acciones?: ReactNode }) {
  return (
    <header className="border-b border-[#0B2340]/10 bg-[#0B2340] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1.5"
          >
            <Image
              src="/icono.png"
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#02C39A]">
              Dato Seguro Digital
            </p>
            <h1 className="text-lg font-bold sm:text-xl">Centro de gestión</h1>
          </div>
        </div>
        {acciones && <div className="flex flex-wrap items-center gap-2">{acciones}</div>}
      </div>
    </header>
  );
}

const INDICADORES = ["Total", "Nuevas", "En revisión", "Cerradas"];

export function PanelCargando() {
  return (
    <main className="min-h-screen bg-[#f3f6fa] text-slate-800" aria-busy="true">
      <EncabezadoPanel />
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <TituloBandeja />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {INDICADORES.map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-300">—</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p role="status" className="text-sm text-slate-500">
            Verificando acceso y cargando solicitudes…
          </p>
          <div className="mx-auto mt-6 max-w-3xl space-y-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function PanelError({ mensaje }: { mensaje: string }) {
  return (
    <main className="min-h-screen bg-[#f3f6fa] text-slate-800">
      <EncabezadoPanel />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p className="font-semibold">No pudimos cargar el panel.</p>
          <p className="mt-1">{mensaje}</p>
          {/* Recarga completa: vuelve a verificar la sesión en el servidor. */}
          <a
            href="/admin"
            className="mt-4 inline-flex rounded-xl bg-[#0B2340] px-4 py-2 font-semibold text-white hover:bg-[#12365d]"
          >
            Reintentar
          </a>
        </div>
      </section>
    </main>
  );
}

export function TituloBandeja() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0B2340]">Bandeja de solicitudes</h2>
      <p className="mt-1 text-sm text-slate-500">
        Consulta y seguimiento privado de los casos recibidos.
      </p>
    </div>
  );
}
