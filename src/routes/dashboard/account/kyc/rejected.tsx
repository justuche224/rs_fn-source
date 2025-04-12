import { KYCInfo } from "@/components/dashboard/kyc-info";
import { authClient } from "@/lib/auth-client";
import { checkKYCStatus } from "@/utils/ktc-status";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/account/kyc/rejected")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session) {
      return redirect({ to: "/sign-in" });
    }
    const status = await checkKYCStatus();
    if (status !== "REJECTED") {
      return redirect({ to: "/dashboard/account/kyc" });
    }
  },
});

function RouteComponent() {
  return <KYCInfo />;
}
