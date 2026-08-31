import { TransactionType } from "@/domain/value-objects";
import {
  AccountBalanceCarousel,
  AsyncBoundary,
  TransactionsPanel,
} from "@/infrastructure/components";
import { useAuthenticationSessionContext } from "@/infrastructure/contexts/authentication-session";
import { Button, Popover, Tabs } from "@heroui/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowUpRight, Ellipsis, Shapes, WalletCards } from "lucide-react";
import { useState } from "react";

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

  const [selectedAccountId, setSelectedAccountId] = useState<
    string | undefined
  >();

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
        <div className="h-30">
          <AsyncBoundary>
            <AccountBalanceCarousel onSelect={setSelectedAccountId} />
          </AsyncBoundary>
        </div>
        <div className="flex justify-between gap-3">
          <Popover>
            <Button className="w-full font-semibold">View insights</Button>
            <Popover.Content placement="right" className="max-w-48">
              <Popover.Dialog className="p-2 px-3">
                <Popover.Arrow />
                <Popover.Heading>Coming soon</Popover.Heading>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
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
              <Popover>
                <Button isIconOnly size="sm" variant="secondary">
                  <Ellipsis className="h-[1.5em] w-[1.5em]" />
                </Button>
                <Popover.Content placement="left" className="max-w-48">
                  <Popover.Dialog className="p-1">
                    <Popover.Arrow />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start gap-3"
                    >
                      <WalletCards />
                      Manage accounts
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-start gap-3"
                    >
                      <Shapes />
                      Manage categories
                    </Button>
                  </Popover.Dialog>
                </Popover.Content>
              </Popover>
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-0">
                <AsyncBoundary>
                  {transactionTabs.map((item) => {
                    return (
                      <TransactionsPanel
                        query={{ ...item.query, accountId: selectedAccountId }}
                        key={`TabPanel-${item.name}`}
                        id={item.name}
                      />
                    );
                  })}
                </AsyncBoundary>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
}
