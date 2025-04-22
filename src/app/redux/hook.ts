import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"
import { useCallback } from "react";
import { fetchProductPage } from "./products/products-slice";
import { fetchImagePage } from "./image-gallery/image-gallery-slice";
import { fetchCustomerPage } from "./customers/customers-slice";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export function useFetchProductPageByPageNumber(): (pageNumber: number) => Promise<void> {
  const dispatch = useAppDispatch();
  const { pageSize } = useAppSelector(state => state.products);

  return useCallback(async (pageNumber: number) => {
    await dispatch(fetchProductPage({ pageNumber, pageSize }));
  }, [pageSize]);
}

export function useFetchCustomerPageByPageNumber(): (pageNumber: number) => Promise<void> {
  const dispatch = useAppDispatch();
  const { pageSize } = useAppSelector(state => state.customers);

  return useCallback(async (pageNumber: number) => {
    await dispatch(fetchCustomerPage({ pageNumber, pageSize }));
  }, [pageSize]);
}

export function useFetchImagePageByPageNumber(): (pageNumber: number) => Promise<void> {
  const dispatch = useAppDispatch();
  const { pageSize } = useAppSelector(state => state.imageGallery);

  return useCallback(async (pageNumber: number) => {
    await dispatch(fetchImagePage({ pageNumber, pageSize }));
  }, [pageSize]);
}