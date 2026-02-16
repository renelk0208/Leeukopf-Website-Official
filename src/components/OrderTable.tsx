import { useState } from "react";
import { getBuilderGelCatalog } from "../lib/catalog";
import { useCart } from "../contexts/CartContext";

interface Props {
  groupCode: string;
}

export default function OrderTable({ groupCode }: Props) {
  const catalog = getBuilderGelCatalog();
  const entry = catalog.find((e) => e.groupCode === groupCode);

  const cart: any = useCart();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sizes, setSizes] = useState<Record<string, string>>({});

  if (!entry) return <p>No catalog found for group: {groupCode}</p>;

  const addItem = cart?.addItem; // because your context exposes addItem

  return (
    <div style={{ padding: 20 }}>
      <h2>{entry.productName}</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Shade</th>
            <th style={{ textAlign: "left", padding: 8 }}>Size</th>
            <th style={{ textAlign: "left", padding: 8 }}>
              Quantity (MOQ {entry.moq})
            </th>
            <th style={{ padding: 8 }}></th>
          </tr>
        </thead>

        <tbody>
          {entry.shades.map((shade) => {
            const selectedSize =
              sizes[shade.shadeCode] ?? entry.allowedPackSizes[0];

            const qty = quantities[shade.shadeCode] ?? entry.moq;

            return (
              <tr key={shade.shadeCode} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: 8 }}>
  <strong>{shade.shadeCode}</strong>
  {shade.shadeName && (
    <div style={{ fontSize: 12, opacity: 0.6 }}>
      {shade.shadeName}
    </div>
  )}
</td>

                <td style={{ padding: 8 }}>
                  <select
                    value={selectedSize}
                    onChange={(e) =>
                      setSizes({
                        ...sizes,
                        [shade.shadeCode]: e.target.value,
                      })
                    }
                  >
                    {entry.allowedPackSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={{ padding: 8 }}>
                  <input
                    type="number"
                    min={entry.moq}
                    value={qty}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [shade.shadeCode]: Number(e.target.value),
                      })
                    }
                    style={{ width: 90 }}
                  />
                </td>

                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => {
                      if (!addItem) return;

                      addItem({
                        groupCode: entry.groupCode,
                        shadeCode: shade.shadeCode,
                        packSize: selectedSize,
                        qty: qty < entry.moq ? entry.moq : qty,
                        moq: entry.moq,
                        productName: entry.productName,
                      });
                    }}
                  >
                    Add
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
