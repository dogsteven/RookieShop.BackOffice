import CustomerDto from "@/app/models/customer-dto"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ExtraArguments, RootState } from "../store"
import { ProblemDetails, ProblemDetailsError } from "@/app/services/api-client"

interface CustomersState {
  customers: CustomerDto[]
  currentPageNumber: number
  pageSize: number
  
  isLoading: {
    fetchCustomerPage: boolean
  }

  error?: {
    title: string
    detail: string
  }
}

const initialState: CustomersState = {
  customers: [],
  currentPageNumber: 1,
  pageSize: 10,
  
  isLoading: {
    fetchCustomerPage: false
  }
};

interface FetchCustomerPageModel {
  pageNumber: number
  pageSize: number
}

export const fetchCustomerPage = createAsyncThunk<CustomerDto[], FetchCustomerPageModel, { extra: ExtraArguments, state: RootState }>("customers/fetchCustomerPage", async (model, thunkApi) => {
  const customerService = thunkApi.extra.customerService;

  try {
    return await customerService.getCustomers(model.pageNumber, model.pageSize);
  } catch (error) {
    return thunkApi.rejectWithValue((error as ProblemDetailsError).problemDetails);
  }
});

const customersSlice = createSlice({
  name: "customers",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerPage.pending, (state) => {
        state.isLoading.fetchCustomerPage = true;
      })
      .addCase(fetchCustomerPage.fulfilled, (state, action) => {
        state.customers = action.payload;

        state.isLoading.fetchCustomerPage = false;
      })
      .addCase(fetchCustomerPage.rejected, (state, action) => {
        state.isLoading.fetchCustomerPage = false;
        
        const payload = action.payload as ProblemDetails;

        state.error = {
          title: payload.title,
          detail: payload.detail
        };
      });
  }
});

export const { clearError } = customersSlice.actions;

const customersReducer = customersSlice.reducer;

export default customersReducer;