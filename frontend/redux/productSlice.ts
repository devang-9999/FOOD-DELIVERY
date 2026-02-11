/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export interface ProductsPayload {
  name: string;
  description: string;
  category: string;
  price: number;
  isBanned:boolean;
  stock: number;
  brand: string;
  images: string[];
}

export interface SellerProduct extends ProductsPayload {
  id: number;
}

interface ProductsState {
  data: SellerProduct[];
  productDetail: SellerProduct | null;
  loading: boolean;
  error: string | null;
  total: number;
  page:number;
  myProducts: SellerProduct[];
}


const initialState: ProductsState = {
  data: [],
  productDetail: null,
  loading: false,
  error: null,
  total: 0,
   page: 1,
  myProducts: [],
};


export const addProductThunk = createAsyncThunk(
  "products/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/products`, formData);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add product",
        );
      }
      return rejectWithValue("Unexpected error");
    }
  },
);
export const fetchProductsThunk = createAsyncThunk(
  "products/fetch",
  async (
    {
      limit = 12,
      category,
      searchTerm,
    }: {
      limit?: number;
      category?: string;
      searchTerm?: string;
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as { products: ProductsState };
      const page = state.products.page;

      let url = `${API_URL}/products/all`;
      const params: any = { page, limit };

      if (searchTerm && searchTerm.trim()) {
        url = `${API_URL}/products/search`;
        params.searchTerm = searchTerm.trim();
      } else if (category && category.trim()) {
        url = `${API_URL}/products/category/${category.trim().toUpperCase()}`;
      }

      const res = await axios.get(url, { params });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch products",
        );
      }
      return rejectWithValue("Unexpected error");
    }
  },
);


export const fetchProductByIdThunk = createAsyncThunk(
  "products/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch product",
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  },
);

export const getMyProductsThunk = createAsyncThunk(
  "products/getMyProducts",
  async ({ sellerId }: { sellerId: number }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/products/seller/${sellerId}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch seller products",
        );
      }
      return rejectWithValue("Unexpected error");
    }
  },
);

export const updateProductBySellerThunk = createAsyncThunk(
  "products/updateBySeller",
  async (
    {
      id,
      sellerId,
      data,
    }: {
      id: number;
      sellerId: number;
      data: Partial<ProductsPayload>;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.patch(`${API_URL}/products/${id}`, {
        ...data,
        sellerId,
      });
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update product",
        );
      }
      return rejectWithValue("Unexpected error");
    }
  },
);


const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {    resetProducts: (state) => {
      state.data = [];
      state.total = 0;
      state.page = 1;
    },},
  extraReducers: (builder) => {
    builder

.addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...state.data, ...action.payload.data];
        state.total = action.payload.total;
        state.page += 1;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.loading = true;
        state.productDetail = null;
        state.error = null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload;
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getMyProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.myProducts = action.payload;
      })
      .addCase(getMyProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProductBySellerThunk.fulfilled, (state, action) => {
        const index = state.myProducts.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.myProducts[index] = action.payload;
        }
      });
  },
});

export const {resetProducts} = productsSlice.actions
export default productsSlice.reducer;