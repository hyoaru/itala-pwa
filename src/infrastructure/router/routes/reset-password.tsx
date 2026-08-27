import {
  IdentityProviderError,
  IdentityProviderInvalidCodeError,
  IdentityProviderInvalidPasswordError,
  IdentityProviderUserNotFoundError,
} from "@/application/ports/identity-provider";
import { useIdentityActions } from "@/infrastructure/actions/identity";
import { getFieldError } from "@/infrastructure/forms";
import { passwordSchema } from "@/infrastructure/validators";
import {
  Button,
  FieldError,
  Form,
  Input,
  InputOTP,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, NotebookPen } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/reset-password")({
  component: RouteComponent,
});

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    InputOTP,
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
  const email = sessionStorage.getItem("PASSWORD_RESET_EMAIL")!;
  const { resetPassword } = useIdentityActions();
  const resetPasswordMutation = useMutation(resetPassword());

  const form = useAppForm({
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: z
        .object({
          code: z.string().length(6),
          newPassword: passwordSchema,
          confirmPassword: z.string(),
        })
        .superRefine((value, ctx) => {
          if (value.confirmPassword !== value.newPassword) {
            ctx.addIssue({
              code: "custom",
              path: ["confirmPassword"],
              message: "Passwords do not match",
            });
          }
        }),
    },
    onSubmit: async ({ value }) => {
      try {
        await resetPasswordMutation.mutateAsync({
          email: email,
          code: value.code,
          newPassword: value.newPassword,
        });

        form.reset();
        sessionStorage.removeItem("PASSWORD_RESET_EMAIL");
        toast("Password reset successfully!", { variant: "success" });
        navigate({ to: "/sign-in" });
      } catch (error) {
        if (error instanceof IdentityProviderInvalidCodeError) {
          toast("Invalid or expired code. Please try again.", {
            variant: "danger",
          });
        } else if (error instanceof IdentityProviderInvalidPasswordError) {
          toast("Password does not meet the required strength", {
            variant: "danger",
          });
        } else if (error instanceof IdentityProviderUserNotFoundError) {
          toast("No account found for this email", { variant: "danger" });
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
      <div className="w-full space-y-8">
        <div className="relative flex w-full items-center justify-center text-3xl">
          <div className="absolute flex w-full justify-start">
            <Link
              to="/forgot-password"
              className="button button--icon button--secondary"
            >
              <ArrowLeft className="" />
            </Link>
          </div>
          <span className="inline-flex items-center gap-1">
            <NotebookPen className="bg-accent h-[1em] w-[1em] rounded-xl p-0.5" />
            <span className="font-heading font-semibold">ITALA</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-heading text-2xl font-medium">
            Choose a new password
          </p>
          <p className="text-muted text-sm">
            We sent a 6-digit reset code to {email}
          </p>
        </div>
        <Form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          <form.AppField name="code">
            {(field) => {
              const { isInvalid } = getFieldError(field);
              return (
                <div className="flex flex-col items-center gap-2">
                  <field.InputOTP
                    maxLength={6}
                    isInvalid={isInvalid}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e)}
                    variant="secondary"
                    className="mx-auto w-fit"
                  >
                    <InputOTP.Group>
                      <InputOTP.Slot index={0} />
                      <InputOTP.Slot index={1} />
                      <InputOTP.Slot index={2} />
                    </InputOTP.Group>
                    <InputOTP.Separator />
                    <InputOTP.Group>
                      <InputOTP.Slot index={3} />
                      <InputOTP.Slot index={4} />
                      <InputOTP.Slot index={5} />
                    </InputOTP.Group>
                  </field.InputOTP>
                </div>
              );
            }}
          </form.AppField>

          <form.AppField name="newPassword">
            {(field) => {
              const { isInvalid, errorMessage } = getFieldError(field);
              return (
                <field.TextField isInvalid={isInvalid}>
                  <Label>New password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    variant="secondary"
                    placeholder="Enter your new password"
                  />
                  <FieldError>{errorMessage}</FieldError>
                </field.TextField>
              );
            }}
          </form.AppField>

          <form.AppField name="confirmPassword">
            {(field) => {
              const { isInvalid, errorMessage } = getFieldError(field);
              return (
                <field.TextField isInvalid={isInvalid}>
                  <Label>Confirm new password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    variant="secondary"
                    placeholder="Confirm your new password"
                  />
                  <FieldError>{errorMessage}</FieldError>
                </field.TextField>
              );
            }}
          </form.AppField>

          <form.AppForm>
            <form.Button type="submit" className="w-full">
              Reset password
            </form.Button>
          </form.AppForm>
        </Form>
      </div>
    </>
  );
}
