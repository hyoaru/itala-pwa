import { useBalanceVisibilityStore } from "@/infrastructure/stores/balance-visibility";
import { Button } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";

interface AccountBalanceCardProps {
  name: string;
  balance: number;
  createdAt?: Date;
}

export const AccountBalanceCard = (props: AccountBalanceCardProps) => {
  const { isVisible, toggle } = useBalanceVisibilityStore();
  const formattedDate = props.createdAt?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-default flex h-full w-full flex-col justify-center gap-y-1 rounded-3xl px-5">
      <div className="flex items-center justify-between">
        <p className="text-muted text-xs">{props.name}</p>
        <div className="flex items-center gap-2">
          {formattedDate && (
            <p className="text-muted font-heading text-xs">
              Created {formattedDate}
            </p>
          )}
          <Button
            className="h-0"
            isIconOnly
            size="sm"
            variant="ghost"
            onClick={toggle}
          >
            {isVisible ? (
              <Eye className="text-muted size-4" />
            ) : (
              <EyeOff className="text-muted size-4" />
            )}
          </Button>
        </div>
      </div>
      <p className="font-heading text-4xl font-semibold">
        {isVisible ? `₱${props.balance.toLocaleString()}` : "****"}
      </p>
      <p className="text-xs font-medium">+ ₱xxx this month</p>
    </div>
  );
};
