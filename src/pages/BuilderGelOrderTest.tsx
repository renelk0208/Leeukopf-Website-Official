import OrderTable from "../components/OrderTable";

export default function BuilderGelOrderTest() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Builder Gel Order Test</h1>

      {/* Test with your groupCode from the JSON */}
      <OrderTable groupCode="UGI-LM" />
    </div>
  );
}
