import CategoryDto from "@/app/models/category-dto";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtraArguments, RootState } from "../store";
import { ProblemDetails, ProblemDetailsError } from "@/app/services/api-client";

interface CategoriesState {
  categories: CategoryDto[]
  selectedCategory?: CategoryDto

  isLoading: {
    fetchCategories: boolean
    createCategory: boolean
    updateCategory: boolean
    deleteCategory: boolean
  }
  error?: {
    title: string
    detail: string
  }
}

const initialState: CategoriesState = {
  categories: [],
  
  isLoading: {
    fetchCategories: false,
    createCategory: false,
    updateCategory: false,
    deleteCategory: false
  }
};


interface CreateCategoryModel {
  name: string
  description: string
}

interface UpdateCategoryModel {
  id: number
  name: string
  description: string
}

interface DeleteCategoryModel {
  id: number
}

export const fetchCategories = createAsyncThunk<CategoryDto[], void, { extra: ExtraArguments, state: RootState }>("categories/fetchCategories", async (_, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  try {
    return await categoryService.getCategories();
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});


export const createCategory = createAsyncThunk<CategoryDto, CreateCategoryModel, { extra: ExtraArguments, state: RootState }>("categories/createCategory", async (model, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  try {
    const id = await categoryService.createCategory(model.name, model.description);

    return {
      id: id,
      name: model.name,
      description: model.description
    };
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export const updateCategory = createAsyncThunk<CategoryDto, UpdateCategoryModel, { extra: ExtraArguments, state: RootState }>("categories/updateCategory", async (model, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  try {
    await categoryService.updateCategory(model.id, model.name, model.description);

    return {
      id: model.id,
      name: model.name,
      description: model.description
    };
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export const deleteCategory = createAsyncThunk<number, DeleteCategoryModel, { extra: ExtraArguments, state: RootState }>("categories/deleteCategory", async (model, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  try {
    await categoryService.deleteCategory(model.id);

    return model.id;
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialState,
  reducers: {
    selectCategory: (state, action: PayloadAction<CategoryDto>) => {
      state.selectedCategory = action.payload;
    },

    unselectCategory: (state) => {
      state.selectedCategory = undefined;
    },

    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading.fetchCategories = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        
        state.isLoading.fetchCategories = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading.fetchCategories = false;
        
        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
    
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading.createCategory = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
        
        state.isLoading.createCategory = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading.createCategory = false;
        
        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
      
    builder
      .addCase(updateCategory.pending, (state) => {
        state.isLoading.updateCategory = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id == action.payload.id);

        if (index >= 0) {
          const category = state.categories[index];

          category.name = action.payload.name;
          category.description = action.payload.description; 
        }

        state.isLoading.updateCategory = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading.updateCategory = false;
        
        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
    
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading.deleteCategory = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id == action.payload);

        if (index >= 0) {
          state.categories.splice(index, 1);
        }

        state.isLoading.deleteCategory = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading.deleteCategory = false;
        
        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
  }
});

export const { selectCategory, unselectCategory, clearError } = categoriesSlice.actions;

const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;