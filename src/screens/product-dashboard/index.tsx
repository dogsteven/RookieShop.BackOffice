import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { useEffect, useMemo } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { range } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import CreateProductForm from "./create-product-form";
import { deleteProduct, fetchProductPage, selectProduct, setCurrentPageNumber } from "@/app/redux/products/products-slice";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchCategories } from "@/app/redux/categories/categories-slice";
import { Button } from "@/components/ui/button";
import UpdateProductForm from "./update-product-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function ProductDashboard() {
  const { productCount, currentPageNumber, pageSize, products } = useAppSelector(state => state.products);
  const { categories } = useAppSelector(state => state.categories);
  const dispatch = useAppDispatch();

  const numberOfPages = useMemo(() => {
    if (productCount == 0) {
      return 1;
    }

    return Math.ceil(productCount / pageSize);
  }, [productCount, pageSize]);

  useEffect(() => {
    dispatch(fetchProductPage({
      pageNumber: currentPageNumber,
      pageSize: pageSize
    }));
  }, [currentPageNumber, pageSize]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);
  
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-4 h-4" />
        <span className="mr-auto">Products</span>

        <CreateProductForm />
      </header>

      <UpdateProductForm />

      <div className="flex flex-col w-full">
        <div className="m-4 w-full">
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
                  const categoryName = categories.find((category) => category.id == product.categoryId)?.name ?? "Empty";

                  return (
                    <TableRow key={product.sku}>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <img src={product.imageUrl} className="w-12 rounded-sm aspect-square object-cover" />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="max-w-100 text-ellipsis overflow-hidden">{product.description}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{categoryName}</TableCell>                    
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

        <div className="flex flex-row content-center mt-4">
          <Pagination>
            <PaginationContent>
              {currentPageNumber > 1
              &&
              <PaginationItem key={"previous"}>
                <PaginationPrevious onClick={() => dispatch(setCurrentPageNumber(currentPageNumber - 1))} />
              </PaginationItem>}

              {numberOfPages <= 6
              &&
              range(1, numberOfPages).map((index) => {
                return (
                  <PaginationItem key={index}>
                    <PaginationLink isActive={currentPageNumber == index} onClick={() => dispatch(setCurrentPageNumber(index))}>
                      {index}
                    </PaginationLink>
                  </PaginationItem>
                );
              })
              }

              {numberOfPages > 6
              &&
              <>
                <PaginationItem key={1}>
                  <PaginationLink isActive={currentPageNumber == 1} onClick={() => dispatch(setCurrentPageNumber(1))}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {(currentPageNumber - 1 > 2) && <PaginationEllipsis />}

                {
                  range(Math.max(2, currentPageNumber - 1), Math.min(numberOfPages - 1, currentPageNumber + 1)).map((index) => {
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink isActive={currentPageNumber == index} onClick={() => dispatch(setCurrentPageNumber(index))}>
                          {index}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })
                }

                {(currentPageNumber + 1 < numberOfPages - 1) && <PaginationEllipsis />}

                <PaginationItem key={numberOfPages}>
                  <PaginationLink isActive={currentPageNumber == numberOfPages} onClick={() => dispatch(setCurrentPageNumber(numberOfPages))}>
                    {numberOfPages}
                  </PaginationLink>
                </PaginationItem>
              </>
              }

              {currentPageNumber < numberOfPages
              &&
              <PaginationItem key={"next"}>
                <PaginationNext onClick={() => dispatch(setCurrentPageNumber(currentPageNumber + 1))} />
              </PaginationItem>}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  )
}

export default ProductDashboard;