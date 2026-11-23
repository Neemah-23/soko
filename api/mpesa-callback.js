// Safaricom POSTs the final payment result here (ResultCode 0 = success).
// For production: verify with firebase-admin and update the matching order.
export default function handler(req, res) {
  const cb = req.body?.Body?.stkCallback;
  console.log("M-Pesa callback:", JSON.stringify(cb));
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
