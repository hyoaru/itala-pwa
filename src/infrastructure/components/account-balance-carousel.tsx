import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useAccountActions } from "../hooks";
import { AccountBalanceCard } from "./account-balance-card";
import { Carousel } from "./ui/carousel";

type AccountBalanceCarouselProps = {
  onSelect?: (id: string | undefined) => void;
};

export const AccountBalanceCarousel = (props: AccountBalanceCarouselProps) => {
  const { findAccountsInfinite } = useAccountActions();
  const { data } = useSuspenseInfiniteQuery(findAccountsInfinite());
  const accounts = data.pages.flatMap((page) => page.items);

  const overallBalance = accounts.reduce(
    (total, account) => total + parseFloat(account.balance),
    0,
  );

  const onSelect = (index: number) => {
    if (index <= 0) {
      props.onSelect?.(undefined);
      return;
    }

    const accountId = accounts[index - 1].id;
    props.onSelect?.(accountId);
  };

  return (
    <Carousel onSelect={onSelect} className="h-full">
      <AccountBalanceCard
        name="Overall account balance"
        balance={overallBalance}
      />
      {accounts.map((account) => (
        <AccountBalanceCard
          key={account.id}
          name={account.name}
          balance={parseFloat(account.balance)}
          createdAt={account.createdAt}
        />
      ))}
    </Carousel>
  );
};
