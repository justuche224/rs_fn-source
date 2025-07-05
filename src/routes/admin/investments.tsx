import AdminInvestmentsPage from '@/components/admin/investment-list';
import { authClient } from '@/lib/auth-client';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/investments')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/admin/investments" },
      });
    }
    if (data.user.role !== "ADMIN") {
      return redirect({ to: "/dashboard" });
    }
  },
  errorComponent: ({ error }) => {
    const errorMsg = error.message ?? "An error occurred";
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  },
})

function RouteComponent() {
  return <AdminInvestmentsPage/>
}
