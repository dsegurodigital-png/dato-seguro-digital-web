"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

const FORMULARIO_HABILITADO = true;
const VERSION_AUTORIZACION = "web-consent-v1.0";

export default function Home() {
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error" | "">("");

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
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-[#0B2340]">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="sticky top-0 z-50 h-20 overflow-hidden border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">

          <a href="#inicio" className="flex items-center">
            <Image
              src="/logo-horizontal.png"
              alt="Dato Seguro Digital"
              width={250}
              height={70}
              priority
              className="h-auto w-[190px] sm:w-[220px]"
            />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a
              href="#como-funciona"
              className="transition hover:text-[#02C39A]"
            >
              Cómo funciona
            </a>

            <a
              href="#privacidad"
              className="transition hover:text-[#02C39A]"
            >
              Privacidad
            </a>

            <a
              href="#autorizacion"
              className="rounded-full bg-[#02C39A] px-5 py-3 text-[#0B2340] transition hover:bg-[#02b38b]"
            >
              Autorizar y continuar
            </a>
          </nav>

          <a
            href="#autorizacion"
            className="rounded-full bg-[#02C39A] px-4 py-2.5 text-sm font-bold text-[#0B2340] md:hidden"
          >
            Continuar
          </a>

        </div>
      </header>


      {/* =========================================================
          HERO
      ========================================================= */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-[#0B2340]"
      >
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#02C39A]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#028090]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* Hero text */}
          <div className="max-w-2xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#02C39A]/30 bg-[#02C39A]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#02C39A]">
              <span className="h-2 w-2 rounded-full bg-[#02C39A]" />
              Proceso de autorización
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Autorización de{" "}
              <span className="block text-[#02C39A]">
                Tratamiento de Datos Personales
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Antes de compartir información sobre tu situación, queremos
              explicarte de manera clara cómo trataremos tus datos y obtener
              tu autorización.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                Información clara
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                Tú decides
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                Tratamiento responsable
              </div>

            </div>

          </div>


          {/* Hero image */}
          <div className="relative flex min-h-[380px] items-center justify-center lg:min-h-[500px]">

            <div className="absolute h-80 w-80 rounded-full bg-[#02C39A]/10 blur-3xl" />

            <Image
              src="/hero-autorizacion.png"
              alt="Dato Seguro Digital - Autorización y protección de datos"
              width={900}
              height={900}
              priority
              className="relative w-full max-w-[620px] object-contain"
            />

          </div>

        </div>
      </section>


      {/* =========================================================
          TRUST STRIP
      ========================================================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-6 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:px-8">

          <div className="px-5 py-7">
            <div className="mb-2 text-sm font-black uppercase tracking-wide text-[#02C39A]">
              Te orientamos
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Te explicamos el proceso de forma clara antes de solicitar
              información.
            </p>
          </div>

          <div className="px-5 py-7">
            <div className="mb-2 text-sm font-black uppercase tracking-wide text-[#02C39A]">
              Organizamos
            </div>
            <p className="text-sm leading-6 text-slate-600">
              La información que decides compartir se organiza para facilitar
              el proceso de orientación.
            </p>
          </div>

          <div className="px-5 py-7">
            <div className="mb-2 text-sm font-black uppercase tracking-wide text-[#02C39A]">
              Protegemos
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Tratamos tu información con responsabilidad y bajo las
              finalidades informadas.
            </p>
          </div>

          <div className="px-5 py-7">
            <div className="mb-2 text-sm font-black uppercase tracking-wide text-[#02C39A]">
              Te acompañamos
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Durante el proceso de orientación frente a situaciones de
              acoso digital y uso indebido de información personal.
            </p>
          </div>

        </div>
      </section>


      {/* =========================================================
          COMO FUNCIONA
      ========================================================= */}
      <section
        id="como-funciona"
        className="bg-slate-50 py-20"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
              Antes de autorizar
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B2340] sm:text-4xl">
              Queremos que tengas claro qué ocurrirá con tu información.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              En Dato Seguro Digital creemos que entregar información personal
              debe ser una decisión informada. Por eso, antes de continuar,
              podrás conocer qué datos solicitamos, para qué pueden ser
              utilizados y cuáles son tus derechos.
            </p>

          </div>


          <div className="mt-14 grid gap-6 md:grid-cols-3">

            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2340] text-lg font-black text-[#02C39A]">
                01
              </div>

              <h3 className="mt-6 text-xl font-black text-[#0B2340]">
                Conoces el proceso
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Te informamos qué información puede ser solicitada y cuáles
                son las finalidades del tratamiento.
              </p>

            </div>


            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2340] text-lg font-black text-[#02C39A]">
                02
              </div>

              <h3 className="mt-6 text-xl font-black text-[#0B2340]">
                Tú decides
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                La autorización debe ser una decisión libre, informada y
                relacionada con las finalidades explicadas.
              </p>

            </div>


            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2340] text-lg font-black text-[#02C39A]">
                03
              </div>

              <h3 className="mt-6 text-xl font-black text-[#0B2340]">
                Continúas con orientación
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Una vez registrada la autorización, podremos continuar con
                el proceso correspondiente.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================================
          INFORMACION Y TRANSPARENCIA
      ========================================================= */}
      <section className="bg-white py-20">

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">

         {/* Brand visual */}
<div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#0B2340] p-8 shadow-xl sm:p-12">

  {/* Glow */}
  <div className="absolute h-72 w-72 rounded-full bg-[#02C39A]/10 blur-3xl" />

  {/* Decorative rings */}
  <div className="absolute h-80 w-80 rounded-full border border-[#02C39A]/10" />
  <div className="absolute h-64 w-64 rounded-full border border-[#02C39A]/10" />

  <div className="relative z-10 flex flex-col items-center text-center">

    {/* Official icon */}
    <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-[#02C39A]/20 bg-[#02C39A]/5 p-5 shadow-2xl">

  <Image
    src="/icono.png"
    alt="Dato Seguro Digital"
    width={220}
    height={220}
    className="h-full w-full object-contain"
  />

</div>

    {/* Brand */}
    <div className="mt-7">

      <div className="text-2xl font-black tracking-tight text-white">
        Dato Seguro
        <span className="text-[#02C39A]"> Digital</span>
      </div>

      <div className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
        Protegemos tus datos
      </div>

    </div>

    {/* Principles */}
    <div className="mt-8 flex flex-wrap justify-center gap-2">

      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
        Información clara
      </span>

      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
        Tú decides
      </span>

      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
        Tratamiento responsable
      </span>

    </div>

  </div>

</div>


          {/* Text */}
          <div>

            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
              Transparencia
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B2340] sm:text-4xl">
              Tus datos deben tener un propósito claro.
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Antes de compartir información sobre tu situación, queremos
              que conozcas cómo será utilizada dentro del proceso de
              orientación de Dato Seguro Digital.
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#02C39A]/15 text-[#028090]">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-[#0B2340]">
                    Información necesaria
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Solicitaremos información relacionada con el proceso y
                    únicamente de acuerdo con las finalidades informadas.
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#02C39A]/15 text-[#028090]">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-[#0B2340]">
                    Tú conservas tus derechos
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Puedes ejercer los derechos que reconoce la normativa
                    colombiana sobre protección de datos personales.
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#02C39A]/15 text-[#028090]">
                  ✓
                </div>

                <div>
                  <h3 className="font-bold text-[#0B2340]">
                    No compartas información innecesaria
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    No envíes contraseñas, códigos de verificación, claves
                    bancarias, PIN ni información financiera de acceso.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          AUTORIZACION
      ========================================================= */}
      <section
        id="autorizacion"
        className="bg-slate-100 py-20"
      >

        <div className="mx-auto max-w-4xl px-6 lg:px-8">

          <div className="mb-10 text-center">

            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
              Autorización
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B2340] sm:text-4xl">
              Autoriza el tratamiento de tus datos
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Completa la información solicitada después de revisar la
              Política de Tratamiento de Datos Personales.
            </p>

          </div>


          {/* FORM */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <h3 className="text-xl font-black text-[#0B2340]">Información de contacto</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Estamos preparando el canal de recepción. El formulario permanece deshabilitado mientras completamos las revisiones de seguridad y privacidad. No ingreses datos personales reales todavía.
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

                <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                  El envío público permanece deshabilitado mientras completamos las verificaciones de seguridad, privacidad y tratamiento de datos.
                </p>
              </div>
            </form>

          </div>

        </div>

      </section>


      {/* =========================================================
          POLITICA
      ========================================================= */}
      <section
        id="privacidad"
        className="bg-white py-20"
      >

        <div className="mx-auto max-w-5xl px-6 lg:px-8">

          <div className="rounded-[2rem] border border-slate-200 bg-[#0B2340] p-8 shadow-xl sm:p-12">

            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">

              <div>

                <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
                  Privacidad
                </span>

                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  Política de Tratamiento de Datos
                </h2>

                <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                  Consulta el borrador de la política y conoce los criterios propuestos para
                  el tratamiento de datos personales. La versión definitiva se publicará
                  después de validar la identidad del responsable y el flujo real de información.
                </p>

              </div>


              <div className="flex md:justify-end">

                {/* 
                  IMPORTANTE:
                  Reemplazar "#" por la URL real de la política
                  cuando publiquemos el documento definitivo.
                */}

                <a
                  href="/politica-de-datos"
                  className="inline-flex items-center justify-center rounded-full bg-[#02C39A] px-6 py-3.5 text-sm font-black text-[#0B2340] transition hover:bg-[#02b38b]"
                >
                  Consultar política
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          INFORMACION IMPORTANTE
      ========================================================= */}
      <section className="bg-slate-50 py-16">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-7">

              <div className="text-2xl">🛡️</div>

              <h3 className="mt-4 text-lg font-black text-[#0B2340]">
                Tratamiento responsable
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                La información personal debe ser tratada de acuerdo con las
                finalidades informadas y la normativa aplicable.
              </p>

            </div>


            <div className="rounded-3xl border border-slate-200 bg-white p-7">

              <div className="text-2xl">🔐</div>

              <h3 className="mt-4 text-lg font-black text-[#0B2340]">
                No compartas claves
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Dato Seguro Digital nunca necesita tus contraseñas, códigos
                de acceso, PIN o claves bancarias para orientarte.
              </p>

            </div>


            <div className="rounded-3xl border border-slate-200 bg-white p-7">

              <div className="text-2xl">📋</div>

              <h3 className="mt-4 text-lg font-black text-[#0B2340]">
                Conserva tus evidencias
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Si recibes llamadas o mensajes relacionados con una situación
                de acoso digital, conserva las evidencias originales cuando
                sea posible.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CONTACTO / CTA FINAL
      ========================================================= */}
      <section className="bg-[#0B2340] py-20">

        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#02C39A]">

            <Image
              src="/icono.png"
              alt=""
              width={42}
              height={42}
              className="h-10 w-10 object-contain"
            />

          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Protegemos tus datos.
            <span className="block text-[#02C39A]">
              Protegemos tu tranquilidad.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Si necesitas orientación frente a situaciones de acoso digital,
            uso indebido de información personal o cobranza agresiva
            relacionada con aplicaciones de préstamos digitales, podemos
            ayudarte a organizar la información y conocer tus opciones.
          </p>

          <a
            href="#autorizacion"
            className="mt-8 inline-flex rounded-full bg-[#02C39A] px-7 py-4 text-sm font-black uppercase tracking-wide text-[#0B2340] transition hover:bg-[#02b38b]"
          >
            Iniciar proceso

          </a>

        </div>

      </section>


      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/10 bg-[#081a30]">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div className="lg:col-span-2">

              <Image
                src="/logo-horizontal.png"
                alt="Dato Seguro Digital"
                width={260}
                height={70}
                className="h-auto w-[210px]"
              />

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
                Orientación para proteger tus datos y recuperar el control
                frente a situaciones de acoso digital y uso indebido de
                información personal.
              </p>

            </div>


            {/* Links */}
            <div>

              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                Información
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-400">

                <a
                  href="#como-funciona"
                  className="block transition hover:text-[#02C39A]"
                >
                  Cómo funciona
                </a>

                <a
                  href="/politica-de-datos"
                  className="block transition hover:text-[#02C39A]"
                >
                  Política de privacidad
                </a>

                <a
                  href="#autorizacion"
                  className="block transition hover:text-[#02C39A]"
                >
                  Autorización
                </a>

              </div>

            </div>


            {/* Legal */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                Contacto y responsable
              </h3>
              <div className="mt-4 space-y-2 text-sm leading-6 text-slate-400">
                <p><strong className="text-slate-300">Nombre o razón social legal:</strong> Pendiente de confirmar</p>
                <p><strong className="text-slate-300">Tipo de responsable:</strong> Pendiente de confirmar</p>
                <p><strong className="text-slate-300">NIT:</strong> Pendiente de confirmar</p>
                <p><strong className="text-slate-300">Dirección informada:</strong> Calle 18 No. 50C-34</p>
                <p><strong className="text-slate-300">Correo:</strong> <a className="hover:text-[#02C39A]" href="mailto:dsegurodigital@gmail.com">dsegurodigital@gmail.com</a></p>
                <p><strong className="text-slate-300">WhatsApp:</strong> <a className="hover:text-[#02C39A]" href="https://wa.me/573123797011">+57 312 379 7011</a></p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">

            <div className="flex flex-col gap-3 text-xs leading-5 text-slate-500 md:flex-row md:items-center md:justify-between">

              <p>
                © 2026 Dato Seguro Digital. Todos los derechos reservados.
              </p>

              <p>
                Protección de datos · Transparencia · Orientación
              </p>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}
