interface AccountBalanceCardProps {
  name: string;
  balance: number;
  createdAt?: Date;
}

export const AccountBalanceCard = (props: AccountBalanceCardProps) => {
  const formattedDate = props.createdAt?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-default flex h-full w-full flex-col justify-center gap-y-1 rounded-3xl px-5">
      <div className="flex items-center justify-between">
        <p className="text-muted text-xs">{props.name}</p>
        {formattedDate && (
          <p className="text-muted font-heading text-xs">
            Created {formattedDate}
          </p>
        )}
      </div>
      <p className="font-heading text-4xl font-semibold">
        ₱{props.balance.toLocaleString()}
      </p>
      <p className="text-xs font-medium">+ ₱xxx this month </p>
    </div>
  );
};
