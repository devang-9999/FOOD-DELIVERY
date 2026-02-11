"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

interface PlaceOrderPayload {
  userId: number;
  address: string;
  phoneNumber: string;
  paymentMethod: "COD" | "ONLINE";
}

interface OrderItem {
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  address: string;
  phoneNumber: string;
  paymentStatus: string;
  deliveryStatus: string;
  items: OrderItem[];
  createdAt: string;
}

interface OrderState {
  loading: boolean;
  orders: Order[];
}


const initialState: OrderState = {
  loading: false,
  orders: [],
};


export const placeOrderThunk = createAsyncThunk(
  "order/place",
  async (data: PlaceOrderPayload) => {
    console.log(data)
    const res = await axios.post(
      `${API_URL}/orders/${data.userId}`,
      {
        address: data.address,
        phoneNumber: data.phoneNumber,
        paymentMethod: data.paymentMethod,
      }
    );

    return res.data;
  }
);

export const getMyOrdersThunk = createAsyncThunk<Order[], number>(
  "order/getMyOrders",
  async (userId: number) => {
    const res = await axios.get(
      `${API_URL}/orders/my-orders/${userId}`
    );

    return res.data;
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrderThunk.rejected, (state) => {
        state.loading = false;
      })

      .addCase(getMyOrdersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        console.log(state.orders)
      })
      .addCase(getMyOrdersThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;