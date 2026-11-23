import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { kes } from "../components/ProductCard.jsx";

export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  const nav = useNavigate();

  if (items.length === 0)
    return <div className="empty"><p>Your cart is empty.</p><Link className="btn" to="/">Browse products</Link></div>;

  return (
    <div className="panel">
      <h2>Your cart</h2>
      {items.map((i) => (
        <div className="row" key={i.id}>
          <img src={i.image} alt="" />
          <div className="grow"><strong>{i.name}</strong><div className="muted">{kes(i.price)}</div></div>
          <div className="qty">
            <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease">−</button>
            <span>{i.qty}</span>
            <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase">+</button>
          </div>
          <strong className="line">{kes(i.price * i.qty)}</strong>
          <button className="link" onClick={() => remove(i.id)}>Remove</button>
        </div>
      ))}
      <div className="total"><span>Total</span><strong>{kes(total)}</strong></div>
      <button className="btn" onClick={() => nav("/checkout")}>Go to checkout</button>
    </div>
  );
}
