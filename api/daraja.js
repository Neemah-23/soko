// Shared Daraja helpers (the underscore stops Vercel exposing this as a route)
export const BASE = process.env.MPESA_BASE || "https://sandbox.safaricom.co.ke"; // live: https://api.safaricom.co.ke

// Step 1: exchange Consumer Key + Secret for a short-lived access token
export async function getToken() {
  const { MPESA_CONSUMER_KEY: key, MPESA_CONSUMER_SECRET: secret } = process.env;
  if (!key || !secret) throw new Error("MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET are not set");
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const r = await fetch(`${BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const d = await r.json();
  if (!d.access_token) throw new Error("Could not get an access token. Check your Consumer Key and Secret.");
  return d.access_token;
}

// Password = base64(Shortcode + Passkey + Timestamp)
export function passwordAndTimestamp() {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const password = Buffer.from(process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp).toString("base64");
  return { password, timestamp };
}