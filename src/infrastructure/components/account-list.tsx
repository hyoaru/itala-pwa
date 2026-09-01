import { AccountTile } from "./account-tile";
import { EditAccountModal } from "./edit-account-modal";
import { useAccountActions } from "@/infrastructure/hooks";
import {
  Button,
  Modal,
  ScrollShadow,
  toast,
  useOverlayState,
} from "@heroui/react";
import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Archive } from "lucide-react";
import { useState } from "react";
import type { Account } from "@/domain/entities";

export const AccountList = () => {
  const editAccountModalState = useOverlayState();
  const archiveConfirmState = useOverlayState();

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const { findAccountsInfinite, archiveAccount } = useAccountActions();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(findAccountsInfinite());
  const accounts = data.pages.flatMap((page) => page.items);

  const archiveAccountMutation = useMutation(archiveAccount());

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    editAccountModalState.open();
  };

  const handleDeleteClick = (account: Account) => {
    setSelectedAccount(account);
    archiveConfirmState.open();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAccount) return;

    try {
      await archiveAccountMutation.mutateAsync({ id: selectedAccount.id });
      toast("Account deleted", { variant: "success" });
      archiveConfirmState.close();
      setSelectedAccount(null);
    } catch {
      toast("An unexpected error has occured", { variant: "danger" });
    }
  };

  return (
    <>
      <ScrollShadow
        size={80}
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
        hideScrollBar
        className="h-full space-y-2"
      >
        {accounts.map((account) => (
          <AccountTile
            key={account.id}
            account={account}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </ScrollShadow>

      <EditAccountModal
        isOpen={editAccountModalState.isOpen}
        onOpenChange={editAccountModalState.setOpen}
        account={selectedAccount}
      />

      <Modal.Backdrop
        isOpen={archiveConfirmState.isOpen}
        onOpenChange={archiveConfirmState.setOpen}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-default text-foreground">
                <Archive className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Delete account?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted text-sm">
                Are you sure you want to delete this account? This action cannot
                be undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="ghost"
                className="w-full"
                onClick={archiveConfirmState.close}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-danger text-danger-foreground w-full"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
