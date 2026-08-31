import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useAccountActions } from "../hooks";

type Query = Parameters<
  ReturnType<typeof useAccountActions>["findAccountsInfinite"]
>[0];

interface AccountBalanceCardProps {
  query?: Query;
}

export const AccountBalanceCard = (props: AccountBalanceCardProps) => {
  const { findAccountsInfinite } = useAccountActions();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(findAccountsInfinite(props.query));
  const accounts = data.pages.flatMap((page) => page.items);

  const balance = accounts.reduce((acc, account) => {
    return acc + parseFloat(account.balance);
  }, 0);

  return (
    <div className="bg-default flex h-full flex-col justify-center gap-y-1 rounded-3xl px-5">
      <p className="text-muted text-xs">Available balance</p>
      <p className="font-heading text-4xl font-semibold">
        ₱{balance.toLocaleString()}
      </p>
      <p className="text-xs font-medium">+ ₱500 this month </p>
    </div>
  );
};
