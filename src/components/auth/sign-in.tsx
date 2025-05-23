import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { authClient } from "@/lib/auth-client"
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage 
} from "@/components/ui/form"
import { FormSuccess } from "@/components/ui/form-success"
import { FormError } from "@/components/ui/form-error"
import { ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"

export function LoginForm({
  callbackURL = "/dashboard",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { callbackURL?: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const navigate = useNavigate();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("start login")
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      const { error } = await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: `${window.location.origin}${callbackURL}`,
        },
        {
          onSuccess: () => {
            console.log("login success")
            navigate({ to: callbackURL });
          },
          onError(context) {
            console.log("login error")
            if (context.error.status === 403) {
              toast.error("Verify your email!");
              setSuccess(
                "A link to verify your email has been sent to your inbox."
              );
            }
            else if (context.error.status === 429) {
              const retryAfter = context.error.headers.get("X-Retry-After");
              setError(`Clicking too fast! Please wait ${retryAfter} seconds before trying again.`);
            } 
            else {
              setError(context.error.message);
            }
          },
        }
      );
      if (error) {
        setError(error.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
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
            name="password"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <div className="flex items-center">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <Input 
                    {...field} 
                    id="password" 
                    type="password" 
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
                Login <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
          {/* <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button> */}
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  )
}
