import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/account/")({
  component: () => {
    return <div>hello</div>;
  },
  loader: async () => {
    return redirect({
      to: "/dashboard/account/profile",
    });
  },
});
