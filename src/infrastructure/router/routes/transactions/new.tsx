import { Button } from "@heroui/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ArrowRight, Shapes, WalletCards } from "lucide-react";

export const Route = createFileRoute("/transactions/new")({
  beforeLoad: ({ context }) => {
    if (!context.authenticationSession.isAuthenticated) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-muted text-sm">Cancel</p>
          <p className="text-sm font-semibold">EXPENSE</p>
        </div>

        <div className="space-y-1 rounded-3xl p-5 text-center">
          <p className="text-muted text-sm">How much was did you spend?</p>
          <p className="font-heading text-4xl font-semibold">₱0.00</p>
        </div>

        <div className="bg-default-soft flex w-full justify-between rounded-3xl p-3 text-sm">
          <p className="font-medium">
            <Shapes className="me-2 inline h-[1.2em] w-[1.2em]" />
            Choose a category
          </p>
          <ArrowRight className="text-muted h-[1.2em] w-[1.2em]" />
        </div>

        <div className="bg-default-soft flex w-full justify-between rounded-3xl p-3 text-sm">
          <p className="font-medium">
            <WalletCards className="me-2 inline h-[1.2em] w-[1.2em]" />
            BPI Savings
          </p>
          <ArrowRight className="text-muted h-[1.2em] w-[1.2em]" />
        </div>

        <Button className="w-full">Save expense</Button>
      </div>
    </>
  );
}
