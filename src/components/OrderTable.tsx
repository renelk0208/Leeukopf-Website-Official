import { useMemo, useState } from "react";
import { getBuilderGelCatalog } from "../lib/catalog";
import { useCart } from "../contexts/CartContext";
import type { CatalogEntry } from "../types/catalog";

interface Props {
  groupCode: string;
}

export default function OrderTable({ groupCode }: Props) {
  const { addItem } = useCart();
  type CartPackSize = Parameters<typeof addItem>[0]["packSize"];
  type ShadeValue = CatalogEntry["shades"][number] | string;

  const resolveShade = (shade: ShadeValue) => {
    if (typeof shade === "string") {
      return { shadeCode: shade, shadeName: "" };
    }
    return {
      shadeCode: shade.shadeCode,
      shadeName: shade.shadeName ?? "",
    };
  };

  // Load catalog synchronously (your project is already using this style)
  const catalog = getBuilderGelCatalog();

  // Find the matching product group
  const entry = useMemo(() => {
    return catalog.find((e) => e.groupCode === groupCode);
  }, [catalog, groupCode]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sizes, setSizes] = useState<Record<string, CartPackSize>>({});
  function addAllShades() {
    if (!entry) return;

    (entry.shades as ShadeValue[]).forEach((shade) => {
      const { shadeCode } = resolveShade(shade);

      const selectedSize =
        sizes[shadeCode] ?? entry.allowedPackSizes?.[0] ?? "15g";

      const qty = quantities[shadeCode] ?? entry.moq;

      addItem({
        groupCode: entry.groupCode,
        shadeCode,
        packSize: selectedSize,
        qty: qty < entry.moq ? entry.moq : qty,
        moq: entry.moq,
        productName: entry.productName,
      });
    });
  }
if (!entry) {
  return null;
}

return (
    <section style={styles.section}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.productTitle}>{entry.productName}</h2>
          <p style={styles.subTitle}>
            MOQ per shade: <b>{entry.moq}</b>
          </p>
        </div>

        <button style={styles.addAllBtn} onClick={addAllShades}>
          Add all shades
        </button>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "40%" }}>Shade</th>
              <th style={{ ...styles.th, width: "20%" }}>Size</th>
              <th style={{ ...styles.th, width: "25%" }}>Quantity</th>
              <th style={{ ...styles.th, width: "15%" }}></th>
            </tr>
          </thead>

          <tbody>
            {(entry.shades as ShadeValue[]).map((shade) => {
              const { shadeCode, shadeName } = resolveShade(shade);

              const defaultPackSize = (entry.allowedPackSizes?.[0] ?? "15g") as CartPackSize;
              const selectedSize = sizes[shadeCode] ?? defaultPackSize;

              const qty = quantities[shadeCode] ?? entry.moq;

              const qtyIsBelowMoq = qty < entry.moq;

              return (
                <tr key={shadeCode} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.shadeBlock}>
                      <div style={styles.shadeCode}>{shadeCode}</div>
                      {shadeName ? (
                        <div style={styles.shadeName}>{shadeName}</div>
                      ) : null}
                    </div>
                  </td>

                  <td style={styles.td}>
                    <select
                      style={styles.select}
                      value={selectedSize}
                      onChange={(e) =>
                        setSizes({
                          ...sizes,
                          [shadeCode]: e.target.value as CartPackSize,
                        })
                      }
                    >
                      {(entry.allowedPackSizes ?? ["15g"]).map((size: string) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td style={styles.td}>
                    <div style={styles.qtyWrap}>
                      <input
                        style={{
                          ...styles.input,
                          ...(qtyIsBelowMoq ? styles.inputError : {}),
                        }}
                        type="number"
                        min={entry.moq}
                        value={qty}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [shadeCode]: Number(e.target.value),
                          })
                        }
                      />
                      {qtyIsBelowMoq ? (
                        <div style={styles.moqHint}>
                          Min {entry.moq}
                        </div>
                      ) : (
                        <div style={styles.moqHintOk}>OK</div>
                      )}
                    </div>
                  </td>

                  <td style={styles.tdRight}>
                    <button
                      style={styles.addBtn}
                      onClick={() =>
                        addItem({
                          groupCode: entry.groupCode,
                          shadeCode,
                          packSize: selectedSize,
                          qty: qty < entry.moq ? entry.moq : qty,
                          moq: entry.moq,
                          productName: entry.productName,
                        })
                      }
                      title="Add to cart"
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

      <div style={styles.footerNote}>
        Tip: quantity is enforced to MOQ when you press <b>Add</b>.
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginTop: 18,
    marginBottom: 28,
  },
  card: {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 14,
    padding: 16,
    background: "#fff",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    marginBottom: 10,
  },
  productTitle: {
    margin: 0,
    fontSize: 22,
    letterSpacing: 0.2,
  },
  subTitle: {
    margin: "6px 0 0 0",
    opacity: 0.75,
    fontSize: 13,
  },
  tableWrap: {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 14px",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    opacity: 0.8,
    background: "rgba(0,0,0,0.03)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  },
  tr: {
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  },
  td: {
    padding: "12px 14px",
    verticalAlign: "middle",
  },
  tdRight: {
    padding: "12px 14px",
    verticalAlign: "middle",
    textAlign: "right",
  },
  shadeBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  shadeCode: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 0.3,
  },
  shadeName: {
    fontSize: 12,
    opacity: 0.7,
  },
  select: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "#fff",
  },
  qtyWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  input: {
    width: 110,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "#fff",
  },
  inputError: {
    border: "1px solid rgba(220, 38, 38, 0.65)",
    outline: "2px solid rgba(220, 38, 38, 0.10)",
  },
  moqHint: {
    fontSize: 12,
    color: "rgb(220, 38, 38)",
    fontWeight: 600,
  },
  moqHintOk: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: 600,
  },
  addBtn: {
    padding: "9px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  addAllBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
  },
};
