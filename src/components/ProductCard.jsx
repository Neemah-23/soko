import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export const kes = (n) => "KES " + Number(n).toLocaleString("en-KE");

export default function ProductCard({ p }) {
  const { user } = useAuth();
  const { add, items } = useCart();
  const nav = useNavigate();
  const inCart = items.find((i) => i.id === p.id)?.qty || 0;

  return (
    <article className="card">
      <img src={p.image} alt={p.name} loading="lazy" />
      <div className="card-body">
        <span className="cat">{p.category}</span>
        <h3>{p.name}</h3>
        <p className="desc">{p.description}</p>
        <div className="card-foot">
          <strong>{kes(p.price)}</strong>
          <button className="btn small" onClick={() => (user ? add(p) : nav("/login"))}>
            {inCart ? `Add another (${inCart})` : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
