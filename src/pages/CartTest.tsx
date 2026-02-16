import { useCart } from "../contexts/CartContext";

export default function CartTest() {
  const cart: any = useCart();

  // ✅ Correct location of items in your context
  const items = cart?.state?.items ?? [];

  const totalQty =
    typeof cart?.getTotalQty === "function"
      ? cart.getTotalQty()
      : items.reduce((sum: number, it: any) => sum + (Number(it.qty) || 0), 0);

  return (
    <div style={{ padding: 24 }}>
      <h1>Cart Test</h1>

      <p>Total items: {items.length}</p>
      <p>Total quantity: {totalQty}</p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button
          onClick={() =>
            cart?.addItem?.({
              groupCode: "UGI-LM",
              shadeCode: "01",
              packSize: "15g",
              qty: 25,
              moq: 25,
              productName: "Glowing Builder Gel",
            })
          }
        >
          Add sample item
        </button>

        <button onClick={() => cart?.clearCart?.()}>
          Clear cart
        </button>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <h2>Items</h2>

      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map((item: any) => (
            <li
              key={`${item.groupCode}-${item.shadeCode}-${item.packSize}`}
            >
              {item.groupCode} - {item.shadeCode} - {item.packSize} - Qty:{" "}
              {item.qty}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
