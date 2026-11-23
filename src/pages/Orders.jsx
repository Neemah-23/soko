import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { kes } from "../components/ProductCard.jsx";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), where("uid", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(list);
    });
  }, [user]);

  if (!orders) return <p className="empty">Loading…</p>;
  if (orders.length === 0) return <p className="empty">You have no orders yet.</p>;

  return (
    <div className="panel">
      <h2>My orders</h2>
      {orders.map((o) => (
        <div className="order" key={o.id}>
          <div className="order-head">
            <strong>#{o.id.slice(0, 8).toUpperCase()}</strong>
            <span className="pill">{o.status}</span>
            <span className="muted">{o.createdAt?.toDate().toLocaleString("en-KE")}</span>
            <strong className="line">{kes(o.total)}</strong>
          </div>
          <p className="muted">{o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</p>
          <p className="muted">M-Pesa receipt: {o.receipt}</p>
        </div>
      ))}
    </div>
  );
}
