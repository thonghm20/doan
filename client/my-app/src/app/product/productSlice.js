import { createSlice } from "@reduxjs/toolkit";
import { getnewProducts } from "./asyncAction";

export const productSlice = createSlice ({
    name: 'product',
    initialState:{
       newProducts: null,
       errorMessage: '',
       currentCart:[]
        
    },
    reducers:{
     
    },
    
      extraReducers: (builder) => {
        builder.addCase(getnewProducts.pending, (state) => {
          state.isLoading = true;
        });
    
        builder.addCase(getnewProducts.fulfilled, (state, action) => {
          state.isLoading = false;
          state.newProducts = action.payload
        });
    
        builder.addCase(getnewProducts.rejected, (state, action) => {
          state.isLoading = false;
          state.errorMessage = action.payload.message;
        });
      },
    });
    // export const{} =productSlice.actions
    export default productSlice.reducer