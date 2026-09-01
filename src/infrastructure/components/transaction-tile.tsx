import type { Transaction } from "@/domain/entities";
import { TransactionType } from "@/domain/value-objects";
import { useAccountActions, useCategoryActions } from "@/infrastructure/hooks";
import { Button, Popover, useOverlayState } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import {
  Archive,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Pencil,
} from "lucide-react";

interface TransactionTileProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionTile = (props: TransactionTileProps) => {
  const popoverState = useOverlayState();
  const { findAccount } = useAccountActions();
  const { findCategory } = useCategoryActions();

  const { data: account } = useQuery({
    ...findAccount({ id: props.transaction.accountId }),
    retry: 2,
  });
  const { data: category } = useQuery({
    ...findCategory({ id: props.transaction.categoryId }),
    retry: 2,
  });

  const formattedAmount = Number(props.transaction.amount).toLocaleString();
  const formattedDate = new Date(
    props.transaction.occurredAt,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Popover isOpen={popoverState.isOpen} onOpenChange={popoverState.setOpen}>
      <Button
        variant="ghost"
        className="h-auto w-full justify-start gap-1 px-1"
      >
        {props.transaction.type == TransactionType.Income ? (
          <BanknoteArrowUp className="text-muted h-[1.5em] w-[1.5em] shrink-0" />
        ) : (
          <BanknoteArrowDown className="text-muted h-[1.5em] w-[1.5em] shrink-0" />
        )}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-12 rounded-3xl py-2.5 ps-2.5">
          <div className="flex min-w-0 items-center gap-1">
            <p className="inline-flex w-full min-w-0 items-center gap-1 font-medium">
              <span className="truncate">{props.transaction.description}</span>
              <span className="text-muted shrink-0 text-xs">
                on {formattedDate}
              </span>
            </p>
          </div>
          <p className="shrink-0 font-semibold">
            {props.transaction.type == TransactionType.Income ? "+" : "-"}
            {" ₱"}
            {formattedAmount}
          </p>
        </div>
      </Button>
      <Popover.Content placement="bottom right" className="max-w-64">
        <Popover.Dialog className="p-3">
          <Popover.Arrow />
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {props.transaction.description}
              </p>
              <p className="font-heading text-muted text-xs font-medium">
                {formattedDate}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs">Amount</span>
                <span className="text-sm font-semibold">
                  {props.transaction.type == TransactionType.Income ? "+" : "-"}
                  {" ₱"}
                  {formattedAmount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs">Account</span>
                <span className="font-heading text-xs font-medium">
                  {account?.name ?? "Deleted"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs">Category</span>
                <span className="font-heading text-xs font-medium">
                  {category?.name ?? "Deleted"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  popoverState.close();
                  props.onEdit(props.transaction);
                }}
              >
                <Pencil className="size-4" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-danger w-full justify-start gap-2"
                onClick={() => {
                  popoverState.close();
                  props.onDelete(props.transaction);
                }}
              >
                <Archive className="size-4" />
                Delete
              </Button>
            </div>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
};
