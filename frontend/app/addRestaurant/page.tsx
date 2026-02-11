"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import "./addRestaurant.css";
import { addRestaurantThunk } from "@/redux/restaurantSlice";

const AddProductSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(20,"Please Enter Location"),
  images: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "At least one image is required"),
});

type ProductFormData = z.infer<typeof AddProductSchema>;

export default function AddProductsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      return router.push("/authentication/login");
    }

    if (user.role === "RESTAURANT OWNER") {
      return router.push("/authentication/login");
    }
  }, [router,user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(AddProductSchema),
  });

  const handleAddProducts: SubmitHandler<ProductFormData> = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("location", data.location);
    Array.from(data.images).forEach((file) => {
      formData.append("images", file);
    });
    if (user) {
      formData.append("sellerId", user.id.toString());
    }
    dispatch(addRestaurantThunk(formData));

    reset();
    alert("Restaurant Details added successfully");
  };

//   if (!user || user.role !== "RESTAURANT OWNER") {
//     return <Typography sx={{ p: 4 }}>Redirecting...</Typography>;
//   }

  return (
    <Box className="Design">
      <form onSubmit={handleSubmit(handleAddProducts)} noValidate>
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
          label="Location"
          sx={{ mb: 2 }}
          {...register("location")}
          error={!!errors.location}
          helperText={errors.location?.message}
        />

        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("images")}
          />
          {errors.images && (
            <Typography color="error" variant="body2">
              {errors.images.message as string}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ fontSize: 20, mt: 2 }}
        >
          ADD DISHES 🍽️
        </Button>
      </form>
    </Box>
  );
}
