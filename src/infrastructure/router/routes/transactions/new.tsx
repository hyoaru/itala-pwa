import { TransactionType } from "@/domain/value-objects";
import {
  AccountSelect,
  CategorySelect,
  NewAccountModal,
  NewCategoryModal,
} from "@/infrastructure/components";
import { AsyncBoundary } from "@/infrastructure/components/ui/async-boundary";
import { getFieldError } from "@/infrastructure/forms";
import {
  Button,
  Form,
  InputGroup,
  NumberField,
  TextField,
  ToggleButton,
  useOverlayState,
} from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, Pilcrow } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/transactions/new")({
  beforeLoad: ({ context }) => {
    if (!context.authenticationSession.isAuthenticated) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
});

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    CategorySelect,
    AccountSelect,
    ToggleButton,
    NumberField,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

function RouteComponent() {
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isAccountSelectOpen, setIsAccountSelectOpen] = useState(false);
  const createCategoryModalState = useOverlayState();
  const createAccountModalState = useOverlayState();

  const form = useAppForm({
    defaultValues: {
      amount: 0,
      transactionType: TransactionType.Expense as TransactionType,
      description: "",
      categoryId: "",
      accountId: "",
    },
    validators: {
      onChange: z.object({
        amount: z.number().min(0),
        transactionType: z.enum(TransactionType),
        description: z.string().nonempty().max(60),
        categoryId: z.string().nonempty(),
        accountId: z.string().nonempty(),
      }),
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      form.resetField("amount");
      form.resetField("description");
    },
  });
  return (
    <>
      <Form
        className="w-full space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(e);
        }}
      >
        <div className="flex w-full items-center justify-between">
          <Link to="/dashboard" className="text-muted text-sm">
            <ArrowLeft className="" />
          </Link>
          <form.AppField name="transactionType">
            {(field) => (
              <field.ToggleButton
                id={field.name}
                onClick={() => {
                  field.handleChange(
                    field.state.value == TransactionType.Income
                      ? TransactionType.Expense
                      : TransactionType.Income,
                  );
                }}
                className="data-[selected=true]:text-foreground h-0 text-sm font-semibold uppercase"
              >
                {field.state.value}
              </field.ToggleButton>
            )}
          </form.AppField>
        </div>

        <div className="space-y-1 rounded-3xl p-5 text-center">
          <form.Subscribe selector={(state) => state.values.transactionType}>
            {(transactionType) => (
              <p className="text-muted text-sm">
                {transactionType === TransactionType.Income
                  ? "How much did you receive?"
                  : "How much did you spend?"}
              </p>
            )}
          </form.Subscribe>
          <form.AppField name="amount">
            {(field) => {
              const { isInvalid } = getFieldError(field);
              return (
                <field.NumberField
                  minValue={0}
                  maxValue={1000000}
                  variant="secondary"
                  isInvalid={isInvalid}
                  className="font-heading selection:bg-default m-0 p-0 font-semibold selection:text-inherit"
                  fullWidth
                  formatOptions={{
                    currency: "PHP",
                    currencySign: "standard",
                    style: "currency",
                  }}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value)}
                  onFocus={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    input.select();
                  }}
                >
                  <NumberField.Input className="m-0 p-0 text-center text-4xl" />
                </field.NumberField>
              );
            }}
          </form.AppField>
        </div>

        <form.AppField name="description">
          {(field) => {
            const { isInvalid } = getFieldError(field);
            return (
              <field.TextField
                isInvalid={isInvalid}
                variant="secondary"
                fullWidth
              >
                <InputGroup className="">
                  <InputGroup.Prefix className="">
                    <Pilcrow className="h-[1.2em] w-[1.2em]" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    className="text-sm"
                    placeholder="What is this transaction for?"
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

        <form.AppField name="categoryId">
          {(field) => {
            const { isInvalid } = getFieldError(field);
            return (
              <AsyncBoundary classNames={{ base: "h-9", icon: "size-6" }}>
                <field.CategorySelect
                  isInvalid={isInvalid}
                  variant="secondary"
                  placeholder="Choose a category"
                  fullWidth
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value as string)}
                  isOpen={isCategorySelectOpen}
                  onOpenChange={setIsCategorySelectOpen}
                  onCreateCategory={() => {
                    setIsCategorySelectOpen(false);
                    createCategoryModalState.open();
                  }}
                />
              </AsyncBoundary>
            );
          }}
        </form.AppField>

        <form.AppField name="accountId">
          {(field) => {
            const { isInvalid } = getFieldError(field);
            return (
              <AsyncBoundary classNames={{ base: "h-9", icon: "size-6" }}>
                <field.AccountSelect
                  isInvalid={isInvalid}
                  variant="secondary"
                  placeholder="Choose an account"
                  fullWidth
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(value) => field.handleChange(value as string)}
                  isOpen={isAccountSelectOpen}
                  onOpenChange={setIsAccountSelectOpen}
                  onCreateAccount={() => {
                    setIsAccountSelectOpen(false);
                    createAccountModalState.open();
                  }}
                />
              </AsyncBoundary>
            );
          }}
        </form.AppField>

        <form.AppForm>
          <form.Button type="submit" className="w-full">
            Save transaction
          </form.Button>
        </form.AppForm>
      </Form>

      <NewCategoryModal
        isOpen={createCategoryModalState.isOpen}
        onOpenChange={createCategoryModalState.setOpen}
      />

      <NewAccountModal
        isOpen={createAccountModalState.isOpen}
        onOpenChange={createAccountModalState.setOpen}
      />
    </>
  );
}
