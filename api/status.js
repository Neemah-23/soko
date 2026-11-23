// GET /api/status?id=CHECKOUT_REQUEST_ID  ->  { state: PENDING | COMPLETE | FAILED, reason }
// Uses Daraja's "STK Push Query" so no database or callback is needed.
import { BASE, getToken, passwordAndTimestamp } from "./_daraja.js";

export default async function handler(req, res) {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "id is required" });
  try {
    const token = await getToken();
    const { password, timestamp } = passwordAndTimestamp();
    const r = await fetch(`${BASE}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: id,
      }),
    });
    const d = await r.json().catch(() => ({}));
    // While the customer has not answered, Daraja replies with an error
    // ("The transaction is being processed"), which we treat as pending.
    if (d.ResultCode === undefined) return res.json({ state: "PENDING" });
    if (String(d.ResultCode) === "0") return res.json({ state: "COMPLETE" });
    return res.json({ state: "FAILED", reason: d.ResultDesc });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}