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
      <div className="flex h-full items-center justify-center py-16">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center py-16">
        <div className="rounded-lg bg-red-100 p-6 text-red-800 border border-red-200 shadow-md">
          <h2 className="text-lg font-bold mb-2">Error Loading Plans</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#273272] mb-3">
            Investment Plans
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Choose the investment plan that suits your financial goals.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center bg-gray-50">
            <p className="text-lg text-muted-foreground">
              No investment plans available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="shadow-xl border-0 text-center h-full bg-white flex flex-col">
                <CardHeader className="pt-8 px-6">
                  <CardTitle className="text-xl font-bold text-[#273272] mb-2">{plan.type}</CardTitle>
                  <hr className="w-1/2 h-0.5 bg-[#273272] mx-auto my-2" />
                  <CardDescription className="text-gray-600 px-4">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-6 flex-grow">
                  <ul className="space-y-3 mt-4 mb-6 text-gray-800">
                    <li>
                      Minimum Investment: <strong>${plan.price.toLocaleString()}</strong>
                    </li>
                    <li>
                      ROI Range: <strong>${plan.minRoiAmount.toLocaleString()} - ${plan.maxRoiAmount.toLocaleString()}</strong>
                    </li>
                    <li>
                      Commission: <strong>{plan.commission}%</strong>
                    </li>
                    <li>
                      Percentage Return: <strong>{plan.percentage}%</strong>
                    </li>
                    <li>
                      Duration: <strong>{plan.duration} months</strong>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pb-8 pt-0 px-6 flex justify-center">
                  <Button
                    className="w-full bg-[#e93c05] hover:bg-[#011a41] text-white font-semibold transition-colors cursor-pointer"
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
    </section>
  );
}
