import {
  AccountList,
  AsyncBoundary,
  NewAccountModal,
} from "@/infrastructure/components";
import { Button, useOverlayState } from "@heroui/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/accounts/")({
  beforeLoad: ({ context }) => {
    if (!context.authenticationSession.isAuthenticated) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const createAccountModalState = useOverlayState();

  return (
    <>
      <div className="flex h-full w-full flex-col gap-y-3">
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="button button--icon button--secondary">
            <ArrowLeft className="" />
          </Link>
          <Button
            onClick={createAccountModalState.open}
            className="uppercase"
            variant="ghost"
          >
            Create
          </Button>
        </div>

        <div className="flex w-full flex-1 flex-col gap-y-3">
          <div className="strink flex min-h-0 flex-col items-center">
            <p className="font-heading text-2xl font-medium">Accounts</p>
            <p className="text-muted text-sm">
              Manage your accounts and keep track of your balances.
            </p>
          </div>

          <div className="relative h-full flex-1">
            <div className="absolute h-full min-h-0 w-full">
              <AsyncBoundary>
                <AccountList />
              </AsyncBoundary>
            </div>
          </div>
        </div>
      </div>

      <NewAccountModal
        isOpen={createAccountModalState.isOpen}
        onOpenChange={createAccountModalState.setOpen}
      />
    </>
  );
}
