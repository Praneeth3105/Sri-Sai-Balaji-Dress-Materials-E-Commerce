import { createSlice } from "@reduxjs/toolkit";
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: [],
    address: [],
    selectedAddress: null,
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});
export const { setProducts, setCart } = productSlice.actions;

export default productSlice.reducer;
