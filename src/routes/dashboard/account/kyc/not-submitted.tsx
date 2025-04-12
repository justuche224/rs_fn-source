import { authClient } from "@/lib/auth-client";
import { checkKYCStatus } from "@/utils/ktc-status";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { Loader2 } from "lucide-react";
import { uploadKYC } from "@/utils/kyc-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccentCard } from "@/components/ui/accent-card";

const formSchema = z.object({
  front: z.instanceof(File, { message: "Front image is required" }),
  back: z.instanceof(File, { message: "Back image is required" }),
  selfie: z.instanceof(File, { message: "Selfie image is required" }),
  documentType: z.enum(
    ["ID_CARD", "DRIVERS_LICENSE", "PASSPORT", "OTHER"] as const,
    {
      required_error: "Please select a document type",
    }
  ),
});

export const Route = createFileRoute("/dashboard/account/kyc/not-submitted")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session) {
      return redirect({ to: "/sign-in" });
    }
    const status = await checkKYCStatus();
    if (status !== "NOT_SUBMITTED") {
      return redirect({ to: "/dashboard/account/kyc" });
    }
  },
  loader: async () => {
    const { data } = await authClient.getSession();
    return {
      user: data?.user,
    };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front: undefined,
      back: undefined,
      selfie: undefined,
      documentType: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      if (!user || !user.id) {
        throw new Error("User not found");
      }
      try {
        await uploadKYC(
          values.front,
          values.back,
          values.selfie,
          values.documentType,
          user.id
        );
        setSuccess("KYC documents uploaded successfully");
        navigate({ to: "/dashboard/account/kyc/pending" });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload KYC documents"
        );
      }
    });
  }

  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <AccentCard className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">KYC Verification</h1>
            <p className="text-balance text-muted-foreground">
              Upload your identity documents for verification
            </p>
            <p className="text-balance text-muted-foreground">
              Upgrade your account to unlock full feature and increase your
              limit of transaction amount.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="documentType"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ID_CARD">ID Card</SelectItem>
                        <SelectItem value="DRIVERS_LICENSE">
                          Driver's License
                        </SelectItem>
                        <SelectItem value="PASSPORT">Passport</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="front"
                disabled={isPending}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Front of Document</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="back"
                disabled={isPending}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Back of Document</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selfie"
                disabled={isPending}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Selfie with Document</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0])}
                        {...field}
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
                  "Submit KYC Documents"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </AccentCard>
    </div>
  );
}
