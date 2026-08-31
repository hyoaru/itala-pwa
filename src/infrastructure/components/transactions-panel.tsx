import { ScrollShadow, Tabs } from "@heroui/react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTransactionActions } from "../hooks";
import { TransactionType } from "@/domain/value-objects";

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
          {transactions.map((t) => {
            return (
              <div
                key={`AllTransactions-${t.id}`}
                className="bg-default-soft flex justify-between rounded-3xl p-3 text-sm"
              >
                <p className="font-medium">{t.description}</p>
                <p className="font-semibold">
                  {t.type == TransactionType.Income ? "+" : "-"}₱
                  {Number(t.amount).toLocaleString()}
                </p>
              </div>
            );
          })}
        </ScrollShadow>
      </Tabs.Panel>
    </>
  );
};
