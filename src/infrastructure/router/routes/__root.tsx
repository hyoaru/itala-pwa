import { Loading } from "@/infrastructure/components/defaults";
import type { AuthenticationSessionState } from "@/infrastructure/contexts/authentication-session";
import { Toast } from "@heroui/react";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  authenticationSession: AuthenticationSessionState;
}>()({
  component: Root,
  pendingComponent: Loading,
});

function Root() {
  return (
    <>
      <div className="h-dvh items-start justify-start p-8">
        <Outlet />
      </div>
      <Toast.Provider />
    </>
  );
}
