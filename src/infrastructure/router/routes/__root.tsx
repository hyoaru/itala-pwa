import { Footer, Loading } from "@/infrastructure/components";
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

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  return (
    <>
      <div className="container mx-auto h-dvh p-4">
        <div className="flex h-full flex-col items-start justify-start">
          <Outlet />
          <Footer />
        </div>
      </div>

      <Toast.Provider />
    </>
  );
}
