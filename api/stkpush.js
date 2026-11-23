// POST /api/stkpush { phone, amount, ref }  ->  { checkoutId }
import { BASE, getToken, passwordAndTimestamp } from "./_daraja.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { phone, amount, ref } = req.body || {};
  if (!phone || !amount) return res.status(400).json({ error: "phone and amount are required" });

  try {
    const token = await getToken();
    const { password, timestamp } = passwordAndTimestamp();
    const msisdn = "254" + String(phone).replace(/^0/, "");
    const callback = process.env.MPESA_CALLBACK_URL || `https://${req.headers.host}/api/mpesa-callback`;

    const r = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: msisdn,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: msisdn,
        CallBackURL: callback,
        AccountReference: (ref || "SOKO").slice(0, 12),
        TransactionDesc: "Soko order",
      }),
    });
    const d = await r.json();
    if (d.ResponseCode !== "0")
      return res.status(400).json({ error: d.errorMessage || d.ResponseDescription || "STK push rejected" });
    return res.json({ checkoutId: d.CheckoutRequestID });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}