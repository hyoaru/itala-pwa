import {
  IdentityProviderCodeDeliveryFailureError,
  IdentityProviderError,
  IdentityProviderInvalidCodeError,
  IdentityProviderUserNotFoundError,
} from "@/application/ports/identity-provider";
import { useIdentityActions } from "@/infrastructure/hooks";
import { getFieldError } from "@/infrastructure/forms";
import { Button, Form, InputOTP, TextField, toast } from "@heroui/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft, NotebookPen } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/verify")({
  beforeLoad: () => {
    const email = sessionStorage.getItem("VERIFICATION_EMAIL");
    if (!email) throw redirect({ to: "/sign-in" });
  },
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
  const email = sessionStorage.getItem("VERIFICATION_EMAIL") ?? "";
  const { verifyAccount, sendAccountVerification } = useIdentityActions();
  const verifyAccountMutation = useMutation(verifyAccount());
  const sendAccountVerificationMutation = useMutation(
    sendAccountVerification(),
  );

  const form = useAppForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onChange: z.object({
        code: z.string().length(6),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await verifyAccountMutation.mutateAsync({
          email: email,
          code: value.code,
        });

        form.reset();
        sessionStorage.removeItem("VERIFICATION_EMAIL");
        toast("Email verified successfully!", { variant: "success" });
        navigate({ to: "/" });
      } catch (error) {
        if (error instanceof IdentityProviderInvalidCodeError) {
          toast("Invalid or expired code. Please try again.", {
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

  const onResend = async () => {
    try {
      await sendAccountVerificationMutation.mutateAsync({
        email: email,
      });
      toast("Email verification sent", { variant: "success" });
    } catch (error) {
      if (error instanceof IdentityProviderCodeDeliveryFailureError) {
        toast("Could not resend the code. Please try again.", {
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
  };

  return (
    <>
      <div className="h-full w-full space-y-8">
        <div className="relative flex w-full items-center justify-center text-3xl">
          <div className="absolute flex w-full justify-start">
            <Link to="/" className="button button--icon button--secondary">
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
            Confirm your email
          </p>
          <p className="text-muted text-center text-sm">
            We sent a 6-digit confirmation code to {email}
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
                  <p className="text-muted text-sm">
                    Didn't receive a code?{" "}
                    <button
                      onClick={onResend}
                      className="text-foreground font-medium underline"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              );
            }}
          </form.AppField>

          <form.AppForm>
            <form.Button
              type="submit"
              className="w-full"
              isDisabled={verifyAccountMutation.isPending}
            >
              Verify account
            </form.Button>
          </form.AppForm>
        </Form>
      </div>
    </>
  );
}
