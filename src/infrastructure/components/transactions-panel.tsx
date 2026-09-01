import { EditTransactionModal } from "./edit-transaction-modal";
import { TransactionTile } from "./transaction-tile";
import { useTransactionActions } from "../hooks";
import {
  Button,
  Modal,
  ScrollShadow,
  Tabs,
  toast,
  useOverlayState,
} from "@heroui/react";
import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Archive } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "@/domain/entities";
import { AsyncBoundary } from "./ui";

type Query = Parameters<
  ReturnType<typeof useTransactionActions>["findTransactionsInfinite"]
>[0];

interface TransactionsPanelProps {
  id: string;
  query?: Query;
}

export const TransactionsPanel = (props: TransactionsPanelProps) => {
  const editTransactionModalState = useOverlayState();
  const deleteConfirmState = useOverlayState();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const { findTransactionsInfinite, deleteTransaction } =
    useTransactionActions();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(findTransactionsInfinite(props.query));
  const transactions = data.pages.flatMap((page) => page.items);

  const deleteTransactionMutation = useMutation(deleteTransaction());

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    editTransactionModalState.open();
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    deleteConfirmState.open();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;

    try {
      await deleteTransactionMutation.mutateAsync({
        id: selectedTransaction.id,
      });
      toast("Transaction deleted", { variant: "success" });
      deleteConfirmState.close();
      setSelectedTransaction(null);
    } catch {
      toast("An unexpected error has occured", { variant: "danger" });
    }
  };

  return (
    <Tabs.Panel className="h-full p-0" id={props.id}>
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
        {transactions.map((t) => (
          <AsyncBoundary
            classNames={{ base: "h-10", icon: "size-6" }}
            key={`Transaction-${t.id}`}
          >
            <TransactionTile
              transaction={t}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </AsyncBoundary>
        ))}
      </ScrollShadow>

      <EditTransactionModal
        isOpen={editTransactionModalState.isOpen}
        onOpenChange={editTransactionModalState.setOpen}
        transaction={selectedTransaction}
      />

      <Modal.Backdrop
        isOpen={deleteConfirmState.isOpen}
        onOpenChange={deleteConfirmState.setOpen}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-default text-foreground">
                <Archive className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Delete transaction?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted text-sm">
                Are you sure you want to delete this transaction? This action
                cannot be undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="ghost"
                className="w-full"
                onClick={deleteConfirmState.close}
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
    </Tabs.Panel>
  );
};
