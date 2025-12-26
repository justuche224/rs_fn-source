import { authClient } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { MarketData } from "@/components/dashboard/market-data";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
        const { data } = await authClient.getSession(context);
    if (!data?.session) {
      throw redirect({ to: "/sign-in" });
    }
    if (data.user.role === "ADMIN") {
      throw redirect({ to: "/admin" });
    }
    return { user: data.user };
  },
  loader: async ({ context }) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    return { user };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome back to your financial overview."
      />
      <div className="grid gap-4 md:gap-6">
        <WelcomeBanner />
        <SummaryCards userId={user.id}/>
        <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-8 overflow-hidden">
            <MarketData />
          </div>
          <div className="md:col-span-3 lg:col-span-4 overflow-hidden">
            <QuickActions className="w-full" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden">
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
