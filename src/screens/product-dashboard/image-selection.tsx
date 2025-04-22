import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { fetchImagePage } from "@/app/redux/image-gallery/image-gallery-slice";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ImageSelectionProps {
  selectedId?: string
  onSelect: (id: string) => void
}

function ImageSelection(props: ImageSelectionProps) {
  const dispatch = useAppDispatch();
  const { images, currentPageNumber, pageSize } = useAppSelector(state => state.imageGallery);

  useEffect(() => {
    dispatch(fetchImagePage({
      pageNumber: currentPageNumber,
      pageSize: pageSize
    }));
  }, [currentPageNumber, pageSize]);

  return (
    <div className="flex flex-col p-4">        
      <div className="mb-4 grid gap-4 grid-cols-3 md:mb-8">
        {images.map((image) => {
          return (
            <img
              key={image.id} src={`http://localhost:5027/api/ImageGallery/${image.id}`}
              className={cn("w-full aspect-square object-cover cursor-pointer rounded-md", props.selectedId == image.id && "border-3 border-green-500")}
              onClick={() => props.onSelect(image.id)}
            />
          );
        })}
      </div>
    </div>
  )
}

export default ImageSelection;