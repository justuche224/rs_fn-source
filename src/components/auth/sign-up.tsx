import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ArrowRight } from "lucide-react";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { authClient } from "@/lib/auth-client";
import axios from "axios";

export function RegisterForm({
  callbackURL = "/dashboard",
  refCode,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & {
  callbackURL?: string;
  refCode?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const navigate = useNavigate();

  const formSchema = z
    .object({
      name: z.string().min(2).max(50),
      email: z.string().email(),
      phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
          /[@$!%*?&#]/,
          "Password must contain at least one special character"
        ),
      confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      const { data, error } = await authClient.signUp.email(
        {
          email: values.email,
          name: values.name,
          password: values.password,
          phone: values.phone,
          role: "USER",
          callbackURL: `${window.location.origin}${callbackURL}`,
          kyc_verified: false,
        },
        {
          onError(context) {
            setError(context.error.message);
          },
        }
      );
      if (error) {
        setError(error.message);
      }
      if (data) {
        try {
          await axios.post(
            "https://server.resonantfinance.org/api/referrals",
            {
              referrerId: refCode,
            },
            {
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error(error);
        } finally {
          navigate({ to: callbackURL });
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="phone">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    required
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    placeholder="********"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign Up <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
