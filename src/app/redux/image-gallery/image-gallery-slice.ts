import ImageDto from "@/app/models/image-dto"
import Pagination from "@/app/models/pagination"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ExtraArguments, RootState } from "../store"
import { ProblemDetails, ProblemDetailsError } from "@/app/services/api-client"

interface ImageGalleryState {
  images: ImageDto[]
  imageCount: number
  currentPageNumber: number
  pageSize: number

  isLoading: {
    fetchImagePage: boolean
    uploadImage: boolean
    deleteImage: boolean
  }

  success?: {
    title: string
    detail: string
  }

  error?: {
    title: string
    detail: string
  }
}

const initialState: ImageGalleryState = {
  images: [],
  imageCount: 0,
  currentPageNumber: 1,
  pageSize: 12,

  isLoading: {
    fetchImagePage: false,
    uploadImage: false,
    deleteImage: false
  }
};

interface FetchImagePageModel {
  pageNumber: number
  pageSize: number
}

interface UploadImageModel {
  file: Blob
}

interface DeleteImageModel {
  id: string
}

export const fetchImagePage = createAsyncThunk<Pagination<ImageDto>, FetchImagePageModel, { extra: ExtraArguments, state: RootState }>("image-gallery/fetchImagePage", async (model, thunkApi) => {
  try {
    const imageGalleryService = thunkApi.extra.imageGalleryService;

    return imageGalleryService.getImages(model.pageNumber, model.pageSize);
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export const uploadImage = createAsyncThunk<void, UploadImageModel, { extra: ExtraArguments, state: RootState }>("image-gallery/uploadImage", async (model, thunkApi) => {
  try {
    const imageGalleryService = thunkApi.extra.imageGalleryService;
    const dispatch = thunkApi.dispatch;
    const state = thunkApi.getState().imageGallery;

    await imageGalleryService.uploadImage(model.file);

    await dispatch(fetchImagePage({
      pageNumber: 1,
      pageSize: state.pageSize
    }));
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

export const deleteImage = createAsyncThunk<void, DeleteImageModel, { extra: ExtraArguments, state: RootState }>("image-gallery/deleteImage", async (model, thunkApi) => {
  try {
    const imageGalleryService = thunkApi.extra.imageGalleryService;
    const dispatch = thunkApi.dispatch;
    const state = thunkApi.getState().imageGallery;

    await imageGalleryService.deleteImage(model.id)

    await dispatch(fetchImagePage({
      pageNumber: 1,
      pageSize: state.pageSize
    }));
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

const imageGallerySlice = createSlice({
  name: "image-gallery",
  initialState: initialState,
  reducers: {
    clearSuccess: (state) => {
      state.success = undefined;
    },

    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImagePage.pending, (state) => {
        state.isLoading.fetchImagePage = true;
      })
      .addCase(fetchImagePage.fulfilled, (state, action) => {
        state.images = action.payload.items;
        state.imageCount = action.payload.count;
        state.currentPageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;

        state.isLoading.fetchImagePage = false;
      })
      .addCase(fetchImagePage.rejected, (state, action) => {
        state.isLoading.fetchImagePage = false;
        
        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });

    builder
      .addCase(uploadImage.pending, (state) => {
        state.isLoading.uploadImage = true;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.isLoading.uploadImage = false;

        state.success = {
          title: "Success",
          detail: "Image was successfully uploaded"
        };
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isLoading.uploadImage = false;

        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
    
    builder
      .addCase(deleteImage.pending, (state) => {
        state.isLoading.deleteImage = true;
      })
      .addCase(deleteImage.fulfilled, (state) => {
        state.isLoading.deleteImage = false;

        state.success = {
          title: "Success",
          detail: "Image was successfully deleted"
        };
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading.deleteImage = false;

        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
  }
});

export const {
  clearSuccess,
  clearError
} = imageGallerySlice.actions;

const imageGalleryReducer = imageGallerySlice.reducer;

export default imageGalleryReducer;