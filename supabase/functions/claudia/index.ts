// Puente entre el panel (admin.html) y el asistente Claudia, que vive en la base
// de EBM. Dos usos:
// - EBM avisa cuando alguien deja sus datos o pide hablar con una persona
//   (cabecera x-integration-token): manda una notificación a los móviles suscritos.
// - El panel pide las conversaciones (con la sesión de Bea o Ernesto): se piden a
//   EBM con el token guardado en integration_secrets, que nunca llega al navegador.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const EBM_FEED = "https://rhjbpkaesobsbnkvioyh.supabase.co/functions/v1/client-feed";
const VAPID_PUBLIC_KEY = "BFx6mErzfrL63SqtXSw53urXScDwHJSthenPkQ1XVlqltYFmdPI0dPACmbX7Dcvls0x1D_RQc7VxycxdWfcUAOk";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

async function secrets() {
  const { data } = await admin.from("integration_secrets").select("name, value");
  return Object.fromEntries((data ?? []).map((r) => [r.name, r.value])) as Record<string, string>;
}

async function pushAll(payload: Record<string, unknown>, vapidPrivate: string) {
  webpush.setVapidDetails("mailto:mipqrincon@gmail.com", VAPID_PUBLIC_KEY, vapidPrivate);
  const { data: subs } = await admin.from("push_subscriptions").select("*");
  let sent = 0;
  for (const s of subs ?? []) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload),
      );
      sent++;
    } catch (err) {
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 410 || status === 401 || status === 403) {
        await admin.from("push_subscriptions").delete().eq("id", s.id);
      }
    }
  }
  return sent;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const body = await req.json().catch(() => ({}));
  const sec = await secrets();

  // Aviso que llega desde EBM.
  const incoming = req.headers.get("x-integration-token");
  if (incoming) {
    if (!sec.ebm_token || incoming !== sec.ebm_token) return json({ error: "unauthorized" }, 401);
    const url = "./admin.html?tab=claudia" + (body.conversation_id ? `&c=${encodeURIComponent(body.conversation_id)}` : "");
    const sent = await pushAll({ title: String(body.title ?? "Claudia"), body: String(body.body ?? ""), url }, sec.vapid_private);
    return json({ sent });
  }

  // Petición del panel: solo con sesión iniciada.
  const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: { user } } = await admin.auth.getUser(jwt);
  if (!user) return json({ error: "unauthorized" }, 401);
  if (!["list", "messages"].includes(body.action)) return json({ error: "invalid_request" }, 400);
  const res = await fetch(EBM_FEED, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-integration-token": sec.ebm_token },
    body: JSON.stringify({ action: body.action, conversation_id: body.conversation_id, days: body.days }),
  });
  return json(await res.json().catch(() => ({ error: "bad_gateway" })), res.status);
});
