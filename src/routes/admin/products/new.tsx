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
import {
  createProduct,
  getAllCategories,
  type Category,
} from "@/utils/products";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  redirect,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/admin/products/new")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/admin/products/new" },
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
  name: z.string().min(3, "Name must be at least 3 characters long"),
  prize: z.number(),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  categoryId: z.string().min(3, "Category must be at least 3 characters long"),
  img: z
    .instanceof(File, { message: "Product is required" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    }),
});

function RouteComponent() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [preview, setPreview] = useState<string | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      prize: undefined,
      description: "",
      categoryId: "",
      img: undefined,
    },
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Error loading categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(undefined);
    setSuccess(undefined);
    startTransition(async () => {
      try {
        await createProduct(
          values.name,
          values.prize,
          values.description,
          values.categoryId,
          values.img
        );
        setSuccess("Product added successfully");
        navigate({ to: "/admin/products" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add product");
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
        title="New Product"
        description="Add a new product to the store"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-5">
              <FormField
                control={form.control}
                name="categoryId"
                disabled={isPending || loadingCategories}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingCategories
                                ? "Loading categories..."
                                : "Select Category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingCategories ? (
                          <SelectItem value="loading" disabled>
                            <div className="flex items-center">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Loading categories...
                            </div>
                          </SelectItem>
                        ) : categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            No categories available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    {!loadingCategories && categories.length === 0 && (
                      <div className="mt-2">
                        <Link
                          to="/admin/categories/new"
                          search={{ callbackURL: "/admin/products/new" }}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Create a category first
                        </Link>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Link
                  to="/admin/categories/new"
                  search={{ callbackURL: "/admin/products/new" }}
                >
                  New Category
                </Link>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Product name"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Product description"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prize"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="img"
              disabled={isPending}
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
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
                            alt="Product Image preview"
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
                "Add Product"
              )}
            </Button>
          </form>
        </Form>
      </AccentCard>
    </div>
  );
}
