import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { redirect } from "@tanstack/react-router";
import KYCAdminPage from "@/components/admin/kyc-list";

export const Route = createFileRoute("/admin/kyc/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: `/admin/kyc/` },
      });
    }
    if (data.user.role !== "ADMIN") {
      return redirect({ to: "/dashboard" });
    }
  },
  errorComponent: ({ error }) => {
    const errorMsg = error.message ?? "An error occurred";
    return <div>{errorMsg}</div>;
  },
});

function RouteComponent() {
  return <KYCAdminPage />;
}
