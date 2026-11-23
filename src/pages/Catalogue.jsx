import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "../firebase.js";
import { seedProducts } from "../data/seedProducts.js";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Catalogue() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("default");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { setError("Could not load products. Check your Firebase config and rules."); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  // One-click demo data so the shop is never empty during testing/marking
  const seed = async () => {
    const batch = writeBatch(db);
    seedProducts.forEach((p) => batch.set(doc(collection(db, "products")), p));
    await batch.commit();
    load();
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const shown = useMemo(() => {
    let list = products.filter(
      (p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, q, cat, sort]);

  return (
    <>
      <section className="hero">
        <h1>Everything you need, delivered across Kenya.</h1>
        <p>Pay with M-Pesa. Start a cart on your phone, finish it on your laptop.</p>
      </section>

      <div className="filters">
        <input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Sort: Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? <p className="empty">Loading products…</p> : shown.length === 0 ? (
        <div className="empty">
          <p>No products found.</p>
          {products.length === 0 && user && <button className="btn" onClick={seed}>Add sample products</button>}
          {products.length === 0 && !user && <p>Log in to add sample products.</p>}
        </div>
      ) : (
        <div className="grid">{shown.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </>
  );
}
