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
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
          <p className="font-black">Borrador informativo — pendiente de validación</p>
          <p className="mt-2 text-sm leading-6">
            El tipo de responsable, la identificación jurídica y el NIT están pendientes de confirmar.
            Esta página no debe tratarse como versión legal definitiva hasta completar esos datos,
            verificar el flujo real de información y realizar la revisión correspondiente.
          </p>
        </div>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-[#028090]">Privacidad</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Política de Tratamiento de Datos Personales</h1>
        <p className="mt-4 leading-7 text-slate-600">Versión 1.0 — borrador de trabajo. Fecha de preparación: 8 de octubre de 2026.</p>

        <section className="mt-10 space-y-8 leading-7 text-slate-700">
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">1. Identificación del responsable</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Marca informada: Dato Seguro Digital.</li>
              <li>Nombre o razón social legal: pendiente de confirmar.</li>
              <li>Tipo de responsable: pendiente de confirmar (persona natural o jurídica).</li>
              <li>NIT: pendiente de confirmar.</li>
              <li>Dirección informada: Calle 18 No. 50C-34. Municipio y domicilio completo pendientes de confirmar.</li>
              <li>Correo: <a className="font-semibold text-[#028090] underline" href="mailto:dsegurodigital@gmail.com">dsegurodigital@gmail.com</a>.</li>
              <li>Teléfono/WhatsApp: <a className="font-semibold text-[#028090] underline" href="https://wa.me/573123797011">+57 312 379 7011</a>.</li>
              <li>Sitio web: datosegurodigital.com.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">2. Objeto y ámbito</h2>
            <p className="mt-3">Este borrador describe criterios propuestos para el tratamiento de datos personales en solicitudes de orientación relacionadas con acoso digital, uso indebido de información personal y situaciones vinculadas con aplicaciones de crédito. La versión definitiva debe ajustarse al flujo de datos que realmente se implemente.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">3. Principios</h2>
            <p className="mt-3">Se propone aplicar los principios de legalidad, finalidad, libertad, veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad, recolectando únicamente información pertinente para las finalidades informadas.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">4. Categorías de datos</h2>
            <p className="mt-3">Según la solicitud, podrían tratarse datos de contacto, información descriptiva que la persona decida compartir, mensajes o capturas pertinentes y registros de comunicaciones y solicitudes. Los datos técnicos que recoja el sitio deberán verificarse antes de describirlos como parte del tratamiento.</p>
            <p className="mt-3 font-semibold">No envíes contraseñas, códigos de verificación, PIN, claves bancarias ni datos completos de tarjetas. No compartas datos de terceros que no sean necesarios.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">5. Finalidades propuestas</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Recibir y responder solicitudes de orientación.</li>
              <li>Contactar a la persona por el canal que suministre.</li>
              <li>Organizar información o evidencias pertinentes compartidas voluntariamente.</li>
              <li>Brindar orientación inicial sobre protección de datos y opciones generales disponibles.</li>
              <li>Gestionar seguimiento y cierre de solicitudes.</li>
              <li>Atender consultas, reclamos y ejercicio de derechos del titular.</li>
              <li>Cumplir obligaciones legales aplicables.</li>
            </ul>
            <p className="mt-3">La solicitud de orientación no autoriza por sí sola el envío de publicidad para finalidades distintas.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">6. Autorización</h2>
            <p className="mt-3">Cuando sea exigible, el tratamiento se realizará con autorización previa, expresa e informada mediante un mecanismo que permita conservar una prueba consultable. El formulario de esta web está deshabilitado mientras no exista un backend que registre y permita consultar la evidencia del consentimiento; pulsar un botón no implica que la autorización haya sido almacenada.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">7. Datos sensibles y de terceros</h2>
            <p className="mt-3">No se solicitarán datos sensibles como regla general. Si excepcionalmente fueran necesarios, se informarán el dato concreto, la finalidad y las condiciones aplicables, y se recabará autorización explícita cuando corresponda. Se recomendará ocultar datos de terceros que no sean pertinentes en capturas o documentos compartidos.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">8. Derechos de los titulares</h2>
            <p className="mt-3">El titular podrá solicitar conocer, actualizar y rectificar sus datos, pedir prueba de la autorización e información sobre su uso, y solicitar revocatoria o supresión cuando proceda legalmente. También podrá presentar queja ante la Superintendencia de Industria y Comercio después de agotar el trámite correspondiente ante el responsable.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">9. Consultas y reclamos</h2>
            <p className="mt-3">Para consultas y reclamos sobre datos personales, contacta a <a className="mx-1 font-semibold text-[#028090] underline" href="mailto:dsegurodigital@gmail.com">dsegurodigital@gmail.com</a> o al <a className="font-semibold text-[#028090] underline" href="https://wa.me/573123797011">+57 312 379 7011</a>. Las solicitudes se tramitarán conforme a los términos y requisitos establecidos por la normativa aplicable. Antes de publicar la versión definitiva, deben validarse los procedimientos y plazos en el documento completo aprobado.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">10. Seguridad, proveedores y conservación</h2>
            <p className="mt-3">Antes de la puesta en producción se deben documentar los sistemas que reciben datos, los proveedores que tengan acceso, los permisos, las medidas de seguridad y los plazos de conservación. Este borrador no afirma que existan cifrado, copias de seguridad, cookies, transferencias internacionales ni proveedores específicos hasta que se verifiquen.</p>
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B2340]">11. Marco normativo y aprobación</h2>
            <p className="mt-3">Borrador preparado tomando como referencia general la Ley 1581 de 2012 y su reglamentación colombiana. Requiere completar la identificación jurídica del responsable, revisar el tratamiento real de información y obtener validación jurídica antes de publicarse como política definitiva.</p>
          </div>
        </section>
        <div className="mt-12 rounded-2xl bg-[#0B2340] p-6 text-white">
          <p className="font-black">Contacto de privacidad</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">dsegurodigital@gmail.com · +57 312 379 7011</p>
          <p className="mt-3 text-xs leading-5 text-slate-400">La publicación de esta página no sustituye la revisión legal ni confirma que el formulario de autorización esté operativo.</p>
          <Link href="/" className="mt-5 inline-flex rounded-full bg-[#02C39A] px-5 py-3 text-sm font-bold text-[#0B2340]">Volver al sitio</Link>
        </div>
      </article>
    </main>
  );
}
