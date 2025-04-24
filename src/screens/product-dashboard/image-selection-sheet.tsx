import { useAppDispatch, useAppSelector, useFetchImagePageByPageNumber } from "@/app/redux/hook";
import { fetchImagePage, uploadImage } from "@/app/redux/image-gallery/image-gallery-slice";
import RookieShopPagination from "@/components/rookie-shop-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface ImageSelectionProps {
  onSubmit?: (id: string) => void
}

function ImageSelectionSheet({ onSubmit }: ImageSelectionProps) {
  const dispatch = useAppDispatch();
  const { images, imageCount, currentPageNumber, pageSize, isLoading: { fetchImagePage: isLoading } } = useAppSelector(state => state.imageGallery);

  const fetchImagePageByPageNumber = useFetchImagePageByPageNumber();

  useEffect(() => {
    dispatch(fetchImagePage({
      pageNumber: currentPageNumber,
      pageSize: pageSize
    }));
  }, [currentPageNumber]);

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col p-4">
      <div className="mb-4 grid gap-4 grid-cols-3 md:mb-8">
        {images.map((image) => {
          return (
            <img
              key={image.id} src={`http://localhost:5027/api/ImageGallery/${image.id}`}
              className={cn("w-full aspect-square object-cover cursor-pointer rounded-md", selectedId == image.id && "border-3 border-green-500")}
              onClick={() => setSelectedId(image.id)}
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

      <Button
        type="button"
        className="mt-4"
        disabled={!selectedId}
        onClick={() => {
          if (selectedId && onSubmit) {
            onSubmit(selectedId);
          }
        }}
      >
        Select
      </Button>

      <Input
        ref={uploadImageInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={async (event) => {
          const file = event.target?.files?.item(0)
          
          if (file && uploadImageInputRef.current) {
            await dispatch(uploadImage({ file: file }));
          }
        }}
      />

      <Button
        type="button"
        className="mt-4"
        onClick={() => {
          if (uploadImageInputRef.current) {
            uploadImageInputRef.current.click();
          }
        }}
      >
        Upload an image
      </Button>
    </div>
  )
}

export default ImageSelectionSheet;