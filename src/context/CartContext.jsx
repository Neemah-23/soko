import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "./AuthContext.jsx";

/*
 * The cart lives in Firestore at carts/{uid}. onSnapshot keeps it live, so
 * adding an item on your phone shows up on your laptop instantly.
 * That is what satisfies requirement 6: "use more than one device to shop".
 */
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) { setItems([]); return; }
    return onSnapshot(doc(db, "carts", user.uid), (snap) => {
      setItems(snap.exists() ? snap.data().items || [] : []);
    });
  }, [user]);

  const save = (next) => setDoc(doc(db, "carts", user.uid), { items: next });

  const add = (p) => {
    const found = items.find((i) => i.id === p.id);
    save(found
      ? items.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
      : [...items, { id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 }]);
  };
  const setQty = (id, qty) =>
    save(qty <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty } : i)));
  const remove = (id) => save(items.filter((i) => i.id !== id));
  const clear = () => save([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  return (
    <CartCtx.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartCtx.Provider>
  );
}
