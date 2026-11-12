import { useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, PRODUCTS, inr } from "./data.js";
import { useStore } from "./store.jsx";

function Layout({ children }) {
  const { count, wishlist } = useStore();
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">Attire Aura</Link>
        <nav>
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/wishlist">Wishlist ({wishlist.length})</NavLink>
          <NavLink to="/bag">Bag ({count})</NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}

function Card({ p }) {
  const { wishlist, dispatch } = useStore();
  const liked = wishlist.includes(p.id);
  return (
    <article className="card">
      <Link to={`/product/${p.id}`} className="img" style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }} aria-label={p.name} />
      <div className="info">
        <div><Link to={`/product/${p.id}`}>{p.name}</Link><p>{inr(p.price)}</p></div>
        <button className="ghost" aria-pressed={liked} onClick={() => dispatch({ type: "WISH", id: p.id })}>{liked ? "\u2665" : "\u2661"}</button>
      </div>
    </article>
  );
}

function Shop() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const items = useMemo(() => {
    let l = PRODUCTS.filter((p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [cat, q, sort]);
  return (
    <>
      <section className="hero"><h1>Dresses &amp; Accessories</h1><p>Effortless style for every occasion.</p></section>
      <div className="filters">
        {CATEGORIES.map((c) => <button key={c} className={c === cat ? "chip on" : "chip"} onClick={() => setCat(c)}>{c}</button>)}
        <input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option>
        </select>
      </div>
      {items.length ? <div className="grid">{items.map((p) => <Card key={p.id} p={p} />)}</div> : <p className="empty">No products match your search.</p>}
    </>
  );
}

function Product() {
  const { id } = useParams();
  const p = PRODUCTS.find((x) => x.id === Number(id));
  const { dispatch } = useStore();
  const [color, setColor] = useState(0);
  const [added, setAdded] = useState(false);
  if (!p) return <p className="empty">Product not found. <Link to="/">Back to shop</Link></p>;
  return (
    <div className="detail">
      <div className="img big" style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }} />
      <div>
        <h1>{p.name}</h1><h2>{inr(p.price)}</h2><p>{p.desc}</p>
        <div className="swatches">{p.colors.map((c, i) => <button key={c} aria-label={`Colour ${i + 1}`} className={i === color ? "sw on" : "sw"} style={{ background: c }} onClick={() => setColor(i)} />)}</div>
        <button className="primary" onClick={() => { dispatch({ type: "ADD", id: p.id, color }); setAdded(true); setTimeout(() => setAdded(false), 1200); }}>{added ? "Added \u2713" : "Add to bag"}</button>
        <button className="ghost" onClick={() => dispatch({ type: "WISH", id: p.id })}>Wishlist</button>
      </div>
    </div>
  );
}

function Wishlist() {
  const { wishlist } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));
  return <><h1>Wishlist</h1>{items.length ? <div className="grid">{items.map((p) => <Card key={p.id} p={p} />)}</div> : <p className="empty">Your wishlist is empty. <Link to="/">Start shopping</Link></p>}</>;
}

function Bag() {
  const { bag, dispatch } = useStore();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const total = bag.reduce((s, i) => s + PRODUCTS.find((p) => p.id === i.id).price * i.qty, 0);

  const place = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email";
    if (form.address.trim().length < 8) err.address = "Enter a full address";
    setErrors(err);
    if (!Object.keys(err).length) { dispatch({ type: "CLEAR" }); setDone(true); }
  };
  if (done) return <div className="empty"><h1>Thank you!</h1><p>Your order has been placed.</p><button className="primary" onClick={() => nav("/")}>Continue shopping</button></div>;
  if (!bag.length) return <p className="empty">Your bag is empty. <Link to="/">Start shopping</Link></p>;
  return (
    <div className="bag">
      <section>
        <h1>Bag</h1>
        {bag.map((i) => {
          const p = PRODUCTS.find((x) => x.id === i.id);
          return (
            <div className="row" key={i.id + "-" + i.color}>
              <span className="thumb" style={{ background: p.colors[i.color] }} />
              <span className="grow">{p.name}<small>{inr(p.price)}</small></span>
              <button className="ghost" onClick={() => dispatch({ type: "QTY", id: i.id, color: i.color, d: -1 })}>\u2212</button>
              <b>{i.qty}</b>
              <button className="ghost" onClick={() => dispatch({ type: "QTY", id: i.id, color: i.color, d: 1 })}>+</button>
              <button className="ghost" onClick={() => dispatch({ type: "REMOVE", id: i.id, color: i.color })}>Remove</button>
            </div>
          );
        })}
        <h2>Total: {inr(total)}</h2>
      </section>
      <form onSubmit={place} noValidate>
        <h1>Checkout</h1>
        {["name", "email", "address"].map((f) => (
          <label key={f}>{f[0].toUpperCase() + f.slice(1)}
            <input value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} aria-invalid={!!errors[f]} />
            {errors[f] && <span className="err">{errors[f]}</span>}
          </label>
        ))}
        <button className="primary" type="submit">Place order</button>
      </form>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="*" element={<p className="empty">Page not found. <Link to="/">Back to shop</Link></p>} />
      </Routes>
    </Layout>
  );
}
