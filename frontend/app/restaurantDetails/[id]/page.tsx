/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchRestaurantsByIdThunk } from "@/redux/restaurantSlice";

const IMAGE_BASE_URL = "http://localhost:5000/uploads/dishes";
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2FhYSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { restaurantDetail, loading } = useAppSelector((state) => state.restaurant);
//   const { user } = useAppSelector((state) => state.auth);

  const [activeImage, setActiveImage] = useState<string>(PLACEHOLDER_IMAGE);

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantsByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (restaurantDetail?.images?.length) {
      setActiveImage(`${IMAGE_BASE_URL}/${restaurantDetail.images[0]}`);
    }
  }, [restaurantDetail]);


  if (loading || !restaurantDetail) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 15 }}>
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, mt: 14 }}>
      <Card
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: 3,
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
          boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
          borderRadius: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              border: "1px solid #eee",
              borderRadius: 2,
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 380,
              mb: 2,
            }}
          >
            <img
              src={activeImage}
              alt={restaurantDetail.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {restaurantDetail.images.map((img, index) => {
              const imgUrl = `${IMAGE_BASE_URL}/${img}`;

              return (
                <Box
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  sx={{
                    width: 70,
                    height: 70,
                    border:
                      activeImage === imgUrl
                        ? "2px solid #2874f0"
                        : "1px solid #ccc",
                    borderRadius: 1,
                    cursor: "pointer",
                    p: 1,
                  }}
                >
                  <img
                    src={imgUrl}
                    alt="thumb"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {restaurantDetail.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Brand: <b>{restaurantDetail.location}</b>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1">{restaurantDetail.description}</Typography>

        </CardContent>
      </Card>
    </Box>
  );
}
