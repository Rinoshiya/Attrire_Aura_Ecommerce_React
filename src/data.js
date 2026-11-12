export const CATEGORIES = ["All", "Dresses", "Accessories"];
export const PRODUCTS = [
  { id: 1, name: "Floral Wrap Dress", category: "Dresses", price: 2499, colors: ["#e8a0b4", "#f3d9a4"], desc: "Lightweight wrap dress with a flattering waist tie." },
  { id: 2, name: "Satin Midi Dress", category: "Dresses", price: 3299, colors: ["#6b7fd7", "#2f2f3a"], desc: "Smooth satin midi cut, perfect for evening events." },
  { id: 3, name: "Linen Summer Dress", category: "Dresses", price: 1999, colors: ["#d8c8a8", "#9bb89a"], desc: "Breathable linen for warm days." },
  { id: 4, name: "Pleated Maxi Dress", category: "Dresses", price: 3799, colors: ["#b05a7a", "#3d5a80"], desc: "Flowing pleats with a relaxed fit." },
  { id: 5, name: "Pearl Drop Earrings", category: "Accessories", price: 899, colors: ["#f0e6d2", "#d4af37"], desc: "Classic pearl drops with gold-tone hooks." },
  { id: 6, name: "Leather Crossbody Bag", category: "Accessories", price: 2799, colors: ["#8b5e3c", "#222222"], desc: "Compact bag with an adjustable strap." },
  { id: 7, name: "Silk Scarf", category: "Accessories", price: 1199, colors: ["#c94f6d", "#4a7c8c"], desc: "Printed silk scarf, styled many ways." },
  { id: 8, name: "Gold Layered Necklace", category: "Accessories", price: 1499, colors: ["#d4af37", "#c0c0c0"], desc: "Delicate layered chains for everyday wear." },
];
export const inr = (n) => "\u20B9" + n.toLocaleString("en-IN");
