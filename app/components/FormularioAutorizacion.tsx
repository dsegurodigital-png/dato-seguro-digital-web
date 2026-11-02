"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const FORMULARIO_HABILITADO = true;
const VERSION_AUTORIZACION = "web-consent-v1.0";

export default function FormularioAutorizacion() {
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error" | "">("");
  const [falloEnvio, setFalloEnvio] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!FORMULARIO_HABILITADO || enviando) return;

    const form = event.currentTarget;
    const datos = new FormData(form);
    const nombre = String(datos.get("nombre") ?? "").trim();
    const contacto = String(datos.get("contacto") ?? "").trim();
    const descripcion = String(datos.get("descripcion") ?? "").trim();
    const consentimiento = datos.get("autorizacion") === "on";

    setMensaje("");
    setTipoMensaje("");
    setFalloEnvio(false);

    if (nombre.length < 2 || nombre.length > 100) {
      setMensaje("Ingresa un nombre válido (entre 2 y 100 caracteres).");
      setTipoMensaje("error");
      return;
    }

    if (contacto.length < 5 || contacto.length > 150) {
      setMensaje("Revisa tu celular o correo de contacto.");
      setTipoMensaje("error");
      return;
    }

    if (descripcion.length > 1500) {
      setMensaje("La descripción no puede superar los 1.500 caracteres.");
      setTipoMensaje("error");
      return;
    }

    if (!consentimiento) {
      setMensaje("Debes aceptar la autorización para continuar.");
      setTipoMensaje("error");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          contacto,
          descripcion,
          consentimiento: true,
          version_autorizacion: VERSION_AUTORIZACION,
        }),
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) {
        throw new Error(resultado.mensaje || "No fue posible registrar la solicitud.");
      }

      setMensaje("Tu solicitud fue recibida correctamente.");
      setTipoMensaje("exito");
      form.reset();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Ocurrió un error. Inténtalo más tarde.");
      setTipoMensaje("error");
      setFalloEnvio(true);
    } finally {
      setEnviando(false);
    }
  }

  return (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <h3 className="text-xl font-black text-[#0B2340]">Información de contacto</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Comparte solo los datos necesarios para que podamos contactarte. No envíes contraseñas, códigos de verificación, PIN ni claves bancarias.
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nombre" className="mb-2 block text-sm font-bold text-[#0B2340]">Nombre completo *</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                      required
                      disabled={!FORMULARIO_HABILITADO || enviando}
                      placeholder="Ingresa tu nombre completo"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#02C39A] focus:ring-4 focus:ring-[#02C39A]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="contacto" className="mb-2 block text-sm font-bold text-[#0B2340]">Celular o correo electrónico *</label>
                    <input
                      id="contacto"
                      name="contacto"
                      type="text"
                      minLength={5}
                      maxLength={150}
                      autoComplete="email"
                      required
                      disabled={!FORMULARIO_HABILITADO || enviando}
                      placeholder="Celular o correo de contacto"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#02C39A] focus:ring-4 focus:ring-[#02C39A]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="descripcion" className="mb-2 block text-sm font-bold text-[#0B2340]">Cuéntanos brevemente tu situación (opcional)</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    maxLength={1500}
                    disabled={!FORMULARIO_HABILITADO || enviando}
                    placeholder="No incluyas contraseñas, códigos de acceso ni información financiera sensible."
                    className="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#02C39A] focus:ring-4 focus:ring-[#02C39A]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                  <p className="mt-2 text-xs leading-5 text-slate-500">Máximo 1.500 caracteres. Comparte solo la información necesaria.</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-xl font-black text-[#0B2340]">Autorización de tratamiento</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Lee la política antes de registrar tu autorización.</p>

                <div className="mt-6 rounded-2xl border border-[#02C39A]/20 bg-[#02C39A]/5 p-5">
                  <div className="flex items-start gap-4">
                    <input
                      id="autorizacion"
                      name="autorizacion"
                      type="checkbox"
                      required
                      disabled={!FORMULARIO_HABILITADO || enviando}
                      className="mt-1 h-5 w-5 rounded border-slate-300 accent-[#02C39A] disabled:cursor-not-allowed"
                    />
                    <label htmlFor="autorizacion" className="text-sm leading-6 text-slate-700">
                      Declaro que he leído la{" "}
                      <Link href="/politica-de-datos" className="font-bold text-[#028090] underline underline-offset-2">
                        Política de Tratamiento de Datos Personales
                      </Link>{" "}
                      de Dato Seguro Digital y autorizo, de manera libre, previa, expresa e informada, el tratamiento de mis datos personales para las finalidades allí informadas.
                    </label>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-bold text-[#0B2340]">Información sensible</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    No es necesario que compartas datos sensibles para iniciar. Si excepcionalmente fueran necesarios, te explicaremos antes cuáles son, para qué se requieren y las condiciones aplicables.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm font-bold text-[#0B2340]">🔐 Importante</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Nunca compartas por este formulario contraseñas, códigos SMS, códigos de WhatsApp, claves bancarias, PIN, contraseñas de aplicaciones financieras o datos que permitan acceder a tus cuentas.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!FORMULARIO_HABILITADO || enviando}
                  className="mt-7 w-full rounded-2xl bg-slate-300 px-6 py-4 text-sm font-black uppercase tracking-wide text-slate-600 disabled:cursor-not-allowed enabled:bg-[#02C39A] enabled:text-[#0B2340]"
                >
                  {enviando ? "Enviando solicitud…" : FORMULARIO_HABILITADO ? "Enviar solicitud" : "Formulario aún no habilitado"}
                </button>

                {mensaje && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-4 rounded-xl p-4 text-sm ${tipoMensaje === "exito" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
                  >
                    {mensaje}
                  </p>
                )}

                {falloEnvio && (
                  <a
                    href="https://wa.me/573123797011?text=Hola%2C%20intent%C3%A9%20enviar%20el%20formulario%20de%20Dato%20Seguro%20Digital%20y%20no%20funcion%C3%B3.%20Necesito%20orientaci%C3%B3n."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#25D366] px-4 py-3 text-center text-sm font-semibold text-white transition hover:brightness-95"
                  >
                    Escríbenos por WhatsApp y te atendemos ahí
                  </a>
                )}

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  Al enviar, tu autorización queda registrada junto con la versión de la política que aceptaste.
                </p>
              </div>
            </form>

          </div>
  );
}
