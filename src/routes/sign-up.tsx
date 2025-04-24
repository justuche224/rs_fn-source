import { RegisterForm } from "@/components/auth/sign-up";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
  validateSearch: (Search) => {
    return z
      .object({
        callbackURL: z.string().optional(),
        refCode: z.string().optional(),
      })
      .parse(Search);
  },
  loader: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (data?.session && data?.user.role === "ADMIN") {
      return redirect({ to: "/admin" });
    }
    if (data?.session) {
      return redirect({ to: "/dashboard" });
    }
  },
});
function RouteComponent() {
  const { callbackURL, refCode } = Route.useSearch();
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm callbackURL={callbackURL} refCode={refCode} />
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
