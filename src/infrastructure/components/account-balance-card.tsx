interface AccountBalanceCardProps {
  name: string;
  balance: number;
}

export const AccountBalanceCard = (props: AccountBalanceCardProps) => {
  return (
    <div className="bg-default flex h-full w-full flex-col justify-center gap-y-1 rounded-3xl px-5">
      <p className="text-muted text-xs">{props.name}</p>
      <p className="font-heading text-4xl font-semibold">
        ₱{props.balance.toLocaleString()}
      </p>
      <p className="text-xs font-medium">+ ₱500 this month </p>
    </div>
  );
};
