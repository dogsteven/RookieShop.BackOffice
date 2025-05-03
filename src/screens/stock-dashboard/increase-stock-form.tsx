import ProductDto from "@/app/models/product-dto";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { increaseStock } from "@/app/redux/products/products-slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const increaseStockFormSchema = z.object({
  quantity: z.coerce.number().positive()
});

interface IncreaseStockFormProps {
  selectedProduct?: ProductDto
  unselectProduct: () => void
}

function IncreaseStockForm({ selectedProduct, unselectProduct }: IncreaseStockFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading: { increaseStock: isLoading } } = useAppSelector(state => state.products);

  const [productSku, setProductSku] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedProduct) {
      setProductSku(selectedProduct.sku);
    }
  }, [selectedProduct]);

  const form = useForm<z.infer<typeof increaseStockFormSchema>>({
    resolver: zodResolver(increaseStockFormSchema),
    defaultValues: {
      quantity: 0
    }
  });

  const onSubmit = useCallback(async (values: z.infer<typeof increaseStockFormSchema>) => {
    if (selectedProduct) {
      const action = await dispatch(increaseStock({
        sku: selectedProduct.sku,
        quantity: values.quantity
      }));

      if (action.type == increaseStock.fulfilled.type) {
        form.reset();
        unselectProduct();
      }
    }
  }, [selectedProduct]);

  return (
    <Dialog
      open={selectedProduct != null}
      onOpenChange={(value) => {
        if (!value) {
          form.clearErrors();
          unselectProduct();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Increase stock</DialogTitle>
          <DialogDescription>Increase stock for product {productSku}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
            <div className="grid grid-cols-2 gap-4 items-start p-1">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        Number of units to add
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default IncreaseStockForm;