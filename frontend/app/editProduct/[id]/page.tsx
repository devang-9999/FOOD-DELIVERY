/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Typography, Box } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateProductBySellerThunk } from "../../../redux/productSlice";

import "./editProduct.css";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "next/navigation";

const AddProductSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
});

type ProductFormData = z.infer<typeof AddProductSchema>;

export default function EditProductPage() {
  const dispatch = useAppDispatch();
  const searchParams = useParams()
console.log(searchParams.id)
const id = searchParams.id
  const { user } = useAppSelector((state) => state.auth);
const userId = user?.id
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(AddProductSchema),
  });

  const handleUpdateProducts = (data: any) => {
    dispatch(updateProductBySellerThunk(data));

    reset();
    alert("Product added successfully");
  };

  if (!user || user.role !== "RESTAURANT OWNER") {
    return <Typography sx={{ p: 4 }}>Redirecting...</Typography>;
  }

  return (
    <Box className="Design">
      <form onSubmit={handleSubmit(handleUpdateProducts)} noValidate>
        <TextField
          fullWidth
          label="Product Name"
          sx={{ mb: 2 }}
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          sx={{ mb: 2 }}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <TextField
          fullWidth
          type="number"
          label="Price"
          sx={{ mb: 2 }}
          {...register("price", { valueAsNumber: true })}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        <TextField
          fullWidth
          label="Category"
          sx={{ mb: 2 }}
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
        />

        <TextField
          fullWidth
          label="Brand"
          sx={{ mb: 2 }}
          {...register("brand")}
          error={!!errors.brand}
          helperText={errors.brand?.message}
        />

        <TextField
          fullWidth
          type="number"
          label="Stock"
          sx={{ mb: 2 }}
          {...register("stock", { valueAsNumber: true })}
          error={!!errors.stock}
          helperText={errors.stock?.message}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ fontSize: 20, mt: 2 }}
        >
          UPDATE DISH
        </Button>
      </form>
    </Box>
  );
}
