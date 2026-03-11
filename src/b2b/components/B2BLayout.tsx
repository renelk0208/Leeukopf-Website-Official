import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { b2bCategories } from "../config/categories";
import { useB2BCart } from "../store/B2BCartContext";

type B2BLayoutProps = {
  children: ReactNode;
};

export default function B2BLayout({ children }: B2BLayoutProps) {
  const { getTotals } = useB2BCart();
  const totals = getTotals();

  type NavLinkEntry = { type: "link"; label: string; path: string; isSubcategory?: boolean };
  type NavEntry =
    | NavLinkEntry
    | { type: "group"; label: string };

  const standaloneLinks: NavLinkEntry[] = [];
  const groupedLinks = new Map<string, NavLinkEntry[]>();

  b2bCategories
    .filter((category) => category.enabled)
    .forEach((category) => {
      if (category.navChildren?.length) {
        const nextGroup = groupedLinks.get(category.label) ?? [];

        category.navChildren.forEach((child) => {
          nextGroup.push({
            type: "link",
            label: child.label,
            path: child.routePath,
            isSubcategory: true,
          });
        });

        groupedLinks.set(category.label, nextGroup);
        return;
      }

      if (category.parentLabel) {
        const nextGroup = groupedLinks.get(category.parentLabel) ?? [];

        nextGroup.push({
          type: "link",
          label: category.label,
          path: category.routePath,
          isSubcategory: true,
        });

        groupedLinks.set(category.parentLabel, nextGroup);
        return;
      }

      standaloneLinks.push({
        type: "link",
        label: category.label,
        path: category.routePath,
      });
    });

  const sortByLabel = (a: { label: string }, b: { label: string }) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" });

  const categoryEntries: NavEntry[] = [];

  standaloneLinks
    .sort(sortByLabel)
    .forEach((link) => categoryEntries.push(link));

  [...groupedLinks.entries()]
    .sort(([groupA], [groupB]) => groupA.localeCompare(groupB, undefined, { sensitivity: "base" }))
    .forEach(([groupLabel, links]) => {
      categoryEntries.push({ type: "group", label: groupLabel });
      links
        .sort(sortByLabel)
        .forEach((link) => categoryEntries.push(link));
    });

  const navItems: NavEntry[] = [
    { type: "link", label: "Dashboard", path: "/b2b" },
    { type: "link", label: "Client Info", path: "/b2b/client-info" },
    { type: "link", label: "My Orders", path: "/b2b/orders" },
    ...categoryEntries,
    { type: "link", label: "Checkout", path: "/b2b/checkout" },
  ];

  return (
    <div className="min-h-screen bg-grey-offWhite">
      <header className="sticky top-0 z-30 border-b border-grey-card bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-grey-primary">B2B Portal</h1>
            <p className="text-sm text-grey-secondary">{totals.totalLines} items / {totals.totalQty} total units</p>
          </div>
          <Link
            to="/b2b/checkout"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Checkout ({totals.totalLines})
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-screen-2xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-grey-card bg-white p-3 lg:sticky lg:top-24">
          <nav className="space-y-1" aria-label="B2B portal navigation">
            {navItems.map((item) => (
              item.type === "group" ? null : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/b2b"}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      item.isSubcategory ? "ml-3" : ""
                    } ${isActive ? "bg-primary text-white" : "text-grey-primary hover:bg-primary-50"}`
                  }
                >
                  <span>{item.label}</span>
                  {item.path === "/b2b/checkout" && totals.totalLines > 0 ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      {totals.totalLines}
                    </span>
                  ) : null}
                </NavLink>
              )
            ))}
          </nav>
        </aside>

        <main className="rounded-xl border border-grey-card bg-white p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
