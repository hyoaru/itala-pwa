import {
  AllTransactionsPanel,
  AsyncBoundary,
} from "@/infrastructure/components";
import { useAuthenticationSessionContext } from "@/infrastructure/contexts/authentication-session";
import { Button, Tabs } from "@heroui/react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowUpRight, SquareArrowUpRight } from "lucide-react";

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
  const transactionTabs = [
    { name: "all", panel: AllTransactionsPanel },
    { name: "income", panel: AllTransactionsPanel },
    { name: "expense", panel: AllTransactionsPanel },
  ];

  return (
    <>
      <div className="flex w-full flex-col space-y-4 self-stretch">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm">
            {greeting}, {user?.firstName}
          </p>
          <div className="bg-accent rounded-full">
            <p className="p-1 text-xs font-semibold">{initials}</p>
          </div>
        </div>
        <div className="bg-default rounded-3xl p-5">
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
        <div className="flex flex-1 flex-col space-y-3">
          <p className="font-heading text-sm font-medium">
            Recent transactions
          </p>
          <Tabs className="flex flex-1 flex-col">
            <div className="flex items-center">
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
              <Button isIconOnly size="sm" variant="secondary" className="">
                <ArrowUpRight className="size-6" />
              </Button>
            </div>
            <div className="h-full bg-black">hey</div>
            {/* <div className="flex-1 border">test</div> */}
            {/* {transactionTabs.map((item) => ( */}
            {/*   <div key={`TabPanel-${item.name}`} className="h-full border"> */}
            {/*     <AsyncBoundary> */}
            {/*       <item.panel id={item.name} /> */}
            {/*     </AsyncBoundary> */}
            {/*   </div> */}
            {/* ))} */}
          </Tabs>
        </div>
      </div>
    </>
  );
}
