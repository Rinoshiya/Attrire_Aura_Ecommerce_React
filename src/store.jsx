import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const StoreContext = createContext(null);
const load = () => {
  try { return JSON.parse(localStorage.getItem("aura-store")) ?? { bag: [], wishlist: [] }; }
  catch { return { bag: [], wishlist: [] }; }
};

function reducer(state, a) {
  switch (a.type) {
    case "ADD": {
      const found = state.bag.find((i) => i.id === a.id && i.color === a.color);
      const bag = found
        ? state.bag.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i))
        : [...state.bag, { id: a.id, color: a.color, qty: 1 }];
      return { ...state, bag };
    }
    case "QTY":
      return { ...state, bag: state.bag.map((i) => (i.id === a.id && i.color === a.color ? { ...i, qty: Math.max(1, i.qty + a.d) } : i)) };
    case "REMOVE":
      return { ...state, bag: state.bag.filter((i) => !(i.id === a.id && i.color === a.color)) };
    case "WISH":
      return { ...state, wishlist: state.wishlist.includes(a.id) ? state.wishlist.filter((x) => x !== a.id) : [...state.wishlist, a.id] };
    case "CLEAR":
      return { ...state, bag: [] };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => localStorage.setItem("aura-store", JSON.stringify(state)), [state]);
  const value = useMemo(() => ({ ...state, dispatch, count: state.bag.reduce((n, i) => n + i.qty, 0) }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
