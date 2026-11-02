import Image from "next/image";
import Link from "next/link";

const WHATSAPP_URL =
  "https://wa.me/573123797011?text=Hola%2C%20podr%C3%ADas%20brindarme%20m%C3%A1s%20informaci%C3%B3n";
const AUTORIZAR_URL = "/politica-de-datos#autorizar";

const situaciones = [
  {
    titulo: "Contactan a tus familiares y amigos",
    texto:
      "Llaman o escriben a personas de tu lista de contactos para presionarte por una deuda.",
  },
  {
    titulo: "Mensajes con amenazas o insultos",
    texto:
      "Cobranza agresiva, a cualquier hora, que afecta tu tranquilidad y tu entorno.",
  },
  {
    titulo: "Usan tu información sin control",
    texto:
      "Una app de crédito no debería tener acceso a toda tu vida: fotos, contactos o datos que nunca debiste ceder.",
  },
];

const servicios = [
  {
    titulo: "Orientación sobre tus datos",
    texto:
      "Te explicamos qué información personal puede estar en juego y qué derechos tienes como titular.",
  },
  {
    titulo: "Cómo conservar evidencias",
    texto:
      "Te guiamos para guardar mensajes, llamadas y capturas de forma ordenada y útil.",
  },
  {
    titulo: "Protección de tu información",
    texto:
      "Recomendaciones prácticas para cerrar accesos y reducir la exposición de tus datos.",
  },
  {
    titulo: "Tus opciones, explicadas",
    texto:
      "Te contamos, en lenguaje claro, qué caminos existen y ante qué entidades se puede reportar.",
  },
  {
    titulo: "Acompañamiento",
    texto:
      "Una persona real te atiende por WhatsApp para que no enfrentes la situación a solas.",
  },
  {
    titulo: "Sin presión ni promesas falsas",
    texto:
      "Te decimos con honestidad qué podemos hacer y qué no. Tú decides cada paso.",
  },
];

const pasos = [
  {
    n: "01",
    titulo: "Escríbenos por WhatsApp",
    texto:
      "Cuéntanos de forma breve qué está pasando. No necesitas apps ni crear cuentas.",
  },
  {
    n: "02",
    titulo: "Autorizas el tratamiento de tus datos",
    texto:
      "Te compartimos el enlace de nuestra política y el formulario donde registras tu autorización libre e informada.",
  },
  {
    n: "03",
    titulo: "Conversamos sobre tu caso",
    texto:
      "Revisamos tu situación y te explicamos tus opciones y los siguientes pasos.",
  },
  {
    n: "04",
    titulo: "Te acompañamos",
    texto:
      "Te orientamos para organizar evidencias, proteger tu información y avanzar con tranquilidad.",
  },
];

