import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import B2BLayout from "./components/B2BLayout";
import B2BBuyerTypeModal from "./components/B2BBuyerTypeModal";
import { B2BCartProvider, useB2BCart } from "./store/B2BCartContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import type { BuyerType } from "./types";

function B2BPortalContent() {
  const { buyerType, setBuyerType } = useB2BCart();
  const { user } = useAuth();

  // Seed buyer type from the client registration record once on login
  useEffect(() => {
    if (buyerType !== null) return; // already set (localStorage or manually chosen)
    const email = user?.email?.trim().toLowerCase();
    if (!email) return;

    let active = true;
    supabase
      .from("client_registrations")
      .select("buyer_type")
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
      });

    return () => { active = false; };
  }, [user?.email, buyerType, setBuyerType]);

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
