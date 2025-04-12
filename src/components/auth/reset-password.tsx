import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AccentCard } from "@/components/ui/accent-card";
import React, { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "../ui/form-error";
import { FormSuccess } from "../ui/form-success";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function ResetPasswordForm({
    token,
    invalidToken,
    className,
    ...props
}: React.ComponentProps<"div"> & { token?: string, invalidToken?: string }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>(invalidToken ?? "");
    const [success, setSuccess] = useState<string | undefined>("");
    const navigate = useNavigate()

    const formSchema = z.object({
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
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (invalidToken) {
            toast.error("Invalid Token");
            return
        }
        if (!token) {
            toast.error("Invalid Token");
            return;
        }
        setError(undefined);
        setSuccess(undefined);
        startTransition(async () => {
            const { error } = await authClient.resetPassword({
                newPassword: values.password,
                token
            }, {
                onSuccess: () => {
                    setSuccess("Password updated!");
                    toast.success("Password updated!", {
                        description: "You can now login to your account",
                        duration: 5000,
                        position: "top-right",
                        icon: "🔑",
                        
                    });
                    navigate({ to: "/sign-in" })
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                }
            });
            if (error) {
                console.error(error);
            }
        });
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <AccentCard className="overflow-hidden">
                <div className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Reset Password</h1>
                                    <p className="text-balance text-muted-foreground">
                                        Create a new Password
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        disabled={isPending || error === invalidToken}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="********"
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        disabled={isPending || error === invalidToken}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="********"
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormError message={error} />
                                <FormSuccess message={success} />
                                <Button type="submit" className="w-full" disabled={isPending || error === invalidToken}>
                                    {isPending ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <span>Reset Password</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/auth-image.jpg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale hover:dark:brightness-100 hover:dark:grayscale-0 transition-all duration-300"
                        />
                    </div>
                </div>
            </AccentCard>
            <div
                className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
