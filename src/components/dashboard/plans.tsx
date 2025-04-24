import { useEffect, useState } from "react";
import { getPlans, type Plan } from "@/utils/plans";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function PlansComponent() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await getPlans();
        setPlans(data);
      } catch (err) {
        setError("Failed to load investment plans. Please try again later.");
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleInvest = (plan: Plan) => {
    navigate({ to: `/dashboard/account/invest/${plan.id}` });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 mx-auto lg:w-[95%] px-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Investment Plans</h1>
        <p className="text-muted-foreground">
          Choose the investment plan that suits your financial goals
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No investment plans available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col shadow bg-sidebar">
              <CardHeader>
                <CardTitle>{plan.type}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      minimum investment
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>ROI Range:</span>
                      <span className="font-medium">
                        ${plan.minRoiAmount} - ${plan.maxRoiAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission:</span>
                      <span className="font-medium">{plan.commission}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage:</span>
                      <span className="font-medium">{plan.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{plan.duration} months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full cursor-pointer"
                  onClick={() => handleInvest(plan)}
                >
                  Invest Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
