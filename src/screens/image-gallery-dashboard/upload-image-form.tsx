import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { uploadImage } from "@/app/redux/image-gallery/image-gallery-slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const supportedImageExtemsions = ["image/png", "image/jpeg", "image/bmp", "image/webp", "image/tiff"];

const uploadImageSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => supportedImageExtemsions.includes(file.type), "Only images are allowed")
    .refine((file) => file.size < 5 * 1024 * 1024, "File size must be less than 5MB")
});

function UploadImageForm() {
  const dispatch = useAppDispatch();
  const { isLoading: { uploadImage: isLoading } } = useAppSelector(state => state.imageGallery);

  const form = useForm<z.infer<typeof uploadImageSchema>>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {}
  });

  const [open, setOpen] = useState(false);

  const onSubmit = useCallback(async (values: z.infer<typeof uploadImageSchema>) => {
    const action = await dispatch(uploadImage({
      file: values.file
    }));

    if (action.type == uploadImage.fulfilled.type) {
      setOpen(false);
    }
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        
        if (!value) {
          form.clearErrors();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Upload Image</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
          <DialogDescription>Upload new image to the gallery</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
            <FormField
              control={form.control}
              name="file"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      disabled={isLoading}
                      onChange={(event) => {
                        field.onChange(event.target.files?.[0] || undefined);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The image to be uploaded
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

export default UploadImageForm;