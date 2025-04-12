import PlanAdminPage from "@/components/admin/plans-list";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/plans/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/admin/plans" },
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
  return <PlanAdminPage />;
}
