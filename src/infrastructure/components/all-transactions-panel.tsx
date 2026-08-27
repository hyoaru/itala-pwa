import { Tabs } from "@heroui/react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTransactionActions } from "../actions";

interface AllTransactionsPanelProps {
  id: string;
}

export const AllTransactionsPanel = (props: AllTransactionsPanelProps) => {
  const { findTransactionsInfinite } = useTransactionActions();
  const { data } = useSuspenseInfiniteQuery(findTransactionsInfinite());

  return (
    <>
      <Tabs.Panel className="h-full" id={props.id}>
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
      </Tabs.Panel>
    </>
  );
};
