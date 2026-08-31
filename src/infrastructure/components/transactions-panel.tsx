import { TransactionType } from "@/domain/value-objects";
import { ScrollShadow, Tabs } from "@heroui/react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useTransactionActions } from "../hooks";

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
        <ScrollShadow
          size={80}
          onScroll={(e) => {
            const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
            if (
              hasNextPage &&
              !isFetchingNextPage &&
              scrollHeight - scrollTop - clientHeight < 40
            ) {
              fetchNextPage();
            }
          }}
          hideScrollBar
          className="h-full space-y-2"
        >
          {transactions.map((t) => {
            const formattedAmount = Number(t.amount).toLocaleString();
            const formattedDate = new Date(t.occurredAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            );

            return (
              <div
                key={`Transaction-${t.id}`}
                className="flex items-center gap-1 px-1"
              >
                {t.type == TransactionType.Income ? (
                  <div className="relative">
                    <BanknoteArrowUp className="text-muted h-[1.5em] w-[1.5em]" />
                  </div>
                ) : (
                  <div className="relative">
                    <BanknoteArrowDown className="text-muted h-[1.5em] w-[1.5em]" />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 items-center justify-between gap-12 rounded-3xl py-2.5 ps-2.5">
                  <div className="flex min-w-0 items-center gap-1">
                    <p className="inline-flex w-full min-w-0 items-center gap-1 font-medium">
                      <span className="truncate">{t.description}</span>
                      <span className="text-muted shrink-0 text-xs">
                        on {formattedDate}
                      </span>
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold">
                    {t.type == TransactionType.Income ? "+" : "-"}
                    {" ₱"}
                    {formattedAmount}
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
