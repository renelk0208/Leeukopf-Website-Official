import { Outlet } from "react-router-dom";
import B2BLayout from "./components/B2BLayout";
import B2BBuyerTypeModal from "./components/B2BBuyerTypeModal";
import { B2BCartProvider, useB2BCart } from "./store/B2BCartContext";

function B2BPortalContent() {
  const { buyerType } = useB2BCart();

  return (
    <>
      {buyerType === null && <B2BBuyerTypeModal />}
      <B2BLayout>
        <Outlet />
      </B2BLayout>
    </>
  );
}

export default function B2BPortalShell() {
  return (
    <B2BCartProvider>
      <B2BPortalContent />
    </B2BCartProvider>
  );
}
