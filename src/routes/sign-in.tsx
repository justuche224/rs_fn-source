import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginForm } from "@/components/auth/sign-in";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  validateSearch: (Search) => {
    return z
      .object({
        callbackURL: z.string().optional(),
      })
      .parse(Search);
  },
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (data?.session) {
      return redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  const { callbackURL } = Route.useSearch();
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm callbackURL={callbackURL} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/assets/images/banner/banner-bg3.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
