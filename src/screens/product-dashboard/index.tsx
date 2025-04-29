import { useAppDispatch, useAppSelector, useFetchProductPageByPageNumber } from "@/app/redux/hook";
import { useEffect, useRef, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import CreateProductForm from "./create-product-form";
import { clearError, clearSuccess, deleteProduct, fetchProductPage, setSemantic } from "@/app/redux/products/products-slice";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import UpdateProductForm from "./update-product-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import RookieShopPagination from "@/components/rookie-shop-pagination";
import { fetchCategories } from "@/app/redux/categories/categories-slice";
import { fetchImagePage } from "@/app/redux/image-gallery/image-gallery-slice";
import ProductDto from "@/app/models/product-dto";
import { resolveImageUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

function ProductDashboard() {
  const { semantic, productCount, currentPageNumber, pageSize, products, success, error, isLoading: { fetchProductPage: isLoading } } = useAppSelector(state => state.products);

  const dispatch = useAppDispatch();
  
  const fetctProductPageByPageNumber = useFetchProductPageByPageNumber();

  useEffect(() => {
    dispatch(fetchProductPage({ pageNumber: 1, pageSize: 9 }));
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    dispatch(fetchImagePage({ pageNumber: 1, pageSize: 9 }));
  }, []);

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
  
  const [createProductFormOpen, setCreateProductFormOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductDto | undefined>(undefined);

  const [semanticSearchOpen, setSemanticSearchOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  
  return (
    <>
      <CreateProductForm open={createProductFormOpen} setOpen={setCreateProductFormOpen} />
      <UpdateProductForm selectedProduct={selectedProduct} unselectProduct={() => setSelectedProduct(undefined)} />

      <Dialog
        open={semanticSearchOpen}
        onOpenChange={setSemanticSearchOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Semantic search</DialogTitle>
          </DialogHeader>

          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search string"
            value={semantic}
            onChange={(event) => {
              dispatch(setSemantic(event.target.value));
            }}
            onKeyUp={async (event) => {
              event.preventDefault();
              if (event.key == "Enter") {
                await fetctProductPageByPageNumber(1);

                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }
            }}
            disabled={isLoading}
          />
        </DialogContent>
      </Dialog>

      <header className="sticky top-0 z-50 bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-4 h-4" />
        <span className="mr-auto">Products</span>
        
        <Button type="button" onClick={() => setSemanticSearchOpen(true)}>Search</Button>
        <Button type="button" onClick={() => setCreateProductFormOpen(true)}>New Product</Button>
      </header>

      <div className="flex flex-col w-full pb-4">
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
                  <TableHead>Availability</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {products.map(product => {
                  const primaryImageUrl = resolveImageUrl(product.primaryImageId);

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
                      <TableCell>{product.availableQuantity}</TableCell>
                      <TableCell>
                        <Button onClick={() => setSelectedProduct(product)}>Edit</Button>
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
          isLoading={isLoading}
          itemCount={productCount}
          currentPageNumber={currentPageNumber}
          pageSize={pageSize}
          setCurrentPageNumber={fetctProductPageByPageNumber}
        />
      </div>
    </>
  )
}

export default ProductDashboard;