import { TransactionType } from "@/domain/value-objects";
import type { Transaction } from "@/domain/entities";
import { AccountSelect } from "./account-select";
import { AsyncBoundary } from "./ui/async-boundary";
import { CategorySelect } from "./category-select";
import { NewAccountModal } from "./new-account-modal";
import { NewCategoryModal } from "./new-category-modal";
import { getFieldError } from "@/infrastructure/forms";
import { TransactionRepositoryError } from "@/application/ports/transaction-repository";
import { useTransactionActions } from "@/infrastructure/hooks";
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  Form,
  InputGroup,
  Label,
  Modal,
  NumberField,
  TextField,
  TimeField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, Pilcrow } from "lucide-react";
import { CalendarDateTime, Time } from "@internationalized/date";
import { useState } from "react";
import { z } from "zod";

interface EditTransactionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  transaction: Transaction | null;
}

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    CategorySelect,
    AccountSelect,
    NumberField,
    DatePicker,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

export const EditTransactionModal = (props: EditTransactionModalProps) => {
  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isAccountSelectOpen, setIsAccountSelectOpen] = useState(false);
  const createCategoryModalState = useOverlayState();
  const createAccountModalState = useOverlayState();
  const { updateTransaction } = useTransactionActions();
  const updateTransactionMutation = useMutation(updateTransaction());

  const transaction = props.transaction;

  const toCalendarDateTime = (date: Date): CalendarDateTime => {
    return new CalendarDateTime(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    );
  };

  const form = useAppForm({
    defaultValues: {
      amount: transaction ? Number(transaction.amount) : 0,
      description: transaction?.description ?? "",
      occurredAt: transaction
        ? toCalendarDateTime(transaction.occurredAt)
        : new CalendarDateTime(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            new Date().getDate(),
            new Date().getHours(),
            new Date().getMinutes(),
          ),
      categoryId: transaction?.categoryId ?? "",
      accountId: transaction?.accountId ?? "",
    },
    validators: {
      onChange: z.object({
        amount: z.number().min(0),
        description: z.string().nonempty().max(60),
        occurredAt: z.instanceof(CalendarDateTime),
        categoryId: z.string().nonempty(),
        accountId: z.string().nonempty(),
      }),
    },
    onSubmit: async ({ value }) => {
      if (!transaction) return;

      try {
        await updateTransactionMutation.mutateAsync({
          id: transaction.id,
          amount: String(value.amount),
          accountId: value.accountId,
          categoryId: value.categoryId,
          description: value.description,
          occurredAt: value.occurredAt.toDate("UTC"),
        });

        toast("Transaction updated", { variant: "success" });
        props.onOpenChange(false);
      } catch (error) {
        if (error instanceof TransactionRepositoryError) {
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
    <>
      <Modal.Backdrop isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-90">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Edit transaction</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(e);
              }}
              className="space-y-3"
            >
              <form.AppField name="amount">
                {(field) => {
                  const { isInvalid } = getFieldError(field);
                  return (
                    <field.NumberField
                      minValue={0}
                      maxValue={1000000}
                      variant="secondary"
                      isInvalid={isInvalid}
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
                    >
                      <NumberField.Input className="text-sm" />
                    </field.NumberField>
                  );
                }}
              </form.AppField>

              <form.AppField name="description">
                {(field) => {
                  const { isInvalid } = getFieldError(field);
                  return (
                    <field.TextField isInvalid={isInvalid} variant="secondary" fullWidth>
                      <InputGroup>
                        <InputGroup.Prefix>
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

              <form.AppField name="occurredAt">
                {(field) => {
                  const { isInvalid } = getFieldError(field);
                  return (
                    <field.DatePicker
                      className="w-full"
                      isInvalid={isInvalid}
                      granularity="minute"
                      onChange={(value) =>
                        field.handleChange(value as CalendarDateTime)
                      }
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                    >
                      {(values) => (
                        <>
                          <div className="relative w-full">
                            <DateField.Group
                              className="px-3"
                              variant="secondary"
                              fullWidth
                            >
                              <div>
                                <CalendarDays className="text-muted h-[1.2em] w-[1.2em]" />
                              </div>
                              <DateField.Input className="text-sm">
                                {(segment) => (
                                  <DateField.Segment segment={segment} />
                                )}
                              </DateField.Input>
                            </DateField.Group>
                            <DatePicker.Trigger className="absolute inset-0 h-full w-full cursor-pointer" />
                          </div>
                          <DatePicker.Popover className="flex flex-col gap-3">
                            <Calendar aria-label="Event date">
                              <Calendar.Header>
                                <Calendar.YearPickerTrigger>
                                  <Calendar.YearPickerTriggerHeading />
                                  <Calendar.YearPickerTriggerIndicator />
                                </Calendar.YearPickerTrigger>
                                <Calendar.NavButton slot="previous" />
                                <Calendar.NavButton slot="next" />
                              </Calendar.Header>
                              <Calendar.Grid>
                                <Calendar.GridHeader>
                                  {(day) => (
                                    <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                                  )}
                                </Calendar.GridHeader>
                                <Calendar.GridBody>
                                  {(date) => <Calendar.Cell date={date} />}
                                </Calendar.GridBody>
                              </Calendar.Grid>
                              <Calendar.YearPickerGrid>
                                <Calendar.YearPickerGridBody>
                                  {({ year }) => (
                                    <Calendar.YearPickerCell year={year} />
                                  )}
                                </Calendar.YearPickerGridBody>
                              </Calendar.YearPickerGrid>
                            </Calendar>
                            <div className="flex items-center justify-between">
                              <Label>Time</Label>
                              <TimeField
                                hourCycle={24}
                                hideTimeZone
                                shouldForceLeadingZeros
                                granularity="minute"
                                value={values.state.timeValue ?? new Time(0, 0)}
                                onChange={(time) => {
                                  if (time) values.state.setTimeValue(time);
                                }}
                              >
                                <TimeField.Group variant="secondary">
                                  <TimeField.Input>
                                    {(segment) => (
                                      <TimeField.Segment segment={segment} />
                                    )}
                                  </TimeField.Input>
                                </TimeField.Group>
                              </TimeField>
                            </div>
                          </DatePicker.Popover>
                        </>
                      )}
                    </field.DatePicker>
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
                        transactionType={
                          transaction?.type ?? TransactionType.Expense
                        }
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
                  Save
                </form.Button>
              </form.AppForm>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>

    <NewCategoryModal
      isOpen={createCategoryModalState.isOpen}
      onOpenChange={createCategoryModalState.setOpen}
      defaultValues={{
        transactionType: transaction?.type ?? TransactionType.Expense,
      }}
      onCreate={(id) => form.setFieldValue("categoryId", id)}
    />

    <NewAccountModal
      isOpen={createAccountModalState.isOpen}
      onOpenChange={createAccountModalState.setOpen}
      onCreate={(id) => form.setFieldValue("accountId", id)}
    />
    </>
  );
};
