import { configureStore } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import userSlice from './user/userSlice';
import productSlice from './product/productSlice';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore, persistReducer } from 'redux-persist';


const commonConfig ={
  key:'shop/user',
  storage
}
const userConfig = {
  ...commonConfig,
  whitelist:['isLoggedIn','token', 'current','currentCart']
}

 export const store = configureStore({
  reducer: {
    app : appSlice,
    products: productSlice,
    user: persistReducer(userConfig,userSlice)
  },
  middleware:(getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }),
});
export const persistor = persistStore(store)