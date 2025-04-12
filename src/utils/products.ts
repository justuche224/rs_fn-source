import axios from "axios";

const BASE_URL = "http://localhost:5000/api/products";

export interface Product {
  imageUrl: string;
  id: string;
  name: string;
  img: string;
  price: string;
  description: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  productsCount: number;
  products: {
    imageUrl: string;
    id: string;
    name: string;
    img: string;
    price: string;
    description: string;
    categoryId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

// PUBLIC CATEGORIES

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data.data;
};

export const getCategory = async (categoryId: string): Promise<Category> => {
  const response = await axios.get(`${BASE_URL}/categories/${categoryId}`);
  return response.data;
};

export const getAllProduct = async (): Promise<Product[]> => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data.data;
};

export const getProduct = async (productId: string): Promise<Product> => {
  const response = await axios.get(`${BASE_URL}/${productId}`);
  return response.data;
};

// ADMIN CATEGORIES
export const createCategory = async (categoryName: string) => {
  await axios.post(
    `${BASE_URL}/categories`,
    { name: categoryName },
    { withCredentials: true }
  );
};

export const editCategory = async (
  categoryId: string,
  categoryName: string
) => {
  await axios.put(
    `${BASE_URL}/categories/${categoryId}`,
    { name: categoryName },
    { withCredentials: true }
  );
};

export const deleteCategory = async (categoryIds: string[]) => {
  await axios.delete(`${BASE_URL}/categories`, {
    data: { categoryIds },
    withCredentials: true,
  });
};

//   ADMIN PRODUCTS

export const createProduct = async (
  name: string,
  price: number,
  description: string,
  categoryId: string,
  imageFile: File
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price.toString());
  formData.append("description", description);
  formData.append("categoryId", categoryId);
  formData.append("image", imageFile);
  await axios.post(`${BASE_URL}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editProduct = async (
  productId: string,
  name?: string,
  price?: string,
  description?: string,
  categoryId?: string,
  imageFile?: File
) => {
  const formData = new FormData();
  if (name) {
    formData.append("name", name);
  }
  if (price) {
    formData.append("price", price);
  }
  if (description) {
    formData.append("description", description);
  }
  if (categoryId) {
    formData.append("categoryId", categoryId);
  }
  if (imageFile) {
    formData.append("image", imageFile);
  }
  await axios.put(`${BASE_URL}/${productId}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = async (productIds: string[]) => {
  await axios.delete(`${BASE_URL}`, {
    data: { productIds },
    withCredentials: true,
  });
};
