
/**
 * Limitador de tasa en memoria, por proceso. Pensado para un despliegue de
 * una sola instancia (EasyPanel/Node). Si en el futuro se corre con más de
 * una instancia detrás de un balanceador, esto deja de ser efectivo y hay
 * que moverlo a un store compartido (Redis, Supabase, etc.).
 */

type Registro = {
  timestamps: number[];
};

const ventanas = new Map<string, Registro>();

// Limpieza periódica para no acumular IPs viejas en memoria indefinidamente.
const INTERVALO_LIMPIEZA_MS = 10 * 60 * 1000;
let ultimaLimpieza = Date.now();

function limpiarSiCorresponde(ahora: number, ventanaMs: number) {
  if (ahora - ultimaLimpieza < INTERVALO_LIMPIEZA_MS) return;
  ultimaLimpieza = ahora;

  for (const [clave, registro] of ventanas) {
    registro.timestamps = registro.timestamps.filter(
      (t) => ahora - t < ventanaMs,
    );
    if (registro.timestamps.length === 0) {
      ventanas.delete(clave);
    }
  }
}

/**
 * Ventana deslizante simple: permite como máximo `limite` intentos por
 * `clave` dentro de los últimos `ventanaMs` milisegundos.
 */
export function permitir(
  clave: string,
  limite: number,
  ventanaMs: number,
): { ok: true } | { ok: false; reintentarEnMs: number } {
  const ahora = Date.now();
  limpiarSiCorresponde(ahora, ventanaMs);

  const registro = ventanas.get(clave) ?? { timestamps: [] };
  registro.timestamps = registro.timestamps.filter(
    (t) => ahora - t < ventanaMs,
  );

  if (registro.timestamps.length >= limite) {
    const masAntiguo = registro.timestamps[0];
    ventanas.set(clave, registro);
    return { ok: false, reintentarEnMs: ventanaMs - (ahora - masAntiguo) };
  }

  registro.timestamps.push(ahora);
  ventanas.set(clave, registro);
  return { ok: true };
}

/**
 * Obtiene una IP razonable del request detrás de un proxy (EasyPanel/Traefik
 * suelen enviar X-Forwarded-For). Si no hay nada confiable, agrupa todo bajo
 * una misma clave para que el límite global siga aplicando.
 */
export function obtenerIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();

  return "desconocida";
}
