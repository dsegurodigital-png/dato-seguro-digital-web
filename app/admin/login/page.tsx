"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError("No fue posible iniciar sesión. Verifica tus credenciales.");
        return;
      }

      // La autorización se decide en el servidor (ADMIN_EMAIL nunca llega al navegador).
      const verificacion = await fetch("/api/admin/sesion", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (verificacion.status === 403) {
        await supabase.auth.signOut();
        setError("Esta cuenta no está autorizada para acceder al panel.");
        return;
      }

      if (!verificacion.ok) {
        await supabase.auth.signOut();
        setError("No se pudo verificar la sesión. Inténtalo nuevamente.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Ocurrió un error de conexión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f6fa] px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
            <Image
              src="/icono.png"
              alt="Dato Seguro Digital"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
              priority
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#028090]">
            Dato Seguro Digital
          </p>

          <h1 className="mt-3 text-2xl font-bold text-[#0B2340]">
            Panel administrativo
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Acceso privado para gestionar las solicitudes recibidas.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#028090] focus:ring-4 focus:ring-[#028090]/10"
              placeholder="admin@tudominio.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#028090] focus:ring-4 focus:ring-[#028090]/10"
              placeholder="Tu contraseña"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0B2340] px-4 py-3.5 font-semibold text-white transition hover:bg-[#12365d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verificando acceso..." : "Ingresar al panel"}
          </button>
        </form>

        <p className="mt-7 text-center text-xs leading-5 text-slate-400">
          Acceso restringido. Protegemos tus datos y tu tranquilidad.
        </p>
      </section>
    </main>
  );
}
