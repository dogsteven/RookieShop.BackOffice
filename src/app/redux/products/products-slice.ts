import Pagination from "@/app/models/pagination";
import ProductDto from "@/app/models/product-dto";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtraArguments, RootState } from "../store";
import { ProblemDetails, ProblemDetailsError } from "@/app/services/api-client";

interface ProductsState {
  products: ProductDto[]
  productCount: number
  currentPageNumber: number
  pageSize: number
  selectedProduct?: ProductDto

  isLoading: {
    fetchProductPage: boolean
    createProduct: boolean
    updateProduct: boolean
    deleteProduct: boolean
  }

  success?: {
    title: string,
    detail: string
  }

  error?: {
    title: string
    detail: string
  }
}

const initialState: ProductsState = {
  products: [],
  productCount: 0,
  currentPageNumber: 1,
  pageSize: 12,
  
  isLoading: {
    fetchProductPage: false,
    createProduct: false,
    updateProduct: false,
    deleteProduct: false
  }
};

interface FetchProductPageModel {
  pageNumber: number
  pageSize: number
}

interface CreateProductModel {
  sku: string
  name: string
  description: string
  price: number
  categoryId: number
  primaryImageId: string
  isFeatured: boolean
}

interface UpdateProductModel {
  sku: string
  name: string
  description: string
  price: number
  categoryId: number
  primaryImageId: string
  isFeatured: boolean
}

interface DeleteProductModel {
  sku: string
}

export const fetchProductPage = createAsyncThunk<Pagination<ProductDto>, FetchProductPageModel, { extra: ExtraArguments, state: RootState }>("products/fetchProductPage", async (model, thunkApi) => {
  const productService = thunkApi.extra.productService;

  try {
    return await productService.getProducts(model.pageNumber, model.pageSize);
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export const createProduct = createAsyncThunk<void, CreateProductModel, { extra: ExtraArguments, state: RootState }>("products/createProduct", async (model, thunkApi) => {
  const productService = thunkApi.extra.productService;
  const dispatch = thunkApi.dispatch;
  const state = thunkApi.getState().products;

  try {
    await productService.createProduct(model.sku, model.name, model.description, model.price, model.categoryId, model.primaryImageId, model.isFeatured);

    await dispatch(fetchProductPage({
      pageNumber: 1,
      pageSize: state.pageSize
    }));
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export const updateProduct = createAsyncThunk<void, UpdateProductModel, { extra: ExtraArguments, state: RootState }>("products/updateProduct", async (model, thunkApi) => {
  const productService = thunkApi.extra.productService;
  const dispatch = thunkApi.dispatch;
  const state = thunkApi.getState().products;

  try {
    await productService.updateProduct(model.sku, model.name, model.description, model.price, model.categoryId, model.primaryImageId, model.isFeatured);

    await dispatch(fetchProductPage({
      pageNumber: 1,
      pageSize: state.pageSize
    }));
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails); 
  }
});

export const deleteProduct = createAsyncThunk<void, DeleteProductModel, { extra: ExtraArguments, state: RootState }>("products/deleteProduct", async (model, thunkApi) => {
  const productService = thunkApi.extra.productService;
  const dispatch = thunkApi.dispatch;
  const state = thunkApi.getState().products;

  try {
    await productService.deleteProduct(model.sku);

    await dispatch(fetchProductPage({
      pageNumber: 1,
      pageSize: state.pageSize
    }));
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails); 
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    selectProduct: (state, action: PayloadAction<ProductDto>) => {
      state.selectedProduct = action.payload;
    },

    unselectProduct: (state) => {
      state.selectedProduct = undefined;
    },

    clearSuccess: (state) => {
      state.success = undefined;
    },

    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductPage.pending, (state) => {
        state.isLoading.fetchProductPage = true;
      })
      .addCase(fetchProductPage.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.productCount = action.payload.count;
        state.currentPageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;

        state.isLoading.fetchProductPage = false;
      })
      .addCase(fetchProductPage.rejected, (state, action) => {
        state.isLoading.fetchProductPage = false;

        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
    
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading.createProduct = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.isLoading.createProduct = false;

        state.success = {
          title: "Success",
          detail: "Product was successfully added"
        };
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading.createProduct = false;

        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading.updateProduct = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.isLoading.updateProduct = false;

        state.success = {
          title: "Success",
          detail: "Product was successfully updated"
        };
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading.updateProduct = false;
        
        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
    
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading.deleteProduct = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.isLoading.deleteProduct = false;

        state.success = {
          title: "Success",
          detail: "Product was successfully deleted"
        };
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading.deleteProduct = false;

        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
  }
});


export const {
  selectProduct,
  unselectProduct,
  clearSuccess,
  clearError
} = productsSlice.actions;

const productsReducer = productsSlice.reducer;

export default productsReducer;