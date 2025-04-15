import CategoryDto from "@/app/models/category-dto";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtraArguments, RootState } from "../store";

export interface Status {
  isLoading: boolean,
  error?: string
}

export interface CategoriesState {
  categories: CategoryDto[]
  status: Status
  selectedCategory?: CategoryDto
}

const initialState: CategoriesState = {
  categories: [],
  status: {
    isLoading: false
  }
};

export const fetchCategories = createAsyncThunk<CategoryDto[], void, { extra: ExtraArguments, state: RootState }>("categories/fetchCategories", async (_, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  return await categoryService.getCategories();
});

export interface CreateCategoryModel {
  name: string
  description: string
}

export const createCategory = createAsyncThunk<CategoryDto, CreateCategoryModel, { extra: ExtraArguments, state: RootState }>("categories/createCategory", async (model, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  const { id } = await categoryService.createCategory(model.name, model.description);

  return {
    id: id,
    name: model.name,
    description: model.description
  };
});

export interface UpdateCategoryModel {
  id: number
  name: string
  description: string
}

export const updateCategory = createAsyncThunk<CategoryDto, UpdateCategoryModel, { extra: ExtraArguments, state: RootState }>("categories/updateCategory", async (model, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  await categoryService.updateCategory(model.id, model.name, model.description);

  return {
    id: model.id,
    name: model.name,
    description: model.description
  };
});

export interface DeleteCategoryModel {
  id: number
}

export const deleteCategory = createAsyncThunk<number, DeleteCategoryModel, { extra: ExtraArguments, state: RootState }>("categories/deleteCategory", async (model, thunkApi) => {
  const categoryService = thunkApi.extra.categoryService;

  await categoryService.deleteCategory(model.id);

  return model.id;
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
        state.status.isLoading = true;
        state.status.error = undefined;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.status.isLoading = false;
        state.status.error = undefined;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status.isLoading = false;
        state.status.error = action.error.message;
      });
    
    builder
      .addCase(createCategory.pending, (state) => {
        state.status.isLoading = true;
        state.status.error = undefined;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
        state.status.isLoading = false;
        state.status.error = undefined;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status.isLoading = false;
        state.status.error = action.error.message;
      });
      
    builder
      .addCase(updateCategory.pending, (state) => {
        state.status.isLoading = true;
        state.status.error = undefined;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id == action.payload.id);

        if (index >= 0) {
          const category = state.categories[index];

          category.name = action.payload.name;
          category.description = action.payload.description; 
        }

        state.status.isLoading = false;
        state.status.error = undefined;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status.isLoading = false;
        state.status.error = action.error.message;
      });
    
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.status.isLoading = true;
        state.status.error = undefined;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((category) => category.id == action.payload);

        if (index >= 0) {
          state.categories.splice(index, 1);
        }

        state.status.isLoading = false;
        state.status.error = undefined;        
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status.isLoading = false;
        state.status.error = action.error.message;
      });
  }
});

export const { selectCategory, unselectCategory } = categoriesSlice.actions;

const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;