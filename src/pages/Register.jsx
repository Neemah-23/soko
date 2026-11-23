import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!/^(07|01)\d{8}$/.test(f.phone)) return setErr("Enter a phone number like 0712345678.");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters.");
    setBusy(true);
    try { await register(f); nav("/"); }
    catch (e) { setErr(e.code === "auth/email-already-in-use" ? "That email already has an account. Log in instead." : e.message); }
    setBusy(false);
  };

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h2>Create your account</h2>
      <label>Full name<input required value={f.name} onChange={set("name")} /></label>
      <label>Email<input type="email" required value={f.email} onChange={set("email")} /></label>
      <label>M-Pesa phone number<input required placeholder="0712345678" value={f.phone} onChange={set("phone")} /></label>
      <label>Password<input type="password" required value={f.password} onChange={set("password")} /></label>
      {err && <p className="error">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
