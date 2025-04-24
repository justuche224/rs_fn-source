import { useEffect, useState } from "react";
import { Edit, Loader2, Plus, Search, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { getPlans, deletePlan, type Plan } from "@/utils/plans";
import { useNavigate } from "@tanstack/react-router";

export default function PlanAdminPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(
    new Set()
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getPlans();
      setPlans(data);
      setFilteredPlans(data);
    } catch (error) {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    // Filter plans based on search query
    if (searchQuery.trim() === "") {
      setFilteredPlans(plans);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPlans(
        plans.filter(
          (plan) =>
            plan.type?.toLowerCase().includes(query) ||
            plan.id.toLowerCase().includes(query) ||
            plan.description?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, plans]);

  const handleNavigateToEditPage = (planId: string) => {
    navigate({ to: `/admin/plans/edit/${planId}` });
  };

  const handleDeletePlans = async () => {
    if (selectedPlanIds.size === 0) return;

    try {
      setProcessingDelete(true);
      await deletePlan(Array.from(selectedPlanIds));
      toast.success(`Successfully deleted ${selectedPlanIds.size} plan(s)`);
      setSelectedPlanIds(new Set());
      fetchPlans();
    } catch (error) {
      toast.error("Failed to delete plans");
    } finally {
      setProcessingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  const toggleSelectPlan = (planId: string) => {
    const newSelection = new Set(selectedPlanIds);
    if (newSelection.has(planId)) {
      newSelection.delete(planId);
    } else {
      newSelection.add(planId);
    }
    setSelectedPlanIds(newSelection);
  };

  const selectAllPlans = () => {
    if (selectedPlanIds.size === filteredPlans.length) {
      // If all are selected, unselect all
      setSelectedPlanIds(new Set());
    } else {
      // Otherwise select all filtered plans
      setSelectedPlanIds(new Set(filteredPlans.map((plan) => plan.id)));
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Investment Plans Management</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search plans..."
              className="pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => navigate({ to: "/admin/plans/new" })}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Plan
          </Button>
          <Button
            onClick={fetchPlans}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
          {selectedPlanIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="cursor-pointer"
              disabled={processingDelete}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete ({selectedPlanIds.size})
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <div className="bg-sidebar rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedPlanIds.size > 0 &&
                      selectedPlanIds.size === filteredPlans.length
                    }
                    onCheckedChange={selectAllPlans}
                    className="cursor-pointer"
                    aria-label="Select all plans"
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>ROI Range</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {searchQuery
                      ? "No plans found matching your search"
                      : "No plans found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPlanIds.has(plan.id)}
                        onCheckedChange={() => toggleSelectPlan(plan.id)}
                        className="cursor-pointer"
                        aria-label={`Select ${plan.type || "plan"}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {plan.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        {plan.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(plan.price)}</TableCell>
                    <TableCell>
                      {formatCurrency(plan.minRoiAmount)} -{" "}
                      {formatCurrency(plan.maxRoiAmount)}
                      <div className="text-xs text-muted-foreground">
                        {plan.percentage}% return
                      </div>
                    </TableCell>
                    <TableCell>
                      {plan.duration} months
                      <div className="text-xs text-muted-foreground">
                        {plan.commission}% commission
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(plan.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigateToEditPage(plan.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedPlanIds(new Set([plan.id]));
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open && !processingDelete) {
            setSelectedPlanIds(new Set());
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Plan Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPlanIds.size > 1
                ? `Are you sure you want to delete ${selectedPlanIds.size} plans? This action cannot be undone.`
                : "Are you sure you want to delete this plan? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeletePlans();
              }}
              disabled={processingDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {processingDelete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
