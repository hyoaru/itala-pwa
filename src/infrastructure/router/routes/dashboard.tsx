import { TransactionType } from "@/domain/value-objects";
import { AsyncBoundary, TransactionsPanel } from "@/infrastructure/components";
import { useAuthenticationSessionContext } from "@/infrastructure/contexts/authentication-session";
import { Button, Tabs } from "@heroui/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.authenticationSession.isAuthenticated) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

type TransactionTab = {
  name: string;
  query?: Parameters<typeof TransactionsPanel>[0]["query"];
};

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
  const transactionTabs: TransactionTab[] = [
    { name: "all" },
    { name: "income", query: { type: TransactionType.Income } },
    { name: "expense", query: { type: TransactionType.Expense } },
  ];

  return (
    <>
      <div className="flex h-full w-full flex-col space-y-3">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm">
            {greeting}, {user?.firstName}
          </p>

          <Button isIconOnly size="sm" variant="primary" className="">
            <p className="p-1 text-xs font-semibold">{initials}</p>
          </Button>
        </div>
        <div className="bg-default rounded-3xl p-5">
          <div className="space-y-1">
            <p className="text-muted text-xs">Available balance</p>
            <p className="font-heading text-4xl font-semibold">₱4,280.50</p>
          </div>
          <p className="text-xs font-medium">+ ₱500 this month </p>
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
        <div className="flex flex-1 flex-col space-y-3">
          <p className="font-heading shrink text-sm font-medium">
            Recent transactions
          </p>
          <Tabs className="flex flex-1 flex-col">
            <div className="flex shrink items-center">
              <div className="grow">
                <Tabs.ListContainer className="bg-default w-max">
                  <Tabs.List className="**:data-[slot=tabs-indicator]:bg-accent">
                    {transactionTabs.map((item) => (
                      <Tabs.Tab
                        className="capitalize"
                        key={item.name}
                        id={item.name}
                      >
                        {item.name}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </Tabs.ListContainer>
              </div>
              <Button isIconOnly size="sm" variant="secondary">
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-0">
                <AsyncBoundary>
                  {transactionTabs.map((item) => (
                    <TransactionsPanel
                      query={item.query}
                      key={`TabPanel-${item.name}`}
                      id={item.name}
                    />
                  ))}
                </AsyncBoundary>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}
