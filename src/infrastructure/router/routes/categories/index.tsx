import {
  AsyncBoundary,
  CategoriesList,
  NewCategoryModal,
} from "@/infrastructure/components";
import { Button, useOverlayState } from "@heroui/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/categories/")({
  beforeLoad: ({ context }) => {
    if (!context.authenticationSession.isAuthenticated) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const createCategoryModalState = useOverlayState();

  return (
    <>
      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="button button--icon button--secondary">
            <ArrowLeft className="" />
          </Link>
          <Button
            onClick={createCategoryModalState.open}
            className="uppercase"
            variant="ghost"
          >
            Create
          </Button>
        </div>

        <div className="flex w-full flex-1 flex-col space-y-3">
          <div className="flex flex-col items-center">
            <p className="font-heading text-2xl font-medium">Categories</p>
            <p className="text-muted text-sm">
              Keep your spending organized with categories that fit your life.
            </p>
          </div>

          <AsyncBoundary>
            <CategoriesList />
          </AsyncBoundary>
        </div>
      </div>

      <NewCategoryModal
        isOpen={createCategoryModalState.isOpen}
        onOpenChange={createCategoryModalState.setOpen}
      />
    </>
  );
}
