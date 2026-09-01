import type { Category } from "@/domain/entities";
import {
  Button,
  Form,
  InputGroup,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {
  CategoryAlreadyExistsError,
  CategoryRepositoryError,
} from "@/application/ports/category-repository";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Pilcrow, Shapes } from "lucide-react";
import { z } from "zod";
import { getFieldError } from "../forms";
import { useMutation } from "@tanstack/react-query";
import { useCategoryActions } from "../hooks";

interface EditCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  category: Category | null;
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

export const EditCategoryModal = (props: EditCategoryModalProps) => {
  const { updateCategory } = useCategoryActions();
  const updateCategoryMutation = useMutation(updateCategory());

  const form = useAppForm({
    defaultValues: {
      name: props.category?.name ?? "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1).max(64),
      }),
    },
    onSubmit: async ({ value }) => {
      if (!props.category) return;

      try {
        await updateCategoryMutation.mutateAsync({
          id: props.category.id,
          name: value.name,
        });

        toast("Category updated", { variant: "success" });
        props.onOpenChange(false);
      } catch (error) {
        if (error instanceof CategoryAlreadyExistsError) {
          toast("A category with this name already exists", {
            variant: "danger",
          });
        } else if (error instanceof CategoryRepositoryError) {
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
              <Shapes className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Edit category</Modal.Heading>
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

              <form.AppForm>
                <form.Button
                  type="submit"
                  className="w-full"
                  isDisabled={updateCategoryMutation.isPending}
                >
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
