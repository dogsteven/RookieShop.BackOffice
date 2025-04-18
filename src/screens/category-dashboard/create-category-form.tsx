import { createCategory } from "@/app/redux/categories/categories-slice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ProblemDetails } from "@/app/services/api-client";

const createCategoryFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(250)
});

function CreateCategoryForm() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.categories.status.createCategory);

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
    } else if (action.type == createCategory.rejected.type) {
      const problemDetails = action.payload as ProblemDetails;
      toast.error(problemDetails.title, {
        description: problemDetails.detail
      });
    }
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
        <Button>New Category</Button>
      </DialogTrigger>
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