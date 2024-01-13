import { createSlice } from "@reduxjs/toolkit";
import * as action from './asyncAction'

export const appSlice = createSlice ({
    name: 'app',
    initialState:{
        categories: null,
        isLoading: false,
        isShowModal: false,
        modalChildren: null,
        isShowCart: false
    },
    reducers:{
     showModal: (state, action) =>{
        state.isShowModal = action.payload.isShowModal
        state.modalChildren = action.payload.modalChildren
     },
     showCart:(state) =>{
        state.isShowCart = state.isShowCart === false ? true : false
     }
    },
    
      extraReducers: (builder) => {
        builder.addCase(action.getCategories.pending, (state) => {
          state.isLoading = true;
        });
    
        // Khi thực hiện action login thành công (Promise fulfilled)
        builder.addCase(action.getCategories.fulfilled, (state, action) => {
          state.isLoading = false;
          state.categories = action.payload.getCategories;
        });
    
        builder.addCase(action.getCategories   .rejected, (state, action) => {
          state.isLoading = false;
          state.errorMessage = action.payload.message;
        });
      },
    });
    export const{showModal, showCart} = appSlice.actions
    export default appSlice.reducer