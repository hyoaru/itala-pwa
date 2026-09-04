import {
  IdentityProviderError,
  IdentityProviderInvalidCredentialsError,
  IdentityProviderPasswordResetRequiredError,
  IdentityProviderUserNotVerifiedError,
} from "@/application/ports/identity-provider";
import { useIdentityActions } from "@/infrastructure/hooks/identity";
import { useAuthenticationSessionContext } from "@/infrastructure/contexts/authentication-session";
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
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft, NotebookPen } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/sign-in")({
  beforeLoad: ({ context }) => {
    if (context.authenticationSession.isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
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
  const { setSession } = useAuthenticationSessionContext();
  const navigate = useNavigate();
  const { signIn } = useIdentityActions();
  const signInMutation = useMutation(signIn());

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.email(),
        password: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        const session = await signInMutation.mutateAsync({
          email: value.email,
          password: value.password,
        });

        setSession(session);
        form.reset();

        toast("Glad to have you back", { variant: "success" });
        navigate({ to: "/dashboard" });
      } catch (error) {
        if (error instanceof IdentityProviderInvalidCredentialsError) {
          toast("Incorrect email or password", { variant: "danger" });
        } else if (error instanceof IdentityProviderUserNotVerifiedError) {
          sessionStorage.setItem("VERIFICATION_EMAIL", value.email);
          toast("Please verify your email before signing in", {
            variant: "danger",
          });
          navigate({ to: "/verify" });
        } else if (
          error instanceof IdentityProviderPasswordResetRequiredError
        ) {
          toast("A password reset is required for this account", {
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
            <Link to="/" className="button button--icon button--secondary">
              <ArrowLeft className="" />
            </Link>
          </div>
          <span className="inline-flex items-center gap-1">
            <NotebookPen className="bg-accent h-[1em] w-[1em] rounded-xl p-0.5" />
            <span className="font-heading font-semibold">ITALA</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-heading text-2xl font-medium">Welcome back</p>
          <p className="text-muted text-sm">
            Sign in to pick up where you left off.
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

          <form.AppField name="password">
            {(field) => {
              const { isInvalid, errorMessage } = getFieldError(field);
              return (
                <field.TextField isInvalid={isInvalid}>
                  <Label>Password</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    variant="secondary"
                    placeholder="Enter your password"
                  />
                  <FieldError>{errorMessage}</FieldError>
                </field.TextField>
              );
            }}
          </form.AppField>

          <p className="text-muted pt-4 text-center text-sm">
            Trouble signing in?{" "}
            <Link className="font-medium underline" to="/forgot-password">
              Reset password
            </Link>
          </p>

          <form.AppForm>
            <form.Button
              type="submit"
              className="w-full"
              isDisabled={signInMutation.isPending}
            >
              Continue to Workspace
            </form.Button>
          </form.AppForm>
        </Form>
      </div>
    </>
  );
}
