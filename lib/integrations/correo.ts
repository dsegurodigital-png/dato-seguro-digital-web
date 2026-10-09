import nodemailer from "nodemailer";

interface DatosNotificacion {
  id: string;
  nombre: string;
  contacto: string;
  descripcion: string | null;
  fecha: string;
}

function clienteConfigurado(): boolean {
  return Boolean(
    process.env.GMAIL_USER &&
      process.env.GMAIL_APP_PASSWORD &&
      process.env.ADMIN_EMAIL,
  );
}

/**
 * Envía un correo de notificación al admin cuando llega una solicitud nueva.
 * Best-effort: si falla (credenciales mal puestas, Gmail caído, etc.) solo
 * se registra el error — la solicitud ya quedó guardada en Supabase antes de
 * llamar esto, así que una falla aquí nunca le impide al usuario enviar su
 * solicitud.
 */
export async function notificarNuevaSolicitud(datos: DatosNotificacion): Promise<void> {
  if (!clienteConfigurado()) return;

  try {
    const transporte = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporte.sendMail({
      from: `"Dato Seguro Digital" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nueva solicitud recibida — ${datos.nombre}`,
      text: [
        "Nueva solicitud recibida en datosegurodigital.com",
        "",
        `Nombre: ${datos.nombre}`,
        `Contacto: ${datos.contacto}`,
        `Descripción: ${datos.descripcion ?? "(sin descripción)"}`,
        `Fecha: ${datos.fecha}`,
        `ID: ${datos.id}`,
        "",
        "Ingresa al panel administrativo para gestionarla: https://datosegurodigital.com/admin",
      ].join("\n"),
    });
  } catch (error) {
    console.error("No se pudo enviar la notificación por correo:", error);
  }
}
