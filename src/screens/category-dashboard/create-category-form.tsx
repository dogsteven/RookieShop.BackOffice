import { createCategory } from "@/app/redux/categories/categories-slice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createCategoryFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(250)
});

interface CreateCategoryFormProps {
  open: boolean
  setOpen: (open: boolean) => void
}

function CreateCategoryForm({ open, setOpen }: CreateCategoryFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading: { createCategory: isLoading } } = useAppSelector(state => state.categories);

  const form = useForm<z.infer<typeof createCategoryFormSchema>>({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const onSubmit = useCallback(async (values: z.infer<typeof createCategoryFormSchema>) => {
    const action = await dispatch(createCategory({
      name: values.name,
      description: values.description
    }));

    if (action.type == createCategory.fulfilled.type) {
      form.reset();
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
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>Create new category</DialogDescription>
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

export default CreateCategoryForm;