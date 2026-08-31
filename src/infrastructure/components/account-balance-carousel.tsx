import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useAccountActions } from "../hooks";
import { AccountBalanceCard } from "./account-balance-card";
import { Carousel } from "./ui/carousel";

export const AccountBalanceCarousel = () => {
  const { findAccountsInfinite } = useAccountActions();
  const { data } = useSuspenseInfiniteQuery(findAccountsInfinite());
  const accounts = data.pages.flatMap((page) => page.items);

  const overallBalance = accounts.reduce(
    (total, account) => total + parseFloat(account.balance),
    0,
  );

  return (
    <Carousel className="h-full">
      <AccountBalanceCard name="Overall account" balance={overallBalance} />
      {accounts.map((account) => (
        <AccountBalanceCard
          key={account.id}
          name={account.name}
          balance={parseFloat(account.balance)}
        />
      ))}
    </Carousel>
  );
};
