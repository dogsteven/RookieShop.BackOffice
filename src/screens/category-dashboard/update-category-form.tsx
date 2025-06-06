import { updateCategory } from "@/app/redux/categories/categories-slice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import CategoryDto from "@/app/models/category-dto";

const updateCategoryFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(250)
});

interface UpdateCategoryFormProps {
  selectedCategory: CategoryDto | undefined
  unselectCategory: () => void
}

function UpdateCategoryForm({ selectedCategory, unselectCategory }: UpdateCategoryFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading: { updateCategory: isLoading } } = useAppSelector(state => state.categories);

  const [categoryName, setCategoryName] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof updateCategoryFormSchema>>({
    resolver: zodResolver(updateCategoryFormSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  useEffect(() => {
    if (selectedCategory) {
      form.setValue("name", selectedCategory.name);
      form.setValue("description", selectedCategory.description);

      setCategoryName(selectedCategory.name);
    }
  }, [selectedCategory]);

  const onSubmit = useCallback(async (values: z.infer<typeof updateCategoryFormSchema>) => {
    if (selectedCategory) {
      dispatch(updateCategory({
        id: selectedCategory.id,
        name: values.name,
        description: values.description
      }));
    }
  }, [selectedCategory]);

  return (
    <Dialog
      open={selectedCategory != null} 
      onOpenChange={(value) => {
        if (!value) {
          form.clearErrors();
          unselectCategory();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>Edit category "{categoryName}"</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="T-shirt" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>
                    The display name of the category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    The description of the category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCategoryForm;