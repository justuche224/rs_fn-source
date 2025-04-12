import { ForgotPasswordForm } from "@/components/auth/forgot-password";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/forgot-password")({
  component: RouteComponent,
  validateSearch: (Search) => {
    return z
      .object({
        callbackURL: z.string().optional(),
      })
      .parse(Search);
  },
});
function RouteComponent() {
  const { callbackURL } = Route.useSearch();
  return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <ForgotPasswordForm callbackURL={callbackURL} />
        </div>
      </div>
  );
}
