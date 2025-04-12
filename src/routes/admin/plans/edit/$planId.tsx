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
import { getPlanById, updatePlan } from "@/utils/plans";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/admin/plans/edit/$planId")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: `/admin/products/edit/${params.planId}` },
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
  loader: async ({ params }) => {
    const plan = await getPlanById(params.planId);
    return { plan };
  },
});

const formSchema = z.object({
  type: z.string().min(1),
  price: z.string().min(1),
  minRoiAmount: z.string().min(1),
  maxRoiAmount: z.string().min(1),
  commission: z.string().min(1),
  percentage: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
});

function RouteComponent() {
  const { plan } = Route.useLoaderData();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: plan.type,
      price: plan.price.toString(),
      minRoiAmount: plan.minRoiAmount.toString(),
      maxRoiAmount: plan.maxRoiAmount.toString(),
      commission: plan.commission.toString(),
      percentage: plan.percentage.toString(),
      duration: plan.duration.toString(),
      description: plan.description,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      try {
        await updatePlan(plan.id, values);
        setSuccess("Plan Created");
        navigate({ to: "/admin/plans" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update plan");
      }
    });
  }

  return (
    <div className="h-full flex justify-center mt-10 container max-w-2xl w-full mx-auto">
      <AccentCard
        className="max-w-2xl mx-auto lg:w-2xl md:w-xl sm:w-lg"
        title="New Plan"
        description="Create a new Plan"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Type</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Plan Type e.g Premium,Starter..."
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Plan Price e.g 1000"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minRoiAmount"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan minRoiAmount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Plan minRoiAmount"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxRoiAmount"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan maxRoiAmount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Plan maxRoiAmount"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commission"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan commission</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Plan commission"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="percentage"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan percentage</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Plan percentage"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan duration</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Plan duration"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Plan description"
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
                "Create Plan"
              )}
            </Button>
          </form>
        </Form>
      </AccentCard>
    </div>
  );
}
