import {
  IdentityProviderEmailAlreadyExistsError,
  IdentityProviderError,
  IdentityProviderInvalidEmailError,
  IdentityProviderInvalidPasswordError,
} from "@/application/ports/identity-provider";
import { useIdentityActions } from "@/infrastructure/hooks/identity";
import { getFieldError } from "@/infrastructure/forms";
import { passwordSchema } from "@/infrastructure/validators";
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

export const Route = createFileRoute("/sign-up")({
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
  const navigate = useNavigate();
  const { signUp } = useIdentityActions();
  const signUpMutation = useMutation(signUp());

  const form = useAppForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.email(),
        firstName: z.string().min(1).max(50),
        lastName: z.string().min(1).max(100),
        password: passwordSchema,
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await signUpMutation.mutateAsync({
          email: value.email,
          firstName: value.firstName,
          lastName: value.lastName,
          password: value.password,
        });

        form.reset();
        sessionStorage.setItem("VERIFICATION_EMAIL", value.email);
        toast(`Welcome aboard, ${value.firstName}! Verify your email`, {
          variant: "success",
        });
        navigate({ to: "/verify" });
      } catch (error) {
        if (error instanceof IdentityProviderEmailAlreadyExistsError) {
          toast("An account with this email already exists", {
            variant: "danger",
          });
        } else if (error instanceof IdentityProviderInvalidEmailError) {
          toast("Please enter a valid email address", { variant: "danger" });
        } else if (error instanceof IdentityProviderInvalidPasswordError) {
          toast("Password does not meet the required strength", {
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
            <NotebookPen className="bg-accent text-accent-foreground h-[1em] w-[1em] rounded-xl p-0.5" />
            <span className="font-heading font-semibold">ITALA</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-heading text-2xl font-medium">
            Create your account
          </p>
          <p className="text-muted text-center text-sm">
            Start building a clearer picture of your money.
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

          <form.AppField name="firstName">
            {(field) => {
              const { isInvalid, errorMessage } = getFieldError(field);
              return (
                <field.TextField isInvalid={isInvalid}>
                  <Label>First name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    variant="secondary"
                    placeholder="John"
                  />
                  <FieldError>{errorMessage}</FieldError>
                </field.TextField>
              );
            }}
          </form.AppField>

          <form.AppField name="lastName">
            {(field) => {
              const { isInvalid, errorMessage } = getFieldError(field);
              return (
                <field.TextField isInvalid={isInvalid}>
                  <Label>Last name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    variant="secondary"
                    placeholder="Doe"
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
            By continuing, you agree to Itala’s terms.
          </p>

          <form.AppForm>
            <form.Button
              type="submit"
              className="w-full"
              isDisabled={signUpMutation.isPending}
            >
              Create account
            </form.Button>
          </form.AppForm>
        </Form>
      </div>
    </>
  );
}
