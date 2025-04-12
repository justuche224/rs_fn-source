import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { CopyIcon, CheckIcon, Share2Icon, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getReferrals,
  getReferralStata,
  type Referral,
  type Stats,
} from "@/utils/referrals";

export const Route = createFileRoute("/dashboard/referrals")({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    const errorMsg = error.message ?? "An error occurred";
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-red-700 dark:text-red-400">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  },
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session || !data?.user) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/dashboard/referrals" },
      });
    }
  },
  loader: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session || !data?.user) {
      throw new Error("Unauthorized");
    }
    return { user: data.user };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();
  const refLink = `https://resonantfinance.org/ref/${user.id}`;
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [referralsData, statsData] = await Promise.all([
          getReferrals(),
          getReferralStata(),
        ]);
        setReferrals(referralsData);
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch referral data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join using my referral link",
          text: "Use my referral link to sign up and we both get rewards!",
          url: refLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Referral Program
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Invite friends and earn rewards when they sign up using your link.
        </p>
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
          <p className="text-sm text-amber-800 dark:text-amber-400">
            <strong>Important:</strong> Attempting to abuse the referral system
            by creating fake accounts or engaging in fraudulent activities may
            result in account suspension or permanent ban. All referrals are
            subject to verification.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-3 md:col-span-2">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link with friends to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <div className="overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm">
                  {refLink}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="transition-all duration-200"
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2Icon className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Earn <span className="font-semibold text-primary">$10</span> for
              each friend who signs up and makes their first deposit
            </div>
          </CardFooter>
        </Card>

        <Card className="col-span-3 md:col-span-1">
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>Referral performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : (
              <>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Referrals
                  </div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-3xl font-semibold">
                      {stats?.totalReferrals || 0}
                    </div>
                    <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      people
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Rewards
                  </div>
                  <div className="mt-1 flex items-baseline">
                    <div className="text-3xl font-semibold">
                      {stats?.totalRewards || "0.00"}
                    </div>
                    <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {stats?.currency || "USD"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Referral Activity</CardTitle>
            <CardDescription>Recent referrals and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Referrals</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : referrals && referrals.length > 0 ? (
                  <div className="rounded-md border border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-12 gap-2 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                      <div className="col-span-3">User</div>
                      <div className="col-span-3">Date</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-3">Reward</div>
                    </div>
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="grid grid-cols-12 gap-2 p-4 text-sm border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <div className="col-span-3 font-medium text-gray-900 dark:text-gray-100">
                          {referral.referreeId.substring(0, 8)}...
                        </div>
                        <div className="col-span-3 text-gray-600 dark:text-gray-400">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </div>
                        <div className="col-span-3">
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
                            Completed
                          </span>
                        </div>
                        <div className="col-span-3 text-gray-900 dark:text-gray-100">
                          $10.00
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8">
                    <div className="text-center">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        No referrals yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Share your referral link to start earning rewards.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending">
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8">
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      No pending referrals
                    </h3>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="completed">
                {loading ? (
                  <Skeleton className="h-16 w-full" />
                ) : referrals && referrals.length > 0 ? (
                  <div className="rounded-md border border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-12 gap-2 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                      <div className="col-span-3">User</div>
                      <div className="col-span-3">Date</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-3">Reward</div>
                    </div>
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="grid grid-cols-12 gap-2 p-4 text-sm border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <div className="col-span-3 font-medium text-gray-900 dark:text-gray-100">
                          {referral.referreeId.substring(0, 8)}...
                        </div>
                        <div className="col-span-3 text-gray-600 dark:text-gray-400">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </div>
                        <div className="col-span-3">
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
                            Completed
                          </span>
                        </div>
                        <div className="col-span-3 text-gray-900 dark:text-gray-100">
                          $10.00
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8">
                    <div className="text-center">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        No completed referrals
                      </h3>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
