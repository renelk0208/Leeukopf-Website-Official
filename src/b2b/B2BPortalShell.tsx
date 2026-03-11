import { useEffect } from "react";
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

  // Seed buyer type and price tier from the client registration record once on login
  useEffect(() => {
    if (buyerType !== null && priceTier !== null) return; // already set (localStorage or manually chosen)
    const email = user?.email?.trim().toLowerCase();
    if (!email) return;

    let active = true;
    supabase
      .from("client_registrations")
      .select("buyer_type, price_tier")
      .ilike("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        const bt = data?.buyer_type as BuyerType | null | undefined;
        if (bt === "finished_goods" || bt === "bulk") {
          setBuyerType(bt);
        }
        const pt = data?.price_tier as PriceTier | null | undefined;
        if (pt && pt.trim().length > 0) {
          setPriceTier(pt.trim());
        }
      });

    return () => { active = false; };
  }, [user?.email, buyerType, priceTier, setBuyerType, setPriceTier]);

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
