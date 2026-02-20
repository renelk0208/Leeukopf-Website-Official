import LegacyB2BNotice from "../components/LegacyB2BNotice";
import LegacyCheckoutPage from "../../pages/B2BBuilderGelsPage";

export default function LegacyB2BBuilderGelsPage() {
  return (
    <LegacyB2BNotice targetPath="/b2b/builder-gels">
      <LegacyCheckoutPage />
    </LegacyB2BNotice>
  );
}