const preguntas = [
  {
    p: "¿La orientación tiene algún costo?",
    r: "La orientación inicial no tiene costo. Nuestro objetivo es ayudarte a entender tu situación, organizar la información y conocer las opciones que tienes frente al acoso de una app de crédito digital.",
  },
  {
    p: "¿Qué es y qué no es Dato Seguro Digital?",
    r: "Somos un servicio de orientación para personas afectadas por el acoso de aplicaciones de préstamos digitales ilegales. No somos una entidad del Estado, un despacho de abogados ni hacemos parte de ninguna app de crédito. No gestionamos pagos ni negociamos deudas en tu nombre.",
  },
  {
    p: "¿Pueden detener las llamadas o mensajes de acoso?",
    r: "No podemos detener directamente las llamadas o mensajes, pero te orientamos sobre tus derechos, cómo conservar evidencias y qué opciones existen para reportar la situación ante las entidades competentes.",
  },
  {
    p: "¿Por qué me piden autorizar el tratamiento de mis datos?",
    r: "Porque la ley colombiana (Ley 1581 de 2012) exige tu autorización previa, expresa e informada antes de tratar tus datos personales. Es una decisión tuya: puedes leer la política completa antes de autorizar.",
  },
  {
    p: "¿Qué pasa con la información que comparto?",
    r: "Se usa únicamente para orientarte, de acuerdo con la autorización que das y con nuestra política de tratamiento de datos. No se vende ni se comparte con terceros para fines distintos a los informados.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-[#0B2340]">
      {/* HEADER */}
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
            <a href="#que-hacemos" className="transition hover:text-[#02C39A]">
              Qué hacemos
            </a>
            <a href="#como-funciona" className="transition hover:text-[#02C39A]">
              Cómo funciona
            </a>
            <a
              href="#preguntas-frecuentes"
              className="transition hover:text-[#02C39A]"
            >
              Preguntas frecuentes
            </a>
            <Link
              href="/politica-de-datos"
              className="transition hover:text-[#02C39A]"
            >
              Política de datos
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#02C39A] px-5 py-3 text-[#0B2340] transition hover:bg-[#02b38b]"
            >
              Escríbenos
            </a>
          </nav>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#02C39A] px-4 py-2.5 text-sm font-bold text-[#0B2340] md:hidden"
          >
            Escríbenos
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative overflow-hidden bg-[#0B2340]">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#02C39A]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#028090]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#02C39A]/30 bg-[#02C39A]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#02C39A]">
              <span className="h-2 w-2 rounded-full bg-[#02C39A]" />
              Orientación en protección de datos
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              ¿Una app de crédito te está acosando?
              <span className="block text-[#02C39A]">Hay una ruta.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              En Dato Seguro Digital te orientamos para proteger tus datos,
              conservar las evidencias correctas y conocer las opciones que
              tienes frente al acoso digital y la cobranza agresiva.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-7 py-4 text-sm font-black text-white transition hover:brightness-95"
              >
                Escríbenos por WhatsApp
              </a>
              <Link
                href={AUTORIZAR_URL}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Autorizar el tratamiento de mis datos
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                Orientación inicial sin costo
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                Atención por WhatsApp
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                Tú decides cada paso
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-[#02C39A]/10 blur-3xl" />
            <div className="relative flex w-full max-w-md flex-col items-center rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border border-[#02C39A]/20 bg-[#02C39A]/5 p-5">
                <Image
                  src="/icono.png"
                  alt="Dato Seguro Digital"
                  width={220}
                  height={220}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-7 text-2xl font-black text-white">
                Protegemos tus datos,
                <span className="block text-[#02C39A]">
                  protegemos tu tranquilidad.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SITUACIONES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
              ¿Te suena familiar?
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Una deuda no debería convertirse en acoso.
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              Algunas aplicaciones de préstamos digitales no reguladas recurren
              a prácticas de cobranza agresivas. Si estás viviendo algo así, no
              estás solo y no tienes que decidir bajo presión.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {situaciones.map((s) => (
              <div
                key={s.titulo}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-7"
              >
                <h3 className="text-lg font-black">{s.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {s.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUE HACEMOS */}
      <section id="que-hacemos" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
              Qué hacemos
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Te ayudamos a recuperar el control.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((s) => (
              <div
                key={s.titulo}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#02C39A]/15 text-[#028090]">
                  ✓
                </div>
                <h3 className="mt-5 text-lg font-black">{s.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {s.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
              Cómo funciona
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Un proceso simple, por WhatsApp.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p) => (
              <div
                key={p.n}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2340] text-lg font-black text-[#02C39A]">
                  {p.n}
                </div>
                <h3 className="mt-6 text-lg font-black">{p.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {p.texto}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={AUTORIZAR_URL}
              className="text-sm font-bold text-[#028090] underline underline-offset-4 hover:text-[#02C39A]"
            >
              Ir a la política y al formulario de autorización
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSPARENCIA */}
      <section className="bg-[#0B2340] py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
              Transparencia
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Claridad sobre lo que hacemos y lo que nunca haremos.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-lg font-black text-[#02C39A]">
                Nunca te pediremos
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>Contraseñas ni claves de aplicaciones financieras.</li>
                <li>Códigos SMS o de verificación de WhatsApp.</li>
                <li>PIN, claves bancarias ni datos para acceder a tus cuentas.</li>
                <li>Pagos por adelantado a cambio de “detener” el acoso.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-lg font-black text-[#02C39A]">
                Lo que sí hacemos
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>Explicarte tus derechos y opciones en lenguaje claro.</li>
                <li>Orientarte para conservar y organizar evidencias.</li>
                <li>Pedir tu autorización antes de tratar tus datos.</li>
                <li>Decirte con honestidad qué podemos y qué no podemos hacer.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas-frecuentes" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#02C39A]">
              Preguntas frecuentes
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Resolvemos tus dudas.
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {preguntas.map((q) => (
              <details
                key={q.p}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 open:bg-white open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#0B2340]">
                  {q.p}
                  <span className="shrink-0 text-xl text-[#02C39A] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-6 text-slate-600">{q.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
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
            No tienes que enfrentarlo solo.
            <span className="block text-[#02C39A]">Escríbenos hoy.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Cuéntanos qué está pasando y te explicamos cómo podemos orientarte.
            Si ya hablaste con nosotros, usa el enlace para autorizar el
            tratamiento de tus datos.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-[#25D366] px-7 py-4 text-sm font-black text-white transition hover:brightness-95"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href={AUTORIZAR_URL}
              className="inline-flex rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Autorizar tratamiento de datos
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#081a30]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
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

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                Información
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <a href="#que-hacemos" className="block transition hover:text-[#02C39A]">
                  Qué hacemos
                </a>
                <a href="#como-funciona" className="block transition hover:text-[#02C39A]">
                  Cómo funciona
                </a>
                <a href="#preguntas-frecuentes" className="block transition hover:text-[#02C39A]">
                  Preguntas frecuentes
                </a>
                <Link href="/politica-de-datos" className="block transition hover:text-[#02C39A]">
                  Política de tratamiento de datos
                </Link>
                <Link href={AUTORIZAR_URL} className="block transition hover:text-[#02C39A]">
                  Autorización de datos
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-white">
                Contacto y responsable
              </h3>
              <div className="mt-4 space-y-2 text-sm leading-6 text-slate-400">
                <p><strong className="text-slate-300">Responsable:</strong> Anyi Stefania Toro Carvajal (persona natural)</p>
                <p><strong className="text-slate-300">Establecimiento de comercio:</strong> Dato Seguro Digital · Matrícula mercantil 435570</p>
                <p><strong className="text-slate-300">NIT:</strong> 1007499214-8</p>
                <p><strong className="text-slate-300">Domicilio:</strong> Neiva, Huila</p>
                <p><strong className="text-slate-300">Correo:</strong> <a className="hover:text-[#02C39A]" href="mailto:dsegurodigital@gmail.com">dsegurodigital@gmail.com</a></p>
                <p><strong className="text-slate-300">WhatsApp:</strong> <a className="hover:text-[#02C39A]" href="https://wa.me/573123797011">+57 312 379 7011</a></p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-3 text-xs leading-5 text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>© 2026 Dato Seguro Digital. Todos los derechos reservados.</p>
              <p>Protección de datos · Transparencia · Orientación</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
