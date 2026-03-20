import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import B2BLayout from "./components/B2BLayout";
import B2BBuyerTypeModal from "./components/B2BBuyerTypeModal";
import { B2BCartProvider, useB2BCart } from "./store/B2BCartContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import type { BuyerType, PriceTier } from "./types";

function B2BPortalContent() {
  const { buyerType, setBuyerType, priceTier, setPriceTier } = useB2BCart();
  const { user } = useAuth();
  const [isAdminStaff, setIsAdminStaff] = useState(false);

  // Seed buyer type and price tier from the client registration record once on login.
  // Also checks admin_staff — if admin, skips buyer type modal and hides client-facing nav items.
  useEffect(() => {
    const email = user?.email?.trim().toLowerCase();
    if (!email) return;

    let active = true;

    const seed = async () => {
      // Check admin_staff first
      const { data: staffData } = await supabase
        .from("admin_staff")
        .select("is_active")
        .eq("email", email)
        .eq("is_active", true)
        .maybeSingle();

      if (!active) return;

      if (staffData) {
        setIsAdminStaff(true);
        // Auto-set so the buyer type modal never appears
        if (buyerType === null) setBuyerType("finished_goods");
        return;
      }

      if (buyerType !== null && priceTier !== null) return; // already set

      const { data } = await supabase
        .from("client_registrations")
        .select("buyer_type, price_tier")
        .ilike("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active) return;
      const bt = data?.buyer_type as BuyerType | null | undefined;
      if (bt === "finished_goods" || bt === "bulk") {
        setBuyerType(bt);
      }
      const pt = data?.price_tier as PriceTier | null | undefined;
      if (pt && pt.trim().length > 0) {
        setPriceTier(pt.trim());
      }
    };

    void seed();
    return () => { active = false; };
  }, [user?.email, buyerType, priceTier, setBuyerType, setPriceTier]);

  return (
    <>
      {buyerType === null && !isAdminStaff && <B2BBuyerTypeModal />}
      <B2BLayout isAdminStaff={isAdminStaff}>
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
