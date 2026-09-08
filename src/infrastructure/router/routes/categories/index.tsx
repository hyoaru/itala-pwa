import {
  AsyncBoundary,
  CategoryList,
  NewCategoryModal,
} from "@/infrastructure/components";
import { Button, Tabs, useOverlayState } from "@heroui/react";
import { TransactionType } from "@/domain/value-objects";
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

type CategoryTab = {
  name: string;
  query?: { transactionType: TransactionType };
};

function RouteComponent() {
  const createCategoryModalState = useOverlayState();

  const categoryTabs: CategoryTab[] = [
    { name: "all" },
    { name: "income", query: { transactionType: TransactionType.Income } },
    { name: "expense", query: { transactionType: TransactionType.Expense } },
  ];

  return (
    <>
      <div className="flex h-full w-full flex-col gap-y-3">
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="button button--icon button--secondary">
            <ArrowLeft className="" />
          </Link>
          <Button
            onClick={createCategoryModalState.open}
            className="uppercase"
            variant="secondary"
          >
            Create
          </Button>
        </div>

        <div className="flex w-full flex-1 flex-col gap-y-3">
          <div className="strink flex min-h-0 flex-col items-center">
            <p className="font-heading text-2xl font-medium">Categories</p>
            <p className="text-muted text-center text-sm">
              Keep your spending organized with categories that fit your life.
            </p>
          </div>

          <Tabs className="flex flex-1 flex-col">
            <div className="flex shrink items-center">
              <div className="grow">
                <Tabs.ListContainer className="bg-default w-max">
                  <Tabs.List className="**:data-[slot=tabs-indicator]:bg-accent **:data-[slot=tabs-tab]:data-[selected=true]:text-accent-foreground">
                    {categoryTabs.map((item) => (
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
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-0">
                <AsyncBoundary>
                  {categoryTabs.map((item) => (
                    <CategoryList
                      key={`TabPanel-${item.name}`}
                      id={item.name}
                      query={item.query}
                      onCreate={createCategoryModalState.open}
                    />
                  ))}
                </AsyncBoundary>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      <NewCategoryModal
        isOpen={createCategoryModalState.isOpen}
        onOpenChange={createCategoryModalState.setOpen}
      />
    </>
  );
}
