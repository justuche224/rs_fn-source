import UserTransactions from "@/components/dashboard/all-history";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/all-history")({
  component: RouteComponent,
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
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session || !data?.user) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/dashboard/all-history" },
      });
    }
  },
  loader: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session || !data?.user) {
      throw new Error("Unauthorized");
    }
    return { user: data.user };
  },
});
function RouteComponent() {
  const { user } = Route.useLoaderData();
  return <UserTransactions userId={user.id} />;
}
