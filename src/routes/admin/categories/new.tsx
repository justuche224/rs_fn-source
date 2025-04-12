import { AccentCard } from "@/components/ui/accent-card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { createCategory } from "@/utils/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/admin/categories/new")({
  component: RouteComponent,
  validateSearch: (Search) => {
    return z
      .object({
        callbackURL: z.string().optional(),
      })
      .parse(Search);
  },
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/admin/categories/new" },
      });
    }
    if (data.user.role !== "ADMIN") {
      return redirect({ to: "/dashboard" });
    }
  },
  errorComponent: ({ error }) => {
    const errorMsg = error.message ?? "An error occurred";
    return <div>{errorMsg}</div>;
  },
});

const formSchema = z.object({
  name: z.string().min(1),
});

function RouteComponent() {
  const { callbackURL } = Route.useSearch();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      try {
        await createCategory(values.name);
        setSuccess("Category Created");
        navigate({ to: callbackURL ?? "/admin/categories" });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create category"
        );
      }
    });
  }

  return (
    <div className="h-full flex justify-center mt-10 container max-w-2xl w-full mx-auto">
      <AccentCard
        className="max-w-2xl mx-auto lg:w-2xl md:w-xl sm:w-lg"
        title="New Category"
        description="Create a new category"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Category Name"
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
                "Create Category"
              )}
            </Button>
          </form>
        </Form>
      </AccentCard>
    </div>
  );
}
