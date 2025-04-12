import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ref/$refId")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const { refId } = params;
    return redirect({ to: "/sign-up", search: { refCode: refId } });
  },
});

function RouteComponent() {
  return <div>Hello "/ref/$refId"!</div>;
}
