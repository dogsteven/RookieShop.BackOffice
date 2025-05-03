import ProductDto from "@/app/models/product-dto";
import { useAppDispatch, useAppSelector, useFetchProductPageByPageNumber } from "@/app/redux/hook";
import { clearError, clearSuccess, fetchProductPage, setSemantic } from "@/app/redux/products/products-slice";
import RookieShopPagination from "@/components/rookie-shop-pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { resolveImageUrl } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import IncreaseStockForm from "./increase-stock-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function StockDashboard() {
  const { semantic, productCount, currentPageNumber, pageSize, products, success, error, isLoading: { fetchProductPage: isLoading } } = useAppSelector(state => state.products);

  const dispatch = useAppDispatch();
    
  const fetctProductPageByPageNumber = useFetchProductPageByPageNumber();

  useEffect(() => {
    dispatch(fetchProductPage({ pageNumber: 1, pageSize: 9 }));
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

  const [selectedProduct, setSelectedProduct] = useState<ProductDto | undefined>(undefined);

  const [semanticSearchOpen, setSemanticSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <IncreaseStockForm selectedProduct={selectedProduct} unselectProduct={() => setSelectedProduct(undefined)} />

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
        <span className="mr-auto">Stock</span>

        <Button type="button" onClick={() => setSemanticSearchOpen(true)}>Search</Button>
      </header>

      <div className="flex flex-col w-full pb-4">
        <div className="p-4 w-full">
          <ScrollArea>
            <Table className="w-full">
              <TableCaption>All products of RookieShop</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
              {products.map(product => {
                  const primaryImageUrl = resolveImageUrl(product.primaryImageId);

                  return (
                    <TableRow key={product.sku}>
                      <TableCell>
                        <img src={primaryImageUrl} className="w-12 rounded-sm aspect-square object-cover" />
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.availableQuantity}</TableCell>
                      <TableCell>
                        <Button onClick={() => setSelectedProduct(product)}>Increase stock</Button>
                      </TableCell>
                    </TableRow>
                  );
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

export default StockDashboard;