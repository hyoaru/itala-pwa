import { Button, ListBox, Select } from "@heroui/react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ArrowRight, Plus, WalletCards } from "lucide-react";
import type { ComponentProps } from "react";
import { useAccountActions } from "../actions";

interface AccountSelectProps extends ComponentProps<typeof Select> {
  onCreateAccount: () => void;
}

export const AccountSelect = (props: AccountSelectProps) => {
  const { findAccountsInfinite } = useAccountActions();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(findAccountsInfinite());
  const accounts = data.pages.flatMap((page) => page.items);

  return (
    <Select
      {...props}
      variant="secondary"
      placeholder="Choose an account"
      fullWidth
    >
      <Select.Trigger className="">
        <p className="text-muted">
          <WalletCards className="me-3 h-[1.2em] w-[1.2em]" />
        </p>
        <Select.Value className="text-sm" />
        <Select.Indicator className="">
          <div className="">
            <ArrowRight className="text-muted h-[1.2em] w-[1.2em]" />
          </div>
        </Select.Indicator>
      </Select.Trigger>
      <Select.Popover
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
      >
        <div className="mt-2 px-1">
          <Button
            variant="secondary"
            className="justify-start px-3 text-start"
            fullWidth
            onPress={props.onCreateAccount}
          >
            <Plus className="inline h-[1.2em] w-[1.2em]" />
            Create account
          </Button>
        </div>
        <ListBox>
          {accounts.map((account) => (
            <ListBox.Item
              className="capitalize"
              key={account.id}
              id={account.id}
              textValue={account.name}
            >
              {account.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
