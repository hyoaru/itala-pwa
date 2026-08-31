import { Tabs } from "@heroui/react";
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
      <Tabs.Panel className="space-y-2 p-0" id={props.id}>
        {transactions.map((t) => {
          return (
            <div
              key={`AllTransactions-${t.id}`}
              className="bg-default-soft flex justify-between rounded-3xl p-3 text-sm"
            >
              <p className="font-medium">{t.description}</p>
              <p className="font-semibold">
                {t.type == TransactionType.Income ? "+" : "-"}₱{t.amount}
              </p>
            </div>
          );
        })}
      </Tabs.Panel>
    </>
  );
};
