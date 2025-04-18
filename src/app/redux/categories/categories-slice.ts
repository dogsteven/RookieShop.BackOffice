import CategoryDto from "@/app/models/category-dto";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtraArguments, RootState } from "../store";
import { ProblemDetailsError } from "@/app/services/api-client";

export interface Status {
  isLoading: boolean
}

export interface CategoriesState {
  categories: CategoryDto[]
  status: {
    fetchCategories: Status,
    createCategory: Status,
    updateCategory: Status,
    deleteCategory: Status
  }
  selectedCategory?: CategoryDto
}

const initialState: CategoriesState = {
  categories: [],
  status: {
    fetchCategories: {
      isLoading: false
    },
    createCategory: {
      isLoading: false
    },
    updateCategory: {
      isLoading: false
    },
    deleteCategory: {
      isLoading: false
    }
  }
};

export const fetchCategories = createAsyncThunk<CategoryDto[], void, { extra: ExtraArguments, state: RootState }>("categories/fetchCategories", async (_, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  try {
    return await categoryService.getCategories();
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export interface CreateCategoryModel {
  name: string
  description: string
}

export const createCategory = createAsyncThunk<CategoryDto, CreateCategoryModel, { extra: ExtraArguments, state: RootState }>("categories/createCategory", async (model, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  try {
    const { id } = await categoryService.createCategory(model.name, model.description);

    return {
      id: id,
      name: model.name,
      description: model.description
    };
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export interface UpdateCategoryModel {
  id: number
  name: string
  description: string
}

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

export interface DeleteCategoryModel {
  id: number
}

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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status.fetchCategories.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.status.fetchCategories.isLoading = false;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status.fetchCategories.isLoading = false;
      });
    
    builder
      .addCase(createCategory.pending, (state) => {
        state.status.createCategory.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
        state.status.createCategory.isLoading = false;
      })
      .addCase(createCategory.rejected, (state) => {
        state.status.createCategory.isLoading = false;
      });
      
    builder
      .addCase(updateCategory.pending, (state) => {
        state.status.updateCategory.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id == action.payload.id);

        if (index >= 0) {
          const category = state.categories[index];

          category.name = action.payload.name;
          category.description = action.payload.description; 
        }

        state.status.updateCategory.isLoading = false;
      })
      .addCase(updateCategory.rejected, (state) => {
        state.status.updateCategory.isLoading = false;
      });
    
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.status.deleteCategory.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id == action.payload);

        if (index >= 0) {
          state.categories.splice(index, 1);
        }

        state.status.deleteCategory.isLoading = false;      
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.status.deleteCategory.isLoading = false;
      });
  }
});

export const { selectCategory, unselectCategory } = categoriesSlice.actions;

const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;