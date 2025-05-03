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

  semantic: string

  isLoading: {
    fetchProductPage: boolean
    createProduct: boolean
    updateProduct: boolean
    deleteProduct: boolean
    increaseStock: boolean
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

  semantic: "",
  
  isLoading: {
    fetchProductPage: false,
    createProduct: false,
    updateProduct: false,
    deleteProduct: false,
    increaseStock: false
  }
};

interface FetchProductPageModel {
  semantic?: string
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
  supportingImageIds: Set<string>
  isFeatured: boolean
}

interface UpdateProductModel {
  sku: string
  name: string
  description: string
  price: number
  categoryId: number
  primaryImageId: string
  supportingImageIds: Set<string>
  isFeatured: boolean
}

interface DeleteProductModel {
  sku: string
}

interface IncreaseStockModel {
  sku: string
  quantity: number
}

export const fetchProductPage = createAsyncThunk<Pagination<ProductDto>, FetchProductPageModel, { extra: ExtraArguments, state: RootState }>("products/fetchProductPage", async (model, thunkApi) => {
  const productService = thunkApi.extra.productService;

  try {
    if (model.semantic) {
      return productService.getSemanticallyOrderedProducts(model.semantic, model.pageNumber, model.pageSize);
    }

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
    await productService.createProduct(model.sku, model.name, model.description, model.price, model.categoryId, model.primaryImageId, model.supportingImageIds, model.isFeatured);

    await dispatch(fetchProductPage({
      semantic: state.semantic,
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
    await productService.updateProduct(model.sku, model.name, model.description, model.price, model.categoryId, model.primaryImageId, model.supportingImageIds, model.isFeatured);

    await dispatch(fetchProductPage({
      semantic: state.semantic,
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
      semantic: state.semantic,
      pageNumber: 1,
      pageSize: state.pageSize
    }));
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails); 
  }
});

export const increaseStock = createAsyncThunk<IncreaseStockModel, IncreaseStockModel, { extra: ExtraArguments, state: RootState }>("products/increaseStock", async (model, thunkApi) => {
  const stockService = thunkApi.extra.stockService;

  try {
    await stockService.increaseStock(model.sku, model.quantity);

    return model;
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    setSemantic: (state, action: PayloadAction<string>) => {
      state.semantic = action.payload;
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
    
    builder
      .addCase(increaseStock.pending, (state) => {
        state.isLoading.increaseStock = true;
      })
      .addCase(increaseStock.fulfilled, (state, action) => {
        for (const product of state.products) {
          if (product.sku != action.payload.sku) {
            continue;
          }

          product.availableQuantity += action.payload.quantity;

          break;
        }

        state.isLoading.increaseStock = false;

        state.success = {
          title: "Success",
          detail: "Stock was successfully increased"
        };
      })
      .addCase(increaseStock.rejected, (state, action) => {
        state.isLoading.increaseStock = false;

        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
  }
});


export const {
  setSemantic,
  clearSuccess,
  clearError
} = productsSlice.actions;

const productsReducer = productsSlice.reducer;

export default productsReducer;