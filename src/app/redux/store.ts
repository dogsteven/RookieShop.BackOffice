import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./products/products-slice";
import ProductService, { ProductApiService } from "../services/product-service";
import { rookieShopApiClient } from "../services/api-client";
import CategoryService, { CategoryApiService } from "../services/category-service";
import categoriesReducer from "./categories/categories-slice";
import CustomerService, { CustomerApiService } from "../services/customer-service";
import customersReducer from "./customers/customers-slice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    customers: customersReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        productService: new ProductApiService(rookieShopApiClient),
        categoryService: new CategoryApiService(rookieShopApiClient),
        customerService: new CustomerApiService(rookieShopApiClient)
      }
    }
  })
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type ExtraArguments = {
  productService: ProductService,
  categoryService: CategoryService,
  customerService: CustomerService
}