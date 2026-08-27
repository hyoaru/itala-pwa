import { TransactionType } from "@/domain/value-objects";
import {
  Button,
  Form,
  InputGroup,
  ListBox,
  Modal,
  Select,
  TextField,
} from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { ArrowRight, Pilcrow, Shapes } from "lucide-react";
import { z } from "zod";
import { getFieldError } from "../forms";

interface NewCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

export const NewCategoryModal = (props: NewCategoryModalProps) => {
  const form = useAppForm({
    defaultValues: {
      name: "",
      transactionType: TransactionType.Expense as TransactionType,
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1).max(64),
        transactionType: z.enum([
          TransactionType.Income,
          TransactionType.Expense,
        ]),
      }),
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      props.onOpenChange(false);
    },
  });

  const transactionTypes: TransactionType[] = [
    TransactionType.Income,
    TransactionType.Expense,
  ];

  return (
    <Modal.Backdrop isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-90">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-default text-foreground">
              <Shapes className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Create new category</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(e);
              }}
              className="space-y-4"
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
                          placeholder="Category name"
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

              <form.AppField name="transactionType">
                {(field) => {
                  const { isInvalid } = getFieldError(field);
                  return (
                    <field.Select
                      isInvalid={isInvalid}
                      variant="secondary"
                      placeholder="Transaction type"
                      fullWidth
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(value) =>
                        field.handleChange(value as TransactionType)
                      }
                    >
                      <field.Select.Trigger className="">
                        <p className="text-muted">
                          <Shapes className="me-3 h-[1.2em] w-[1.2em]" />
                        </p>
                        <Select.Value className="text-sm capitalize" />
                        <Select.Indicator className="">
                          <div className="">
                            <ArrowRight className="text-muted h-[1.2em] w-[1.2em]" />
                          </div>
                        </Select.Indicator>
                      </field.Select.Trigger>
                      <field.Select.Popover>
                        <ListBox>
                          {transactionTypes.map((type) => (
                            <ListBox.Item
                              className="capitalize"
                              key={type}
                              id={type}
                            >
                              {type}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </field.Select.Popover>
                    </field.Select>
                  );
                }}
              </form.AppField>

              <form.AppForm>
                <form.Button type="submit" className="w-full">
                  Create
                </form.Button>
              </form.AppForm>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
