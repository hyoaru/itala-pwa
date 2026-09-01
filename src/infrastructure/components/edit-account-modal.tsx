import type { Account } from "@/domain/entities";
import {
  Button,
  Form,
  InputGroup,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {
  AccountAlreadyExistsError,
  AccountRepositoryError,
} from "@/application/ports/account-repository";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Pilcrow, WalletCards } from "lucide-react";
import { z } from "zod";
import { getFieldError } from "../forms";
import { useMutation } from "@tanstack/react-query";
import { useAccountActions } from "../hooks";

interface EditAccountModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  account: Account | null;
}

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

export const EditAccountModal = (props: EditAccountModalProps) => {
  const { updateAccount } = useAccountActions();
  const updateAccountMutation = useMutation(updateAccount());

  const form = useAppForm({
    defaultValues: {
      name: props.account?.name ?? "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1).max(64),
      }),
    },
    onSubmit: async ({ value }) => {
      if (!props.account) return;

      try {
        await updateAccountMutation.mutateAsync({
          id: props.account.id,
          name: value.name,
        });

        toast("Account updated", { variant: "success" });
        props.onOpenChange(false);
      } catch (error) {
        if (error instanceof AccountAlreadyExistsError) {
          toast("An account with this name already exists", {
            variant: "danger",
          });
        } else if (error instanceof AccountRepositoryError) {
          toast(`An unexpected error has occured: ${error.message}`, {
            variant: "danger",
          });
        } else {
          toast("An unexpected error has occured", {
            variant: "danger",
          });
        }
      }
    },
  });

  return (
    <Modal.Backdrop isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-90">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-default text-foreground">
              <WalletCards className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Edit account</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(e);
              }}
              className="space-y-3"
            >
              <form.AppField name="name">
                {(field) => {
                  const { isInvalid } = getFieldError(field);
                  return (
                    <field.TextField
                      isInvalid={isInvalid}
                      variant="secondary"
                      fullWidth
                    >
                      <InputGroup>
                        <InputGroup.Prefix>
                          <Pilcrow className="h-[1.2em] w-[1.2em]" />
                        </InputGroup.Prefix>
                        <InputGroup.Input
                          className="text-sm"
                          placeholder="Account name"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </InputGroup>
                    </field.TextField>
                  );
                }}
              </form.AppField>

              <form.AppForm>
                <form.Button type="submit" className="w-full">
                  Save
                </form.Button>
              </form.AppForm>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
