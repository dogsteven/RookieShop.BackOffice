import CustomerDto from "@/app/models/customer-dto"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ExtraArguments, RootState } from "../store"

export interface Status {
  isLoading: boolean,
  error?: string
}

export interface CustomersState {
  customers: CustomerDto[]
  currentPageNumber: number
  pageSize: number
  status: {
    fetchCustomerPage: Status
  }
}

const initialState: CustomersState = {
  customers: [],
  currentPageNumber: 1,
  pageSize: 10,
  status: {
    fetchCustomerPage: {
      isLoading: false
    }
  }
};

export interface FetchCustomerPageModel {
  pageNumber: number
  pageSize: number
}

export const fetchCustomerPage = createAsyncThunk<CustomerDto[], FetchCustomerPageModel, { extra: ExtraArguments, state: RootState }>("customers/fetchCustomerPage", async (model, thunkApi) => {
  const customerService = thunkApi.extra.customerService;

  return await customerService.getCustomers(model.pageNumber, model.pageSize);
});

const customersSlice = createSlice({
  name: "customers",
  initialState: initialState,
  reducers: {
    setCurrentPageNumber: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerPage.pending, (state) => {
        state.status.fetchCustomerPage.isLoading = true;
        state.status.fetchCustomerPage.error = undefined;
      })
      .addCase(fetchCustomerPage.fulfilled, (state, action) => {
        state.customers = action.payload;

        state.status.fetchCustomerPage.isLoading = false;
        state.status.fetchCustomerPage.error = undefined;
      })
      .addCase(fetchCustomerPage.rejected, (state, action) => {
        state.status.fetchCustomerPage.isLoading = false;
        state.status.fetchCustomerPage.error = action.error.message;
      });
  }
});

export const { setCurrentPageNumber } = customersSlice.actions;

const customersReducer = customersSlice.reducer;

export default customersReducer;