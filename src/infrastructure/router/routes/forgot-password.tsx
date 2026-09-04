import {
  IdentityProviderCodeDeliveryFailureError,
  IdentityProviderError,
  IdentityProviderUserNotFoundError,
} from "@/application/ports/identity-provider";
import { useIdentityActions } from "@/infrastructure/hooks/identity";
import { getFieldError } from "@/infrastructure/forms";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, NotebookPen } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/forgot-password")({
  component: RouteComponent,
});

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

function RouteComponent() {
  const navigate = useNavigate();
  const { sendPasswordReset } = useIdentityActions();
  const sendPasswordResetMutation = useMutation(sendPasswordReset());

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: z.object({
        email: z.email(),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await sendPasswordResetMutation.mutateAsync({
          email: value.email,
        });

        form.reset();
        sessionStorage.setItem("PASSWORD_RESET_EMAIL", value.email);
        toast("Password reset code sent", { variant: "success" });
        navigate({ to: "/reset-password" });
      } catch (error) {
        if (error instanceof IdentityProviderUserNotFoundError) {
          toast("No account found for this email", { variant: "danger" });
        } else if (error instanceof IdentityProviderCodeDeliveryFailureError) {
          toast("Could not send the code. Please try again.", {
            variant: "danger",
          });
        } else if (error instanceof IdentityProviderError) {
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
      <div className="h-full w-full space-y-8">
        <div className="relative flex w-full items-center justify-center text-3xl">
          <div className="absolute flex w-full justify-start">
            <Link
              to="/sign-in"
              className="button button--icon button--secondary"
            >
              <ArrowLeft className="" />
            </Link>
          </div>
          <span className="inline-flex items-center gap-1">
            <NotebookPen className="bg-accent text-accent-foreground h-[1em] w-[1em] rounded-xl p-0.5" />
            <span className="font-heading font-semibold">ITALA</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-heading text-2xl font-medium">
            Reset your password
          </p>
          <p className="text-muted text-sm">
            Enter your email and we'll send you a reset code.
          </p>
        </div>
        <Form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          <form.AppField name="email">
            {(field) => {
              const { isInvalid, errorMessage } = getFieldError(field);
              return (
                <field.TextField isInvalid={isInvalid}>
                  <Label>Email address</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    variant="secondary"
                    placeholder="John.doe@email.com"
                  />
                  <FieldError>{errorMessage}</FieldError>
                </field.TextField>
              );
            }}
          </form.AppField>

          <form.AppForm>
            <form.Button
              type="submit"
              className="w-full"
              isDisabled={sendPasswordResetMutation.isPending}
            >
              Send reset code
            </form.Button>
          </form.AppForm>
        </Form>
      </div>
    </>
  );
}
