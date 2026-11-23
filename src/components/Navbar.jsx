import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">Soko</Link>
        <nav>
          <NavLink to="/">Shop</NavLink>
          {user ? (
            <>
              <NavLink to="/orders">Orders</NavLink>
              <NavLink to="/cart">Cart{count > 0 && <span className="badge">{count}</span>}</NavLink>
              <button className="link" onClick={async () => { await logout(); nav("/"); }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register" className="btn small">Create account</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
