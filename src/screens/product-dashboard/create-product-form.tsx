import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { createProduct } from "@/app/redux/products/products-slice";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ImageSelectionSheet from "./image-selection-sheet";
import { resolveImageUrl } from "@/lib/utils";

const createProductFormSchema = z.object({
  sku: z.string().min(1).max(16),
  name: z.string().min(1).max(100),
  description: z.string().min(0).max(1000),
  price: z.coerce.number().positive(),
  categoryId: z.string({ required_error: "Please select an category." }),
  primaryImageId: z.string().min(1),
  supportingImageIds: z.set(z.string()),
  isFeatured: z.boolean()
});

interface CreateProductFormProps {
  open: boolean
  setOpen: (open: boolean) => void
}

function CreateProductForm({ open, setOpen }: CreateProductFormProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector(state => state.categories);
  const { isLoading: { createProduct: isLoading } } = useAppSelector(state => state.products);

  const form = useForm<z.infer<typeof createProductFormSchema>>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      price: 0.0,
      primaryImageId: "",
      supportingImageIds: new Set<string>(),
      isFeatured: false
    }
  });

  const onSubmit = useCallback(async (values: z.infer<typeof createProductFormSchema>) => {
    const action = await dispatch(createProduct({
      sku: values.sku,
      name: values.name,
      description: values.description,
      price: values.price,
      categoryId: parseInt(values.categoryId),
      primaryImageId: values.primaryImageId,
      supportingImageIds: values.supportingImageIds,
      isFeatured: values.isFeatured
    }));

    if (action.type == createProduct.fulfilled.type) {
      form.resetField("sku");
      form.resetField("name");
      form.resetField("description");
      form.resetField("price");
      form.resetField("primaryImageId");
      form.resetField("supportingImageIds");
      form.resetField("isFeatured");
    }
  }, [form]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.clearErrors();
        }

        setOpen(value)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New product</DialogTitle>
          <DialogDescription>Create new product</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
            <ScrollArea className="max-h-[75vh]">
              <div className="grid grid-cols-2 gap-4 items-start p-1">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="T-SHIRT-1" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        The SKU of the product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Gucci T-shirt" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        The display name of the product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={5} placeholder="" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormDescription>
                          The description of the product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10.00" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        The sell price of the product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              {categories.map(category => {
                                return (
                                  <SelectItem key={category.id} value={`${category.id}`}>{category.name}</SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        The category of the product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="primaryImageId"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Primary image</FormLabel>
                        <FormControl>
                          <Sheet>
                            <SheetTrigger asChild>
                              <div className="flex flex-row max-h-40 p-4 justify-between items-center border-dashed border rounded-md cursor-pointer">
                                {field.value && <img src={resolveImageUrl(field.value)} className="h-full aspect-square object-cover rounded-md"/>}
                                <span className="mx-auto">{field.value ? "Select another image" : "Select image"}</span>
                              </div>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Image Gallery</SheetTitle>
                                <SheetDescription>Choose an image from Image Gallery</SheetDescription>
                              </SheetHeader>

                              <ImageSelectionSheet onSubmit={field.onChange} />
                            </SheetContent>
                          </Sheet>
                        </FormControl>
                        <FormDescription>
                          The primary image of this product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="supportingImageIds"
                    render={({field}) => {
                      const imageIds = useMemo(() => {
                        return Array.from(field.value);
                      }, [field.value]);

                      return (
                        <FormItem>
                          <FormLabel>Supporting images</FormLabel>
                          <FormControl>
                            <ScrollArea className="p-2 border-dashed border rounded-md">
                              <div className="flex flex-row justify-start items-center gap-2">
                                {imageIds.map((imageId) => {
                                  return (
                                    <img
                                      key={imageId}
                                      src={resolveImageUrl(imageId)} className="h-20 aspect-square object-cover rounded-md cursor-pointer"
                                      onClick={() => {
                                        if (field.value.delete(imageId)) {
                                          field.onChange(new Set(field.value));
                                        }
                                      }}
                                    />
                                  );
                                })}

                                <Sheet>
                                  <SheetTrigger asChild>
                                    <div className="flex flex-col h-20 aspect-square justify-center items-center border-dashed border rounded-md cursor-pointer">
                                      Add
                                    </div>
                                  </SheetTrigger>
                                  <SheetContent>
                                    <SheetHeader>
                                      <SheetTitle>Image Gallery</SheetTitle>
                                      <SheetDescription>Choose an image from Image Gallery</SheetDescription>
                                    </SheetHeader>

                                    <ImageSelectionSheet onSubmit={(id) => field.onChange(field.value.add(id))} />
                                  </SheetContent>
                                </Sheet>
                              </div>

                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </FormControl>
                          <FormDescription>
                            The supporting images of this product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row justify-start content-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                        </FormControl>
                        <FormLabel>
                          Is the product featured?
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </ScrollArea>

            <Button type="submit" disabled={isLoading}>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductForm;