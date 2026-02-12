/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RestaurantPayload {
  name: string;
  description: string;
  location: string;
  images: string[];
}

export interface Restaurant extends RestaurantPayload {
  id: number;
}

interface RestaurantState {
  data: Restaurant[];
  restaurantDetail: Restaurant | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  myRestaurants: Restaurant[];
}

const initialState: RestaurantState = {
  data: [],
  restaurantDetail: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  myRestaurants: [],
};

export const addRestaurantThunk = createAsyncThunk(
  "restaurant/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/restaurants`, formData);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add restaurant",
        );
      }
      return rejectWithValue("Unexpected error");
    }
  },
);
export const fetchRestaurantsThunk = createAsyncThunk(
  "restaurant/fetch",
  async (
    {
      limit = 12,
      searchTerm,
    }: {
      limit?: number;
      searchTerm?: string;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as { products: RestaurantState };
      const page = state.products.page;

      let url = `${API_URL}/restaurants/all`;
      const params: any = { page, limit };

      if (searchTerm && searchTerm.trim()) {
        url = `${API_URL}/restaurants/search`;
        params.searchTerm = searchTerm.trim();
      }

      const res = await axios.get(url, { params });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch restaurants",
        );
      }
      return rejectWithValue("Unexpected error");
    }
  },
);

export const fetchRestaurantsByIdThunk = createAsyncThunk(
  "restaurants/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch restaurant",
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  },
);

export const updateRestaurantDetailsThunk = createAsyncThunk(
  "restaurants",
  async (
    {
      id,
      sellerId,
      data,
    }: {
      id: number;
      sellerId: number;
      data: Partial<RestaurantPayload>;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.patch(`${API_URL}/restaurant/${id}`, {
        ...data,
        sellerId,
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update restaurant",
        );
      }
      return rejectWithValue("Unexpected error");
    }
  },
);

const restaurantSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetRestaurants: (state) => {
      state.data = [];
      state.total = 0;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchRestaurantsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...state.data, ...action.payload.data];
        state.total = action.payload.total;
        state.page += 1;
      })
      .addCase(fetchRestaurantsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchRestaurantsByIdThunk.pending, (state) => {
        state.loading = true;
        state.restaurantDetail = null;
        state.error = null;
      })
      .addCase(fetchRestaurantsByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantDetail = action.payload;
      })
      .addCase(fetchRestaurantsByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateRestaurantDetailsThunk.fulfilled, (state, action) => {
        const index = state.myRestaurants.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.myRestaurants[index] = action.payload;
        }
      });
  },
});

export const { resetRestaurants } = restaurantSlice.actions;
export default restaurantSlice.reducer;
