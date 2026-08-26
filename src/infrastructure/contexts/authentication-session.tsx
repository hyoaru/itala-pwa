import { AuthenticatedSession, User } from "@/domain/entities";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { identityActions } from "../actions";

export type AuthenticationSessionState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: AuthenticatedSession) => void;
  clearSession: () => void;
};

export const AuthenticationSessionContext = createContext<
  AuthenticationSessionState | undefined
>(undefined);

export function AuthenticationSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_, setSessionState] = useState<AuthenticatedSession | null>(null);
  const refreshSessionMutation = useMutation(identityActions.refresh());

  const createUserFromIdToken = (idToken: string): User => {
    const idClaims = jwtDecode<{
      sub: string;
      email: string;
      "custom:first_name": string;
      "custom:last_name": string;
    }>(idToken);

    return new User({
      id: idClaims.sub,
      email: idClaims.email,
      firstName: idClaims["custom:first_name"],
      lastName: idClaims["custom:last_name"],
    });
  };

  const setSession = (newSession: AuthenticatedSession) => {
    localStorage.setItem("ACCESS_TOKEN", newSession.accessToken);
    localStorage.setItem("ID_TOKEN", newSession.idToken);
    localStorage.setItem("REFRESH_TOKEN", newSession.refreshToken);

    setUser(createUserFromIdToken(newSession.idToken));
    setSessionState(newSession);
  };

  const clearSession = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("ID_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");

    setUser(null);
    setSessionState(null);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    const idToken = localStorage.getItem("ID_TOKEN");
    const refreshToken = localStorage.getItem("REFRESH_TOKEN");

    if (!accessToken || !idToken || !refreshToken) {
      clearSession();
      setIsLoading(false);
      return;
    }

    try {
      const accessClaims = jwtDecode<{ exp: number }>(accessToken);
      const now = Math.floor(Date.now() / 1000);

      if (now >= accessClaims.exp) {
        const refreshSession = async () => {
          try {
            const refreshedSession = await refreshSessionMutation.mutateAsync({
              refreshToken: refreshToken,
            });

            setUser(createUserFromIdToken(refreshedSession.idToken));
            setSessionState(refreshedSession);
          } catch {
            clearSession();
          }
        };
        refreshSession();
      } else {
        const restoredSession = new AuthenticatedSession({
          accessToken,
          idToken,
          refreshToken,
        });

        setUser(createUserFromIdToken(idToken));
        setSessionState(restoredSession);
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [refreshSessionMutation]);

  const isAuthenticated = user !== null;

  return (
    <AuthenticationSessionContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthenticationSessionContext.Provider>
  );
}

export function useAuthenticationSessionContext() {
  const context = useContext(AuthenticationSessionContext);
  if (!context) {
    throw new Error(
      "useAuthenticationSessionContext must be used within a AuthenticationSessionProvider",
    );
  }
  return context;
}
