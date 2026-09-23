import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/transactions/")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  return <div>Hello "/transactions/"!</div>;
}
