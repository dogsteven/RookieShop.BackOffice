import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { useEffect, useMemo } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { calculateNumberOfPages } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import CreateProductForm from "./create-product-form";
import { clearError, clearSuccess, deleteProduct, fetchProductPage, selectProduct, setCurrentPageNumber } from "@/app/redux/products/products-slice";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UpdateProductForm from "./update-product-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import RookieShopPagination from "@/components/rookie-shop-pagination";
import { useNavigate } from "react-router";

function ProductDashboard() {
  const { productCount, currentPageNumber, pageSize, products, success, error } = useAppSelector(state => state.products);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const numberOfPages = useMemo(() => {
    return calculateNumberOfPages(pageSize, productCount);
  }, [productCount, pageSize]);

  useEffect(() => {
    dispatch(fetchProductPage({
      pageNumber: currentPageNumber,
      pageSize: pageSize
    }));
  }, [currentPageNumber, pageSize]);

  useEffect(() => {
    if (success) {
      toast.success(success.title, {
        description: success.detail
      });

      dispatch(clearSuccess());
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error.title, {
        description: error.detail
      });

      dispatch(clearError());
    }
  }, [error]);
  
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-4 h-4" />
        <span className="mr-auto">Products</span>

        {/* <Button
          type="button"
          onClick={() => {
            navigate("/products/create");
          }}
        >
          Create Product
        </Button> */}
        <CreateProductForm />
      </header>

      <UpdateProductForm />

      <div className="flex flex-col w-full">
        <div className="p-4 w-full">
          <ScrollArea>
            <Table className="w-full">
              <TableCaption>All products of RookieShop</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map(product => {
                  const primaryImageUrl = `http://localhost:5027/api/ImageGallery/${product.primaryImageId}`;

                  return (
                    <TableRow key={product.sku}>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <img src={primaryImageUrl} className="w-12 rounded-sm aspect-square object-cover" />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="max-w-100 text-ellipsis overflow-hidden">{product.description}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.categoryName}</TableCell>                    
                      <TableCell>{product.isFeatured ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <Button onClick={() => dispatch(selectProduct(product))}>Edit</Button>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to delete product "{product.sku}"?</AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => dispatch(deleteProduct({ sku: product.sku }))}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        
        <RookieShopPagination
          currentPageNumber={currentPageNumber}
          numberOfPages={numberOfPages}
          setCurrentPageNumber={(number) => dispatch(setCurrentPageNumber(number))}
        />
      </div>
    </>
  )
}

export default ProductDashboard;