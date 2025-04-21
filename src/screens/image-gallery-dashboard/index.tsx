import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UploadImageForm from "./upload-image-form";
import { deleteImage, fetchImagePage } from "@/app/redux/image-gallery/image-gallery-slice";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function ImageGalleryDashboard() {
  const dispatch = useAppDispatch();
  const { images, currentPageNumber, pageSize, error } = useAppSelector(state => state.imageGallery);

  useEffect(() => {
    dispatch(fetchImagePage({
      pageNumber: currentPageNumber,
      pageSize: pageSize
    }));
  }, [currentPageNumber, pageSize]);

  useEffect(() => {
    if (error) {
      toast.error(error.title, {
        description: error.detail
      });
    }
  }, [error]);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-4 h-4" />
        <span className="mr-auto">Image Gallery</span>

        <UploadImageForm />
        {(selectedImages.length > 0)
        &&
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to delete those images?</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await Promise.all(selectedImages.map(async (id) => {
                    await dispatch(deleteImage({ id }));
                  }));

                  setSelectedImages([]);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>}
      </header>
      
      <div className="flex flex-col p-4">        
        <div className="mb-4 grid gap-4 grid-cols-3 sm:grid-cols-4 md:mb-8 lg:grid-cols-5 xl:grid-cols-6">
          {images.map((image) => {
            const selected = selectedImages.includes(image.id);

            return (
              <img
                key={image.id} src={`http://localhost:5027/api/ImageGallery/${image.id}`}
                className={cn("w-full aspect-square object-cover cursor-pointer rounded-md", selected && "border-3 border-red-500")}
                onClick={() => {
                  const index = selectedImages.indexOf(image.id);

                  if (index == -1) {
                    selectedImages.push(image.id);
                  } else {
                    selectedImages.splice(index, 1);
                  }

                  setSelectedImages([...selectedImages]);
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ImageGalleryDashboard;