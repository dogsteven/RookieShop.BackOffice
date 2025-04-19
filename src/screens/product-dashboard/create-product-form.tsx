import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { createProduct } from "@/app/redux/products/products-slice";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const createProductFormSchema = z.object({
  sku: z.string().min(1).max(16),
  name: z.string().min(1).max(100),
  description: z.string().min(0).max(1000),
  price: z.coerce.number().positive(),
  categoryId: z.string({ required_error: "Please select an category." }),
  imageUrl: z.string().url().min(1).max(500),
  isFeatured: z.boolean()
});

function CreateProductForm() {
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
      imageUrl: "",
      isFeatured: false
    }
  });

  const onSubmit = useCallback(async (values: z.infer<typeof createProductFormSchema>) => {
    dispatch(createProduct({
      sku: values.sku,
      name: values.name,
      description: values.description,
      price: values.price,
      categoryId: parseInt(values.categoryId),
      imageUrl: values.imageUrl,
      isFeatured: values.isFeatured
    }));
  }, []);

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) {
          form.clearErrors();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>New Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New product</DialogTitle>
          <DialogDescription>Create new product</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
            <div className="grid grid-cols-2 gap-4 items-start">
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
                        <Textarea placeholder="" {...field} disabled={isLoading} />
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
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Url</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        The image url of the product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
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

            <Button type="submit" disabled={isLoading}>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductForm;