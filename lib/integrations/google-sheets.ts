import { JWT } from "google-auth-library";

const NOMBRE_HOJA = process.env.GOOGLE_SHEETS_SHEET_NAME?.trim() || "Solicitudes";

interface FilaSolicitud {
  id: string;
  nombre: string;
  contacto: string;
  descripcion: string | null;
  fecha: string;
}

function clienteConfigurado(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
      process.env.GOOGLE_SHEETS_PRIVATE_KEY &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  );
}

/**
 * Agrega una fila a la hoja de cálculo de respaldo con los datos de la
 * solicitud recién creada. Es un respaldo adicional a Supabase, no la fuente
 * de verdad: si falla, solo se registra el error y no se interrumpe el flujo
 * principal (el registro en Supabase ya se completó antes de llamar esto).
 *
 * Usa la API REST de Sheets directamente (en vez del paquete "googleapis",
 * que es demasiado pesado) autenticando con una cuenta de servicio vía
 * "google-auth-library".
 */
export async function registrarEnGoogleSheets(fila: FilaSolicitud): Promise<void> {
  if (!clienteConfigurado()) return;

  try {
    const auth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const { token } = await auth.getAccessToken();

    if (!token) {
      throw new Error("No se obtuvo token de acceso para Google Sheets.");
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const rango = encodeURIComponent(`${NOMBRE_HOJA}!A:E`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${rango}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [fila.fecha, fila.nombre, fila.contacto, fila.descripcion ?? "", fila.id],
        ],
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`Sheets API respondió ${respuesta.status}: ${detalle}`);
    }
  } catch (error) {
    console.error("No se pudo registrar la solicitud en Google Sheets:", error);
  }
}
