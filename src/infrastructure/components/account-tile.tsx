import type { Account } from "@/domain/entities";
import { Button, Popover, useOverlayState } from "@heroui/react";
import { Archive, Ellipsis, Pencil } from "lucide-react";

interface AccountTileProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export const AccountTile = (props: AccountTileProps) => {
  const popoverState = useOverlayState();
  const formattedDate = new Date(props.account.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <div className="flex items-center justify-between gap-8 rounded-3xl px-4 py-1">
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-sm font-semibold">{props.account.name}</p>
        <p className="font-heading text-muted shrink text-xs font-medium">{formattedDate}</p>
      </div>

      <Popover isOpen={popoverState.isOpen} onOpenChange={popoverState.setOpen}>
        <Button className="shrink" isIconOnly size="sm" variant="secondary">
          <Ellipsis className="h-[1.5em] w-[1.5em]" />
        </Button>
        <Popover.Content placement="left" className="max-w-40">
          <Popover.Dialog className="p-1">
            <Popover.Arrow />
            <Button
              size="sm"
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                popoverState.close();
                props.onEdit(props.account);
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
                props.onDelete(props.account);
              }}
            >
              <Archive className="size-4" />
              Delete
            </Button>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
};
