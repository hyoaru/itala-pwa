import { cn, ScrollShadow, Tabs } from "@heroui/react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTransactionActions } from "../hooks";
import { TransactionType } from "@/domain/value-objects";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";

type Query = Parameters<
  ReturnType<typeof useTransactionActions>["findTransactionsInfinite"]
>[0];

interface TransactionsPanelProps {
  id: string;
  query?: Query;
}

export const TransactionsPanel = (props: TransactionsPanelProps) => {
  const { findTransactionsInfinite } = useTransactionActions();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(findTransactionsInfinite(props.query));
  const transactions = data.pages.flatMap((page) => page.items);

  return (
    <>
      <Tabs.Panel className="h-full p-0" id={props.id}>
        <ScrollShadow className="h-full space-y-2">
          {transactions.map((t, i) => {
            return (
              <div
                key={`Transaction-${t.id}`}
                className="flex items-center gap-2 px-3"
              >
                {t.type == TransactionType.Income ? (
                  <div className="relative">
                    <div className="bg-success/50 absolute inset-0 m-auto size-1.5 rounded-full"></div>
                    <BanknoteArrowUp className="text-muted/50 h-[1.6em] w-[1.6em]" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="bg-danger/50 absolute inset-0 m-auto size-1.5 rounded-full"></div>
                    <BanknoteArrowDown className="text-muted/50 h-[1.6em] w-[1.6em]" />
                  </div>
                )}
                <div className="bg-default-soft flex flex-1 justify-between rounded-3xl p-3 text-sm">
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{t.description}</p>
                  </div>
                  <p className="font-semibold">
                    {t.type == TransactionType.Income ? "+" : "-"}
                    {" ₱"}
                    {Number(t.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollShadow>
      </Tabs.Panel>
    </>
  );
};
