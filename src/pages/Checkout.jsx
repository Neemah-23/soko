import { useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { kes } from "../components/ProductCard.jsx";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("form"); // form | waiting | paid
  const [err, setErr] = useState("");
  const [orderId, setOrderId] = useState("");

  const pay = async (e) => {
    e.preventDefault();
    setErr("");
    if (!/^(07|01)\d{8}$/.test(phone)) return setErr("Enter a phone number like 0712345678.");
    setStage("waiting");

    try {
      // 1) Our server gets a Daraja token and sends the STK push
      const res = await fetch("/api/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: total, ref: "SOKO" + user.uid.slice(0, 5) }),
      });
      const start = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(start.error || "Payment service unavailable. Use the deployed site, not localhost.");

      // 2) Poll the STK Push Query every 3s (up to 90s)
      let status = { state: "PENDING" };
      for (let i = 0; i < 30 && status.state === "PENDING"; i++) {
        await sleep(3000);
        status = await (await fetch("/api/status?id=" + start.checkoutId)).json();
      }
      if (status.state === "FAILED") throw new Error(status.reason || "Payment was cancelled or failed.");
      if (status.state !== "COMPLETE") throw new Error("We did not receive your payment in time. Please try again.");

      // 3) Confirmed: save the order
      const ref = await addDoc(collection(db, "orders"), {
        uid: user.uid, items, total, phone,
        receipt: start.checkoutId, paymentMode: "mpesa-daraja",
        status: "paid", createdAt: serverTimestamp(),
      });
      setOrderId(ref.id);
      await clear();
      setStage("paid");
    } catch (e) {
      setErr(e.message);
      setStage("form");
    }
  };

  if (stage === "paid")
    return (
      <div className="panel narrow center">
        <h2>Payment received</h2>
        <p>Order <strong>{orderId.slice(0, 8).toUpperCase()}</strong> is confirmed.</p>
        <Link className="btn" to="/orders">View my orders</Link>
      </div>
    );

  if (items.length === 0)
    return <div className="empty"><p>Nothing to pay for.</p><Link className="btn" to="/">Browse products</Link></div>;

  return (
    <form className="panel narrow" onSubmit={pay}>
      <h2>Pay with M-Pesa</h2>
      <ul className="summary">
        {items.map((i) => <li key={i.id}><span>{i.qty} × {i.name}</span><span>{kes(i.qty * i.price)}</span></li>)}
      </ul>
      <div className="total"><span>Total</span><strong>{kes(total)}</strong></div>
      <label>M-Pesa number
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712345678" disabled={stage === "waiting"} />
      </label>
      {err && <p className="error">{err}</p>}
      {stage === "waiting"
        ? <p className="notice">Check your phone and enter your M-Pesa PIN to approve {kes(total)}. Keep this page open.</p>
        : <button className="btn">Pay {kes(total)}</button>}
    </form>
  );
}
