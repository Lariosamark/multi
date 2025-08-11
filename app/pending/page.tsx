export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4 text-yellow-600">Account Pending Approval</h1>
        <p className="text-gray-700 mb-6">
          Your account is currently pending approval by an administrator. Please wait for approval before accessing the dashboard.
        </p>
        <p className="text-sm text-gray-500">You will receive an email notification once your account is approved.</p>
      </div>
    </div>
  );
}
