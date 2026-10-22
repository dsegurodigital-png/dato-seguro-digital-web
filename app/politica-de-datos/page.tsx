import Link from "next/link";

export default function PoliticaDeDatos() {
  return (
    <main className="min-h-screen bg-slate-50 text-[#0B2340]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-bold text-[#0B2340] hover:text-[#028090]">Dato Seguro Digital</Link>
          <Link href="/" className="text-sm font-semibold text-[#028090] underline">Volver al inicio</Link>
        </div>
      </header>
      <article className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#028090]">Privacidad</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Política de Tratamiento de Datos Personales</h1>
        <p className="mt-4 leading-7 text-slate-600">Versión 1.1 — vigente desde el 22 de octubre de 2026.</p>

        <section className="mt-10 space-y-8 leading-7 text-slate-700">
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">1. Identificación del responsable</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Responsable del tratamiento: Anyi Stefania Toro Carvajal, persona natural comerciante.</li>
              <li>Establecimiento de comercio: Dato Seguro Digital (matrícula mercantil No. 435570, Cámara de Comercio del Huila).</li>
              <li>NIT: 1007499214-8 (matrícula mercantil de la persona natural No. 435569).</li>
              <li>Domicilio: Neiva, Huila, Colombia. Para notificaciones y ejercicio de derechos, usa el correo y el WhatsApp indicados abajo.</li>
              <li>Correo: <a className="font-semibold text-[#028090] underline" href="mailto:dsegurodigital@gmail.com">dsegurodigital@gmail.com</a>.</li>
              <li>Teléfono/WhatsApp: <a className="font-semibold text-[#028090] underline" href="https://wa.me/573123797011">+57 312 379 7011</a>.</li>
              <li>Sitio web: datosegurodigital.com.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">2. Objeto y ámbito</h2>
            <p className="mt-3">Esta política regula el tratamiento de los datos personales que las personas nos entregan al solicitar orientación sobre acoso digital, uso indebido de información personal y situaciones vinculadas con aplicaciones de crédito, ya sea por el formulario de este sitio o por WhatsApp. Se rige por la Ley 1581 de 2012, el Decreto 1074 de 2015 y las demás normas que los modifiquen.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">3. Principios</h2>
            <p className="mt-3">Aplicamos los principios de legalidad, finalidad, libertad, veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad, y recolectamos únicamente la información pertinente para las finalidades informadas.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">4. Datos que recolectamos</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Datos de contacto: nombre y medio de contacto (teléfono, WhatsApp o correo).</li>
              <li>Descripción de tu situación, que es opcional y que tú decides cuánto detallar.</li>
              <li>Registro de tu autorización: el texto que aceptaste, la versión de la política, y la fecha y hora en que la otorgaste.</li>
              <li>Mensajes, capturas o documentos que decidas compartir con nosotros por WhatsApp u otro canal.</li>
            </ul>
            <p className="mt-3 font-semibold">No envíes contraseñas, códigos de verificación, PIN, claves bancarias ni datos completos de tarjetas. No compartas datos de terceros que no sean necesarios.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">5. Finalidades</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Recibir y responder solicitudes de orientación.</li>
              <li>Contactarte por el canal que nos indiques.</li>
              <li>Organizar la información o evidencias pertinentes que compartas voluntariamente.</li>
              <li>Brindar orientación inicial sobre protección de datos y opciones generales disponibles.</li>
              <li>Gestionar el seguimiento y cierre de tu solicitud.</li>
              <li>Atender consultas, reclamos y el ejercicio de tus derechos como titular.</li>
              <li>Cumplir obligaciones legales aplicables.</li>
            </ul>
            <p className="mt-3">Tu solicitud de orientación no nos autoriza, por sí sola, a enviarte publicidad para finalidades distintas.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">6. Autorización</h2>
            <p className="mt-3">Tratamos tus datos con autorización previa, expresa e informada. Al usar el formulario debes marcar la casilla de autorización; el sistema guarda el texto aceptado, la versión de esta política y la fecha y hora, de modo que exista prueba consultable de tu consentimiento. Si nos escribes directamente por WhatsApp, te informaremos esta política y pediremos tu autorización antes de tratar información adicional.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">7. Datos sensibles y de terceros</h2>
            <p className="mt-3">No solicitamos datos sensibles como regla general, y su suministro es siempre facultativo. Si excepcionalmente fueran necesarios, te informaremos el dato concreto, la finalidad y las condiciones aplicables, y pediremos tu autorización explícita. Te recomendamos ocultar los datos de terceros que no sean pertinentes en capturas o documentos que compartas.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">8. Derechos de los titulares</h2>
            <p className="mt-3">Puedes conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización; ser informado sobre el uso que se ha dado a tus datos; presentar quejas ante la Superintendencia de Industria y Comercio una vez agotado el trámite ante el responsable; y revocar la autorización o solicitar la supresión de tus datos cuando proceda legalmente.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">9. Consultas y reclamos</h2>
            <p className="mt-3">Para ejercer tus derechos, escribe a <a className="font-semibold text-[#028090] underline" href="mailto:dsegurodigital@gmail.com">dsegurodigital@gmail.com</a> o al <a className="font-semibold text-[#028090] underline" href="https://wa.me/573123797011">+57 312 379 7011</a>, identificándote y describiendo tu solicitud. Las consultas se responden en un máximo de diez (10) días hábiles y los reclamos en un máximo de quince (15) días hábiles, contados desde su recibo; estos plazos pueden prorrogarse en los términos de los artículos 14 y 15 de la Ley 1581 de 2012.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">10. Proveedores y transmisión de datos</h2>
            <p className="mt-3">Para operar el servicio usamos proveedores tecnológicos que actúan como encargados del tratamiento: Supabase (almacenamiento de las solicitudes), Google (respaldo en hojas de cálculo y notificación por correo), Vercel (alojamiento del sitio) y WhatsApp/Meta (canal de mensajería). Algunos de estos proveedores pueden almacenar o procesar datos en servidores ubicados fuera de Colombia. No vendemos tus datos ni los compartimos con terceros para fines comerciales propios de ellos.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">11. Seguridad y conservación</h2>
            <p className="mt-3">Aplicamos medidas técnicas y administrativas razonables para proteger la información contra acceso no autorizado, pérdida o alteración, y limitamos el acceso a las personas que atienden las solicitudes. Conservamos los datos mientras sean necesarios para las finalidades descritas y para cumplir obligaciones legales; luego se suprimen o anonimizan, salvo que la ley exija conservarlos.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">12. Vigencia y cambios</h2>
            <p className="mt-3">Esta política rige desde el 22 de octubre de 2026. Si la modificamos de forma sustancial, publicaremos la nueva versión en esta página y, cuando la ley lo exija, solicitaremos nuevamente tu autorización.</p>
          </div>
        </section>
        <div className="mt-12 rounded-2xl bg-[#0B2340] p-6 text-white">
          <p className="font-black">Contacto de privacidad</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">dsegurodigital@gmail.com · +57 312 379 7011</p>
          <p className="mt-3 text-xs leading-5 text-slate-400">Anyi Stefania Toro Carvajal · NIT 1007499214-8 · Dato Seguro Digital, matrícula mercantil 435570 · Neiva, Huila.</p>
          <Link href="/" className="mt-5 inline-flex rounded-full bg-[#02C39A] px-5 py-3 text-sm font-bold text-[#0B2340]">Volver al sitio</Link>
        </div>
      </article>
    </main>
  );
}
