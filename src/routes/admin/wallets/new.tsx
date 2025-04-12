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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { uploadSystemWallet } from "@/utils/wallets";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/admin/wallets/new")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/admin/wallets/new" },
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
  currency: z.enum(["BTC", "ETH", "USDT", "SOL", "BNB", "LTC"] as const, {
    required_error: "Currency is required",
  }),
  address: z.string().min(1),
  wallQRCode: z
    .instanceof(File, { message: "Wallet QR Code is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    }),
});

function RouteComponent() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [preview, setPreview] = useState<string | undefined>();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: undefined,
      address: "",
      wallQRCode: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      try {
        await uploadSystemWallet(
          values.currency,
          values.address,
          values.wallQRCode
        );
        setSuccess("Wallet uploaded successfully");
        navigate({ to: "/admin/wallets" });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload KYC documents"
        );
      }
    });
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="h-full flex justify-center mt-10 container max-w-2xl w-full mx-auto">
      <AccentCard
        className="max-w-2xl mx-auto lg:w-2xl md:w-xl sm:w-lg"
        title="Wallets"
        description="View, Manage, and Create wallets to let users deposit and withdraw funds"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currency"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wallet currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="BNB">BNB</SelectItem>
                      <SelectItem value="LTC">LTC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="1FfmbHfnpaZjKFvyi1okTjJJusN455paPH"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wallQRCode"
              disabled={isPending}
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Wallet QR Code</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                        {...field}
                        required
                      />
                      {preview && (
                        <div className="mt-2">
                          <img
                            src={preview}
                            alt="QR Code preview"
                            className="max-w-[200px] rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
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
                "Add Wallet"
              )}
            </Button>
          </form>
        </Form>
      </AccentCard>
    </div>
  );
}
