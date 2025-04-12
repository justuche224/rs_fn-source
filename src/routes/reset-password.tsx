import {createFileRoute} from '@tanstack/react-router'
import {z} from "zod";
import {ResetPasswordForm} from "@/components/auth/reset-password.tsx";

export const Route = createFileRoute('/reset-password')({
    component: RouteComponent,
    validateSearch: (Search) => {
        return z
            .object({
                token: z.string().optional(),
                error: z.string().optional(),
            })
            .parse(Search);
    },
})

function RouteComponent() {
    const {token, error} = Route.useSearch();
    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <ResetPasswordForm token={token} invalidToken={error}/>
            </div>
        </div>
    );
}
