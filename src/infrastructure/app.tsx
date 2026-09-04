import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "@tanstack/react-router";
import { useState } from "react";
import { Initializing } from "./components/defaults";
import {
  AuthenticationSessionProvider,
  useAuthenticationSessionContext,
} from "./contexts/authentication-session";
import { router } from "./router";

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000 * 60,
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      themes={["light", "dark", "jiya-light", "jiya-dark"]}
    >
      <QueryClientProvider client={queryClient}>
        <AuthenticationSessionProvider>
          <InnerApp />
        </AuthenticationSessionProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function InnerApp() {
  const queryClient = useQueryClient();
  const authenticationSession = useAuthenticationSessionContext();
  if (authenticationSession.isLoading) return <Initializing />;

  return (
    <RouterProvider
      router={router}
      context={{ queryClient, authenticationSession }}
    />
  );
}
