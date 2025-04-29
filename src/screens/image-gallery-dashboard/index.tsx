import { useAppDispatch, useAppSelector, useFetchImagePageByPageNumber } from "@/app/redux/hook";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UploadImageForm from "./upload-image-form";
import { deleteImage, fetchImagePage } from "@/app/redux/image-gallery/image-gallery-slice";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn, resolveImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RookieShopPagination from "@/components/rookie-shop-pagination";

function ImageGalleryDashboard() {
  const dispatch = useAppDispatch();
  const { images, imageCount, currentPageNumber, pageSize, error, isLoading: { fetchImagePage: isLoading } } = useAppSelector(state => state.imageGallery);

  const fetchImagePageByPageNumber = useFetchImagePageByPageNumber();

  useEffect(() => {
    dispatch(fetchImagePage({ pageNumber: 1, pageSize: 12 }));
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.title, {
        description: error.detail
      });
    }
  }, [error]);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [uploadImageFormOpen, setUploadImageFormOpen] = useState(false);
  const [deleteImageDialogOpen, setDeleteImageDialogOpen] = useState(false);

  return (
    <>
      <UploadImageForm open={uploadImageFormOpen} setOpen={setUploadImageFormOpen} />
      
      <AlertDialog open={deleteImageDialogOpen} onOpenChange={setDeleteImageDialogOpen}>
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
      </AlertDialog>

      <header className="sticky top-0 z-50 bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-4 h-4" />
        <span className="mr-auto">Image Gallery</span>

        <Button onClick={() => setUploadImageFormOpen(true)}>Upload Image</Button>
        {selectedImages.length > 0 && <Button variant="destructive" onClick={() => setDeleteImageDialogOpen(true)}>Delete</Button>}
      </header>
      
      <div className="flex flex-col p-4">        
        <div className="mb-4 grid gap-4 grid-cols-3 sm:grid-cols-4 md:mb-8 lg:grid-cols-5 xl:grid-cols-6">
          {images.map((image) => {
            const selected = selectedImages.includes(image.id);

            return (
              <img
                key={image.id} src={resolveImageUrl(image.id)}
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

        <RookieShopPagination
          isLoading={isLoading}
          itemCount={imageCount}
          currentPageNumber={currentPageNumber}
          pageSize={pageSize}
          setCurrentPageNumber={fetchImagePageByPageNumber}
        />
      </div>
    </>
  );
}

export default ImageGalleryDashboard;