import { authClient } from "@/lib/auth-client";
import { checkKYCStatus } from "@/utils/ktc-status";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { KYCInfo } from "@/components/dashboard/kyc-info";

export const Route = createFileRoute("/dashboard/account/kyc/pending")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session) {
      return redirect({ to: "/sign-in" });
    }
    const status = await checkKYCStatus();
    if (status !== "PENDING") {
      return redirect({ to: "/dashboard/account/kyc" });
    }
  },
});

function RouteComponent() {
  return <KYCInfo />;
}
