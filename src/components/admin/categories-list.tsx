import { useEffect, useState } from "react";
import { Edit, Loader2, Plus, Search, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

import {
  getAllCategories,
  deleteCategory,
  getCategory,
  editCategory,
  type Category,
} from "@/utils/products";
import { useNavigate } from "@tanstack/react-router";

export default function CategoryAdminPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter categories based on search query
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCategories(
        categories.filter(
          (category) =>
            category.name?.toLowerCase().includes(query) ||
            category.id.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, categories]);

  const handleEditCategory = async (categoryId: string) => {
    try {
      const category = await getCategory(categoryId);
      setSelectedCategory(category);
      setEditCategoryName(category.name);
      setEditDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch category details");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedCategory || !editCategoryName.trim()) return;

    try {
      setProcessingEdit(true);
      await editCategory(selectedCategory.id, editCategoryName);
      toast.success("Category updated successfully");
      fetchCategories();
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setProcessingEdit(false);
    }
  };

  const handleDeleteCategories = async () => {
    if (selectedCategoryIds.size === 0) return;

    try {
      setProcessingDelete(true);
      await deleteCategory(Array.from(selectedCategoryIds));
      toast.success(
        `Successfully deleted ${selectedCategoryIds.size} category(ies)`
      );
      setSelectedCategoryIds(new Set());
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete categories");
    } finally {
      setProcessingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  const toggleSelectCategory = (categoryId: string) => {
    const newSelection = new Set(selectedCategoryIds);
    if (newSelection.has(categoryId)) {
      newSelection.delete(categoryId);
    } else {
      newSelection.add(categoryId);
    }
    setSelectedCategoryIds(newSelection);
  };

  const selectAllCategories = () => {
    if (selectedCategoryIds.size === filteredCategories.length) {
      // If all are selected, unselect all
      setSelectedCategoryIds(new Set());
    } else {
      // Otherwise select all filtered categories
      setSelectedCategoryIds(
        new Set(filteredCategories.map((category) => category.id))
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search categories..."
              className="pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => navigate({ to: "/admin/categories/new" })}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Category
          </Button>
          <Button
            onClick={fetchCategories}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
          {selectedCategoryIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="cursor-pointer"
              disabled={processingDelete}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete ({selectedCategoryIds.size})
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
                      selectedCategoryIds.size > 0 &&
                      selectedCategoryIds.size === filteredCategories.length
                    }
                    onCheckedChange={selectAllCategories}
                    className="cursor-pointer"
                    aria-label="Select all categories"
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {searchQuery
                      ? "No categories found matching your search"
                      : "No categories found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCategoryIds.has(category.id)}
                        onCheckedChange={() =>
                          toggleSelectCategory(category.id)
                        }
                        className="cursor-pointer"
                        aria-label={`Select ${category.name || "category"}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {category.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        {category.productsCount} Products
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell>{formatDate(category.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedCategoryIds(new Set([category.id]));
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

      {/* Edit Category Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setSelectedCategory(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name below.
            </DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="categoryName" className="text-sm font-medium">
                  Category Name
                </label>
                <Input
                  id="categoryName"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="cursor-pointer"
              disabled={processingEdit}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="cursor-pointer"
              disabled={processingEdit || !editCategoryName.trim()}
            >
              {processingEdit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open && !processingDelete) {
            setSelectedCategoryIds(new Set());
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Category Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCategoryIds.size > 1
                ? `Are you sure you want to delete ${selectedCategoryIds.size} categories? This action cannot be undone and will remove all products in these categories.`
                : "Are you sure you want to delete this category? This action cannot be undone and will remove all products in this category."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCategories();
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
