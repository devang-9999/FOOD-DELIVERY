/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  CardMedia,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProductsThunk, resetProducts } from "../../redux/productSlice";
import { addToCartThunk, getMyCartThunk } from "../../redux/cartSlice";
import Navbar from "../components/navbar";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  "http://localhost:5000/uploads/dishes";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
}

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "All";

  const {
    data: products,
    total,
    loading,
  } = useAppSelector((state) => state.products);

  const { user } = useAppSelector((state) => state.auth);

  const [showLoader, setShowLoader] = useState(false);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!user) {
      return router.push("/authentication/login");
    }

    if (user.role !== "CUSTOMER") {
      return router.push("/authentication/login");
    }
  });

  useEffect(() => {
    dispatch(resetProducts());
    isFetchingRef.current = false;
    setShowLoader(true);

    const timer = setTimeout(() => {
      dispatch(
        fetchProductsThunk({
          limit: 12,
          searchTerm: searchQuery || undefined,
          category: categoryQuery !== "All" ? categoryQuery : undefined,
        }),
      );
    }, 1000);

    if (categoryQuery === "All" && searchParams.get("category") === "All") {
      router.replace("/dashboard", { scroll: false });
    }

    return () => clearTimeout(timer);
  }, [searchQuery, categoryQuery, dispatch, router, searchParams]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentPosition =
        window.innerHeight + document.documentElement.scrollTop;

      if (
        currentPosition + 200 >= scrollHeight &&
        !loading &&
        !isFetchingRef.current &&
        products.length < total
      ) {
        isFetchingRef.current = true;
        setShowLoader(true);

        setTimeout(async () => {
          await dispatch(
            fetchProductsThunk({
              limit: 12,
              searchTerm: searchQuery || undefined,
              category: categoryQuery !== "All" ? categoryQuery : undefined,
            }),
          );
          isFetchingRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, products.length, total, searchQuery, categoryQuery, dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(getMyCartThunk(user.id));
    }
  }, [user?.id, dispatch]);

  const handleAddToCart = (productId: number) => {
    if (!user?.id) {
      router.push("/authentication/login");
      return;
    }
    dispatch(addToCartThunk({ userId: user.id, productId, quantity: 1 }));
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          px: 3,
          py: 4,
          minHeight: "60vh",
        }}
      >
        {products.map((product: Product) => (
          <Card
            key={product.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={
                product.images?.length
                  ? `${IMAGE_BASE_URL}/${product.images[0]}`
                  : "/placeholder.png"
              }
              alt={product.name}
              sx={{ objectFit: "contain", p: 2, bgcolor: "#f9f9f9" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {product.name}
              </Typography>
              <Typography color="primary" variant="h6" fontWeight="bold">
                ₹{product.price.toLocaleString("en-IN")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.category}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => router.push(`/dishDetails/${product.id}`)}
              >
                Details
              </Button>
              <Button
                size="small"
                variant="contained"
                disabled={product.stock < 1}
                onClick={() => handleAddToCart(product.id)}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          minHeight: "150px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        {showLoader && (
          <>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading amazing products...
            </Typography>
          </>
        )}

        {!showLoader && products.length === 0 && (
          <Typography variant="h6" color="text.secondary">
            Loading your products
          </Typography>
        )}

        {!showLoader && products.length >= total && products.length > 0 && (
          <Typography color="text.secondary" variant="body1" sx={{ mt: 2 }}>
            ✨ You have seen everything!
          </Typography>
        )}
      </Box>
    </>
  );
}
