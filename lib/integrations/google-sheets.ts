import { JWT } from "google-auth-library";

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
 * Determina el nombre real de la pestaña a usar. Si GOOGLE_SHEETS_SHEET_NAME
 * está configurado, se respeta tal cual. Si no, se detecta automáticamente
 * leyendo la primera pestaña de la hoja de cálculo — esto evita errores por
 * nombres que no calzan exactamente (espacios ocultos, mayúsculas, etc.) y
 * sigue funcionando aunque la pestaña se renombre más adelante.
 */
async function obtenerNombreHoja(
  spreadsheetId: string,
  token: string,
): Promise<string> {
  const configurado = process.env.GOOGLE_SHEETS_SHEET_NAME?.trim();
  if (configurado) return configurado;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`;

  const respuesta = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(
      `No se pudo leer la hoja de cálculo (${respuesta.status}): ${detalle}`,
    );
  }

  const datos = (await respuesta.json()) as {
    sheets?: Array<{ properties?: { title?: string } }>;
  };

  const primera = datos.sheets?.[0]?.properties?.title;

  if (!primera) {
    throw new Error("La hoja de cálculo no tiene ninguna pestaña.");
  }

  return primera;
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

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;
    const nombreHoja = await obtenerNombreHoja(spreadsheetId, token);

    // Se cita el nombre de la pestaña entre comillas simples (sintaxis A1
    // válida siempre, no solo cuando tiene espacios) para evitar cualquier
    // ambigüedad al parsear el rango.
    const rango = encodeURIComponent(`'${nombreHoja}'!A:E`);
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
