import { Link, useLocation } from 'react-router-dom';

function getPendingEmail(search: string): string {
  const params = new URLSearchParams(search);
  return params.get('email')?.trim() || '';
}

export default function PortalPendingApprovalPage() {
  const location = useLocation();
  const pendingEmail = getPendingEmail(location.search);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-xl rounded-2xl border border-grey-card bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-grey-primary">Account pending approval</h1>
        <p className="mt-2 text-sm text-grey-secondary">
          Your account was created successfully.
        </p>
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Portal ordering access is enabled only after Leeukopf approves your company profile.
        </div>

        {pendingEmail ? (
          <p className="mt-4 text-sm text-grey-secondary">
            Pending account: <span className="font-semibold text-grey-primary">{pendingEmail}</span>
          </p>
        ) : null}

        <div className="mt-6 space-y-3">
          <p className="text-sm text-grey-secondary">Next steps:</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-grey-secondary">
            <li>Submit your company registration if you have not already done it.</li>
            <li>Wait for approval from Leeukopf.</li>
            <li>Return to portal login and sign in once approved.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link to="/portal/login" className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90">
            Back to portal login
          </Link>
          <Link to="/portal/register" className="font-medium text-primary hover:text-primary-700">
            Submit company registration
          </Link>
        </div>
      </div>
    </div>
  );
}
