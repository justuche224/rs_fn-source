import { authClient } from "@/lib/auth-client";
import { checkKYCStatus } from "@/utils/ktc-status";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/account/kyc/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session) {
      return redirect({ to: "/sign-in" });
    }
    const status = await checkKYCStatus();
    if (status === "NOT_SUBMITTED") {
      return redirect({ to: "/dashboard/account/kyc/not-submitted" });
    } else if (status === "PENDING") {
      return redirect({ to: "/dashboard/account/kyc/pending" });
    } else if (status === "APPROVED") {
      return redirect({ to: "/dashboard/account/kyc/approved" });
    } else if (status === "REJECTED") {
      return redirect({ to: "/dashboard/account/kyc/rejected" });
    }
  },
});

function RouteComponent() {
  return <div>Hello "/dashboard/account/kyc"!</div>;
}
