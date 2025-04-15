import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./products/products-slice";
import ProductService, { ProductApiService } from "../services/product-service";
import { rookieShopApiClient } from "../services/api-client";
import CategoryService, { CategoryApiService } from "../services/category-service";
import categoriesReducer from "./categories/categories-slice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        productService: new ProductApiService(rookieShopApiClient),
        categoryService: new CategoryApiService(rookieShopApiClient)
      }
    }
  })
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type ExtraArguments = {
  productService: ProductService,
  categoryService: CategoryService
}