import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type LegacyB2BNoticeProps = {
  targetPath: string;
  children: ReactNode;
};

export default function LegacyB2BNotice({ targetPath, children }: LegacyB2BNoticeProps) {
  return (
    <>
      <div className="mx-auto mt-24 max-w-6xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
        <span className="font-semibold">Moved to the B2B Portal.</span>{" "}
        <Link to={targetPath} className="font-semibold underline hover:no-underline">
          Open the new flow
        </Link>
      </div>
      {children}
    </>
  );
}
