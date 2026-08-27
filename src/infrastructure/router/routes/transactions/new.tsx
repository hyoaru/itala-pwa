import { getFieldError } from "@/infrastructure/forms";
import {
  Button,
  Form,
  InputGroup,
  ListBox,
  NumberField,
  Select,
  TextField,
  ToggleButton,
} from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Pilcrow,
  Shapes,
  WalletCards,
} from "lucide-react";
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
    Select,
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
  const form = useAppForm({
    defaultValues: {
      amount: 0,
      transactionType: "EXPENSE",
      description: "",
      categoryId: "",
      accountId: "",
    },
    validators: {
      onChange: z.object({
        amount: z.number().min(0),
        transactionType: z.enum(["EXPENSE", "INCOME"]),
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
        className="w-full space-y-4"
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
                    field.state.value == "INCOME" ? "EXPENSE" : "INCOME",
                  );
                }}
                className="data-[selected=true]:text-foreground h-0 text-sm font-semibold"
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
                {transactionType === "INCOME"
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
                <InputGroup className="px-4 py-3">
                  <InputGroup.Prefix className="m-0 p-0">
                    <Pilcrow className="me-2 inline h-[1.2em] w-[1.2em]" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    className="p-0 font-medium placeholder:text-sm"
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
              <field.Select
                isInvalid={isInvalid}
                variant="secondary"
                placeholder="Choose a category"
                fullWidth
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(value) => field.handleChange(value as string)}
              >
                <field.Select.Trigger className="m-0 px-4 py-3">
                  <p className="text-foreground text-sm font-medium">
                    <Shapes className="me-2 inline h-[1.2em] w-[1.2em]" />
                  </p>
                  <Select.Value className="text-foreground text-sm font-medium" />
                  <Select.Indicator className="me-1">
                    <div className="text-sm">
                      <ArrowRight className="text-muted h-[1.2em] w-[1.2em]" />
                    </div>
                  </Select.Indicator>
                </field.Select.Trigger>
                <field.Select.Popover>
                  <ListBox>
                    <ListBox.Item id="option1" textValue="Option 1">
                      Option 1
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="option2" textValue="Option 2">
                      Option 2
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </field.Select.Popover>
              </field.Select>
            );
          }}
        </form.AppField>

        <form.AppField name="accountId">
          {(field) => {
            const { isInvalid } = getFieldError(field);
            return (
              <field.Select
                isInvalid={isInvalid}
                variant="secondary"
                placeholder="Choose an account"
                fullWidth
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(value) => field.handleChange(value as string)}
              >
                <field.Select.Trigger className="m-0 px-4 py-3">
                  <p className="text-foreground text-sm font-medium">
                    <WalletCards className="me-2 inline h-[1.2em] w-[1.2em]" />
                  </p>
                  <Select.Value className="text-foreground text-sm font-medium" />
                  <Select.Indicator className="me-1">
                    <div className="text-sm">
                      <ArrowRight className="text-muted h-[1.2em] w-[1.2em]" />
                    </div>
                  </Select.Indicator>
                </field.Select.Trigger>
                <field.Select.Popover>
                  <ListBox>
                    <ListBox.Item id="option1" textValue="Option 1">
                      Option 1
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="option2" textValue="Option 2">
                      Option 2
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </field.Select.Popover>
              </field.Select>
            );
          }}
        </form.AppField>

        <form.AppForm>
          <form.Button type="submit" className="w-full">
            Save transaction
          </form.Button>
        </form.AppForm>
      </Form>
    </>
  );
}
