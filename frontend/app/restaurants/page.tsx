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
import Navbar from "../components/navbar";
import {
  fetchRestaurantsThunk,
  resetRestaurants,
} from "@/redux/restaurantSlice";

const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  "http://localhost:5000/uploads/dishes";

export interface RestaurantPayload {
  id: number;
  name: string;
  description: string;
  location: string;
  images: string[];
}

export default function Restaurant() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const {
    data: Restaurant,
    total,
    loading,
  } = useAppSelector((state) => state.restaurant);
    const { user } = useAppSelector((state) => state.auth);

  const [showLoader, setShowLoader] = useState(false);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!user) {
      return router.push("/authentication/login");
    }

    if (user.role !== "RESTAURANT OWNER") {
      return router.push("/authentication/login");
    }
  });

  useEffect(() => {
    dispatch(resetRestaurants());
    isFetchingRef.current = false;
    setShowLoader(true);

    const timer = setTimeout(() => {
      dispatch(
        fetchRestaurantsThunk({
          limit: 12,
          searchTerm: searchQuery || undefined,
        }),
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch, router, searchParams]);

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
        Restaurant.length < total
      ) {
        isFetchingRef.current = true;
        setShowLoader(true);

        setTimeout(async () => {
          await dispatch(
            fetchRestaurantsThunk({
              limit: 12,
              searchTerm: searchQuery || undefined,
            }),
          );
          isFetchingRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, Restaurant.length, total, searchQuery, dispatch]);

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
        {Restaurant.map((product: RestaurantPayload) => (
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
                ₹{product.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => router.push(`/restaurantDetails/${product.id}`)}
              >
                Details
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

        {!showLoader && Restaurant.length === 0 && (
          <Typography variant="h6" color="text.secondary">
            Loading your products
          </Typography>
        )}

        {!showLoader && Restaurant.length >= total && Restaurant.length > 0 && (
          <Typography color="text.secondary" variant="body1" sx={{ mt: 2 }}>
            ✨ You have seen everything!
          </Typography>
        )}
      </Box>
    </>
  );
}
