"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getMyProductsThunk } from "../../redux/productSlice";
import axios from "axios";

export default function OwnerDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const { myProducts, loading } = useAppSelector((state) => state.products);
  console.log(myProducts)
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const toggleBanUser = async (product: any) => {
    console.log(product)
    if (product.isBanned) {
      await axios.patch(`http://localhost:5000/products/unban/${product}`);
      alert("User unbanned");
    } else {
      await axios.patch(`http://localhost:5000/products/ban/${product}`);
      alert("User banned");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/authentication/login");
      return;
    }

    if (user.role !== "RESTAURANT OWNER") {
      router.push("/authentication/login");
      return;
    }
    const sellerId = user.id;

    dispatch(getMyProductsThunk({ sellerId }));
  }, [dispatch, user, router]);

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Owner Dashboard
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => router.push("/addDishes")}
      >
        Add Product
      </Button>

      {myProducts.length === 0 && (
        <Typography>No products created yet</Typography>
      )}

      {myProducts.map((product) => (
      
        <Card key={product.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{product.name}</Typography>
            <Typography>₹{product.price}</Typography>
            <Typography>Stock: {product.stock}</Typography>
            <Typography>Category: {product.category}</Typography>
             <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  color={product.isBanned ? "success" : "error"}
                  onClick={() => toggleBanUser(product.id)}
                >
                  {product.isBanned ? "Unban Dish" : "Ban Dish"}
                </Button>

            <Button
              sx={{ mt: 1 }}
              onClick={() => router.push(`/editProduct/${product.id}`)}
            >
              Edit
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
