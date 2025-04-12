import { useEffect, useState } from "react";
import { Eye, Loader2, Search, Trash, PlusCircle } from "lucide-react";

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
  getAllProduct,
  getProduct,
  deleteProduct,
  getAllCategories,
} from "@/utils/products";
import { type Product, type Category } from "@/utils/products";
import { useNavigate } from "@tanstack/react-router";

export default function ProductAdminPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProduct();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name?.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.id.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, products]);

  const handleViewProduct = async (productId: string) => {
    try {
      const product = await getProduct(productId);
      setSelectedProduct(product);
      setProductDetailOpen(true);
    } catch (error) {
      toast.error("Failed to fetch product details");
    }
  };

  const handleDeleteProducts = async () => {
    if (selectedProductIds.size === 0) return;

    try {
      setProcessingDelete(true);
      await deleteProduct(Array.from(selectedProductIds));
      toast.success(
        `Successfully deleted ${selectedProductIds.size} product(s)`
      );
      setSelectedProductIds(new Set());
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete products");
    } finally {
      setProcessingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  const toggleSelectProduct = (productId: string) => {
    const newSelection = new Set(selectedProductIds);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProductIds(newSelection);
  };

  const selectAllProducts = () => {
    if (selectedProductIds.size === filteredProducts.length) {
      // If all are selected, unselect all
      setSelectedProductIds(new Set());
    } else {
      // Otherwise select all filtered products
      setSelectedProductIds(
        new Set(filteredProducts.map((product) => product.id))
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate({ to: "/admin/products/new" })}
            className="cursor-pointer bg-green-600 hover:bg-green-700"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Create Product
          </Button>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={fetchProducts}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
          {selectedProductIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="cursor-pointer"
              disabled={processingDelete}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete ({selectedProductIds.size})
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
                      selectedProductIds.size > 0 &&
                      selectedProductIds.size === filteredProducts.length
                    }
                    onCheckedChange={selectAllProducts}
                    className="cursor-pointer"
                    aria-label="Select all products"
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {searchQuery
                      ? "No products found matching your search"
                      : "No products found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProductIds.has(product.id)}
                        onCheckedChange={() => toggleSelectProduct(product.id)}
                        className="cursor-pointer"
                        aria-label={`Select ${product.name || "product"}`}
                      />
                    </TableCell>
                    <TableCell>
                      {product.imageUrl ? (
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name || product.id.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate({
                              to: `/admin/products/edit/${product.id}`,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedProductIds(new Set([product.id]));
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

      {/* Product Detail Dialog */}
      <Dialog
        open={productDetailOpen}
        onOpenChange={(open) => {
          setProductDetailOpen(open);
          if (!open) setSelectedProduct(null);
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about this product.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid gap-4">
              {selectedProduct.imageUrl && (
                <div className="flex justify-center">
                  <div className="h-40 w-40 rounded-md overflow-hidden">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Product ID:</h3>
                  <p className="text-sm text-gray-600">{selectedProduct.id}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Category:</h3>
                  <p>
                    <Badge variant="outline">
                      {getCategoryName(selectedProduct.categoryId)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Name:</h3>
                  <p className="text-sm">
                    {selectedProduct.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Price:</h3>
                  <p className="text-sm">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-semibold">Description:</h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedProduct.description || "No description provided"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Created At:</h3>
                  <p className="text-sm">
                    {formatDate(selectedProduct.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Last Updated:</h3>
                  <p className="text-sm">
                    {formatDate(selectedProduct.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductDetailOpen(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedProduct) {
                  setProductDetailOpen(false);
                  navigate({
                    to: `/admin/products/edit/${selectedProduct.id}`,
                  });
                }
              }}
              className="cursor-pointer"
            >
              Edit Product
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedProduct) {
                  setProductDetailOpen(false);
                  setSelectedProductIds(new Set([selectedProduct.id]));
                  setDeleteDialogOpen(true);
                }
              }}
              className="cursor-pointer"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete Product
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
            setSelectedProductIds(new Set());
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Product Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedProductIds.size > 1
                ? `Are you sure you want to delete ${selectedProductIds.size} products? This action cannot be undone.`
                : "Are you sure you want to delete this product? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteProducts();
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
