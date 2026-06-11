import type { CSSProperties } from "react";
import { useCart } from "../contexts/CartContext";

export default function CartSummary() {
  const { state, getTotalQty, clearCart } = useCart();

  const items = state.items;
  const hasItems = items.length > 0;

  const totalUnits = getTotalQty();

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Order Summary</h3>

      {hasItems ? (
        <>
          <p>Items: {items.length}</p>
          <p>Total Units: {totalUnits}</p>

          <div style={styles.buttons}>
            <button onClick={clearCart} style={styles.secondary}>
              Clear Cart
            </button>

            <button style={styles.primary}>Proceed to Order</button>
          </div>
        </>
      ) : (
        <p style={styles.emptyText}>Your cart is empty. Add shades from the table to begin.</p>
      )}
    </div>
  );
}

const styles: Record<
  "container" | "title" | "buttons" | "primary" | "secondary" | "emptyText",
  CSSProperties
> = {
  container: {
    position: "sticky",
    top: 20,
    padding: 20,
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 12,
    background: "#fff",
    minWidth: 250,
  },

  title: {
    marginTop: 0,
    fontWeight: 800,
  },

  emptyText: {
    margin: 0,
    color: "rgba(0,0,0,0.65)",
    lineHeight: 1.5,
    fontSize: 14,
  },

  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 15,
  },

  primary: {
    padding: "10px",
    borderRadius: 8,
    border: "none",
    background: "#111",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },

  secondary: {
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #111",
    background: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
