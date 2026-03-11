import { useB2BCart } from "../store/B2BCartContext";
import type { BuyerType } from "../types";

type Card = {
  type: BuyerType;
  heading: string;
  sub: string;
  bullets: string[];
  icon: React.ReactNode;
};

const CARDS: Card[] = [
  {
    type: "finished_goods",
    heading: "Finished Goods Buyer",
    sub: "Pre-filled, labelled and ready-to-sell product",
    bullets: [
      "Order by the piece (pcs)",
      "Custom bottles, jars & labels",
      "MOQ from 5 pcs per colour",
      "Pre-printed or label-applied branding",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-12 w-12">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <rect x="9" y="5" width="6" height="3" rx="0.5" />
        <line x1="9" y1="11" x2="15" y2="11" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    type: "bulk",
    heading: "Bulk Buyer",
    sub: "Unfilled product by the kilogram for your own filling operation",
    bullets: [
      "Order by the kilogram (kg)",
      "1 kg flask or bucket (1 kg minimum)",
      "5 kg jerry can or bucket (5 kg minimum)",
      "Bonder supplied in litres (1 L minimum)",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-12 w-12">
        <path d="M6 3h12l2 5H4L6 3z" />
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="15" y2="16" />
      </svg>
    ),
  },
];

export default function B2BBuyerTypeModal() {
  const { setBuyerType } = useB2BCart();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="buyer-type-title"
    >
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <h2 id="buyer-type-title" className="text-2xl font-bold text-grey-primary">
            Welcome to the B2B Portal
          </h2>
          <p className="mt-2 text-sm text-grey-secondary">
            Please select your buyer type to continue. This determines your ordering options and packaging.
            You can change this at any time from the portal header.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <button
              key={card.type}
              onClick={() => setBuyerType(card.type)}
              className="flex flex-col items-start gap-4 rounded-xl border-2 border-grey-card bg-grey-offWhite p-5 text-left transition-all hover:border-primary hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="text-primary">{card.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-grey-primary">{card.heading}</h3>
                <p className="mt-1 text-sm text-grey-secondary">{card.sub}</p>
              </div>
              <ul className="mt-1 space-y-1">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-grey-primary">
                    <span className="mt-0.5 text-primary" aria-hidden="true">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <span className="mt-auto self-end rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-white">
                Select
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
