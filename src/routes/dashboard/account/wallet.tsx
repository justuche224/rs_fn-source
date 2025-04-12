import UserWalletPage from "@/components/dashboard/user-wallet-page";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/dashboard/account/wallet")({
  component: RouteComponent,
  validateSearch: (Search) => {
    return z
      .object({
        callbackURL: z.string().optional(),
      })
      .parse(Search);
  },
  loader: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/dashboard/account/wallet" },
      });
    }
  },
});

function RouteComponent() {
  const { callbackURL } = Route.useSearch();
  return <UserWalletPage callbackURL={callbackURL} />;
}
