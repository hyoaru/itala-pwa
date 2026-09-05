import { TransactionType } from "@/domain/value-objects";
import {
  AccountBalanceCarousel,
  AsyncBoundary,
  TransactionsPanel,
} from "@/infrastructure/components";
import { useAuthenticationSessionContext } from "@/infrastructure/contexts/authentication-session";
import {
  useGreeting,
  useIdentityActions,
  useThemeMode,
} from "@/infrastructure/hooks";
import { useMutation } from "@tanstack/react-query";
import { Button, Popover, Tabs, useOverlayState } from "@heroui/react";
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import {
  Ellipsis,
  LogOut,
  Monitor,
  Moon,
  Shapes,
  Sun,
  User,
  WalletCards,
} from "lucide-react";
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

function RouteComponent() {
  const { user, clearSession } = useAuthenticationSessionContext();
  const {
    modes,
    isAllowedUser,
    currentMode,
    onModeChange,
    onLightDarkChange,
    isLightDarkActive,
  } = useThemeMode();
  const popoverState = useOverlayState();
  const greeting = useGreeting();
  const initials = (user?.firstName ?? "A")?.[0] + user?.lastName?.[0];
  const router = useRouter();
  const { signOut } = useIdentityActions();
  const signOutMutation = useMutation(signOut());

  const [selectedAccountId, setSelectedAccountId] = useState<
    string | undefined
  >();

  const transactionTabs: TransactionTab[] = [
    { name: "all" },
    { name: "income", query: { type: TransactionType.Income } },
    { name: "expense", query: { type: TransactionType.Expense } },
  ];

  const onSignOut = async () => {
    popoverState.close();
    await signOutMutation.mutateAsync().catch(() => {});
    clearSession();
    router.navigate({ to: "/sign-in" });
  };

  return (
    <>
      <div className="flex h-full w-full flex-col space-y-3">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm">
            {greeting}, {isAllowedUser ? "my love" : user?.firstName}
          </p>

          <Popover>
            <Button isIconOnly size="sm" variant="primary" className="">
              <p className="p-1 text-xs font-semibold">{initials ?? "@"}</p>
            </Button>
            <Popover.Content placement="left top" className="max-w-34">
              <Popover.Dialog className="p-1">
                <Popover.Arrow />
                {isAllowedUser && modes.length > 1 && (
                  <div className="flex gap-1 rounded-2xl px-1 pb-1">
                    {modes.map((mode) => (
                      <Button
                        key={mode.id}
                        size="sm"
                        variant={currentMode === mode.id ? "primary" : "ghost"}
                        className="flex-1 justify-center"
                        onClick={() => onModeChange(mode.id)}
                      >
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="flex gap-1 rounded-2xl px-1 pb-1">
                  {[
                    { id: "system" as const, icon: Monitor },
                    { id: "light" as const, icon: Sun },
                    { id: "dark" as const, icon: Moon },
                  ].map(({ id, icon: Icon }) => (
                    <Button
                      key={id}
                      size="sm"
                      variant={isLightDarkActive(id) ? "primary" : "ghost"}
                      className="flex-1 justify-center gap-1"
                      onClick={() => {
                        onLightDarkChange(id);
                        popoverState.close();
                      }}
                    >
                      <Icon className="" />
                    </Button>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled
                  className="w-full justify-start gap-3"
                >
                  <User />
                  Identity
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger w-full justify-start gap-3"
                  onClick={onSignOut}
                >
                  <LogOut />
                  Sign out
                </Button>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
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
                  <Tabs.List className="**:data-[slot=tabs-indicator]:bg-accent **:data-[slot=tabs-tab]:data-[selected=true]:text-accent-foreground">
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
              <Popover
                isOpen={popoverState.isOpen}
                onOpenChange={popoverState.setOpen}
              >
                <Button isIconOnly size="sm" variant="secondary">
                  <Ellipsis className="h-[1.5em] w-[1.5em]" />
                </Button>
                <Popover.Content placement="left" className="max-w-48">
                  <Popover.Dialog className="p-1">
                    <Popover.Arrow />
                    <Link
                      to="/accounts"
                      className="button button--ghost w-full justify-start gap-3"
                    >
                      <WalletCards />
                      Manage accounts
                    </Link>
                    <Link
                      to="/categories"
                      className="button button--ghost w-full justify-start gap-3"
                    >
                      <Shapes />
                      Manage categories
                    </Link>
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
