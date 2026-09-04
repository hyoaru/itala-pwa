import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.authenticationSession.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex h-full w-full flex-col justify-end gap-4 py-8">
        <div className="flex w-full flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1 text-4xl">
            <NotebookPen className="bg-accent text-accent-foreground h-[1em] w-[1em] rounded-xl p-0.5" />
            <span className="font-heading font-semibold">ITALA</span>
          </span>
          <p className="font-heading text-xl font-medium">
            Spend with intention.
          </p>
          <p className="text-muted w-3/4 text-center text-xs sm:text-sm">
            A calmer way to track every peso, plan ahead, and feel in control.
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <Link to="/sign-up" className="button button--primary w-full">
            Create an account
          </Link>
          <Link to="/sign-in" className="button button--secondary w-full">
            I already have an account
          </Link>
        </div>
      </div>
    </>
  );
}
