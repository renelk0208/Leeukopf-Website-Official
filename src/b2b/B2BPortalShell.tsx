import { Outlet } from "react-router-dom";
import B2BLayout from "./components/B2BLayout";
import { B2BCartProvider } from "./store/B2BCartContext";

export default function B2BPortalShell() {
  return (
    <B2BCartProvider>
      <B2BLayout>
        <Outlet />
      </B2BLayout>
    </B2BCartProvider>
  );
}
