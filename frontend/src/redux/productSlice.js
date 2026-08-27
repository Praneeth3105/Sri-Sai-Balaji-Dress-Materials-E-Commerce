import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  cart: {
    items: [],
    totalPrice: 0,
  },
  addresses: [],
  selectedAddress: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    setCart: (state, action) => {
      state.cart = action.payload;
    },

    addAddress: (state, action) => {
      if (!state.addresses) {
        state.addresses = [];
      }

      state.addresses.push(action.payload);
    },

    setselectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index !== action.payload,
      );

      if (state.selectedAddress === action.payload) {
        state.selectedAddress = null;
      }
    },

    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddress = null;
    },

    clearProductState: (state) => {
      state.products = [];

      state.cart = {
        items: [],
        totalPrice: 0,
      };

      state.addresses = [];

      state.selectedAddress = null;
    },
  },
});
export const {
  setProducts,
  setCart,
  addAddress,
  setselectedAddress,
  deleteAddress,
  clearAddresses,
  clearProductState,
} = productSlice.actions;

export default productSlice.reducer;
