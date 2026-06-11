import LegacyB2BNotice from "../components/LegacyB2BNotice";
import OrderPage from "../../pages/OrderPage";

export default function LegacyB2BSolidColoursPage() {
  return (
    <LegacyB2BNotice targetPath="/b2b/solid-colours">
      <OrderPage categoryKey="solidColour" />
    </LegacyB2BNotice>
  );
}
