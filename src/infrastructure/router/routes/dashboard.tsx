import { useAuthenticationSessionContext } from "@/infrastructure/contexts/authentication-session";
import { Button } from "@heroui/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.authenticationSession.isAuthenticated) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

function getGreeting(): string {
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) {
    return "Good morning";
  } else if (hours >= 12 && hours < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

function RouteComponent() {
  const { user } = useAuthenticationSessionContext();
  const greeting = getGreeting();
  const initials = (user?.firstName ?? "A")?.[0] + user?.lastName?.[0];

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex w-full items-center justify-between">
          <p className="text-muted text-sm">
            {greeting}, {user?.firstName}
          </p>
          <div className="bg-accent rounded-full">
            <p className="p-1 text-xs font-semibold">{initials}</p>
          </div>
        </div>
        <div className="bg-default-soft rounded-3xl p-5">
          <div className="space-y-1">
            <p className="text-muted text-sm">Available balance</p>
            <p className="font-heading text-4xl font-semibold">₱4,280.50</p>
          </div>
          <p className="text-sm font-medium">+ ₱500 this month </p>
        </div>
        <div className="flex justify-between gap-3">
          <Button className="w-full font-semibold">View insights</Button>
          <Link
            to="/transactions/new"
            className="button button--secondary w-full font-semibold"
          >
            Add transaction
          </Link>
        </div>
        <div className="space-y-3">
          <p className="font-heading text-sm font-medium">
            Recent transactions
          </p>
          <div className="space-y-2">
            <div className="bg-default-soft flex justify-between rounded-3xl p-3 text-sm">
              <p className="font-medium">Coffee shop</p>
              <p className="font-semibold">-₱4.80</p>
            </div>
            <div className="bg-default-soft flex justify-between rounded-3xl p-3 text-sm">
              <p className="font-medium">Coffee shop</p>
              <p className="font-semibold">-₱4.80</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
