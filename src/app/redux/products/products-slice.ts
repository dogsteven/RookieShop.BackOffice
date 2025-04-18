import Pagination from "@/app/models/pagination";
import ProductDto from "@/app/models/product-dto";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtraArguments, RootState } from "../store";
import { ProblemDetailsError } from "@/app/services/api-client";

export interface Status {
  isLoading: boolean
}

export interface ProductsState {
  products: ProductDto[],
  productCount: number,
  currentPageNumber: number,
  pageSize: number,
  status: {
    fetchProductPage: Status,
    createProduct: Status,
    updateProduct: Status,
    deleteProduct: Status
  },
  selectedProduct?: ProductDto
}

const initialState: ProductsState = {
  products: [],
  productCount: 0,
  currentPageNumber: 1,
  pageSize: 8,
  status: {
    fetchProductPage: {
      isLoading: false
    },
    createProduct: {
      isLoading: false
    },
    updateProduct: {
      isLoading: false
    },
    deleteProduct: {
      isLoading: false
    }
  }
};

export interface FetchProductPageModel {
  pageNumber: number
  pageSize: number
}

export const fetchProductPage = createAsyncThunk<Pagination<ProductDto>, FetchProductPageModel, { extra: ExtraArguments, state: RootState }>("products/fetchProductPage", async (model, thunkApi) => {
  const productService = thunkApi.extra.productService;

  try {
    return await productService.getProducts(model.pageNumber, model.pageSize);
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export interface CreateProductModel {
  sku: string
  name: string
  description: string
  price: number
  categoryId: number
  imageUrl: string
  isFeatured: boolean
}

export const createProduct = createAsyncThunk<void, CreateProductModel, { extra: ExtraArguments, state: RootState }>("products/createProduct", async (model, thunkApi) => {
  const productService = thunkApi.extra.productService;
  const dispatch = thunkApi.dispatch;
  const state = thunkApi.getState().products;

  try {
    await productService.createProduct(model.sku, model.name, model.description, model.price, model.categoryId, model.imageUrl, model.isFeatured);

    await dispatch(fetchProductPage({
      pageNumber: 1,
      pageSize: state.pageSize
    }));
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export interface UpdateProductModel {
  sku: string
  name: string
  description: string
  price: number
  categoryId: number
  imageUrl: string
  isFeatured: boolean
}

export const updateProduct = createAsyncThunk<void, UpdateProductModel, { extra: ExtraArguments, state: RootState }>("products/updateProduct", async (model, thunkApi) => {
  const productService = thunkApi.extra.productService;
  const dispatch = thunkApi.dispatch;
  const state = thunkApi.getState().products;

  try {
    await productService.updateProduct(model.sku, model.name, model.description, model.price, model.categoryId, model.imageUrl, model.isFeatured);

    await dispatch(fetchProductPage({
      pageNumber: 1,
      pageSize: state.pageSize
    }));
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails); 
  }
});

export interface DeleteProductModel {
  sku: string
}

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
    setCurrentPageNumber: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },

    selectProduct: (state, action: PayloadAction<ProductDto>) => {
      state.selectedProduct = action.payload;
    },

    unselectProduct: (state) => {
      state.selectedProduct = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductPage.pending, (state) => {
        state.status.fetchProductPage.isLoading = true;
      })
      .addCase(fetchProductPage.fulfilled, (state, action) => {
        state.products = action.payload.items;
        state.productCount = action.payload.count;
        state.currentPageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;

        state.status.fetchProductPage.isLoading = false;
      })
      .addCase(fetchProductPage.rejected, (state) => {
        state.status.fetchProductPage.isLoading = false;
      });
    
    builder
      .addCase(createProduct.pending, (state) => {
        state.status.createProduct.isLoading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.status.createProduct.isLoading = false;
      })
      .addCase(createProduct.rejected, (state) => {
        state.status.createProduct.isLoading = false;
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.status.updateProduct.isLoading = true;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.status.updateProduct.isLoading = false;
      })
      .addCase(updateProduct.rejected, (state) => {
        state.status.updateProduct.isLoading = false;
      });
    
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.status.deleteProduct.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.status.deleteProduct.isLoading = false;
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.status.deleteProduct.isLoading = false;
      });
  }
});


export const {
  setCurrentPageNumber,
  selectProduct,
  unselectProduct
} = productsSlice.actions;

const productsReducer = productsSlice.reducer;

export default productsReducer;