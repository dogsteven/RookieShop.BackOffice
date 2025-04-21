import { useAppSelector } from "@/app/redux/hook";
import { Button } from "@/components/ui/button";

interface ImageSelectionProps {
  onSelect: (id: string) => void
}

function ImageSelection(props: ImageSelectionProps) {
  const { images, currentPageNumber, pageSize } = useAppSelector(state => state.imageGallery);

  return (
    <div className="flex flex-col w-full">
      <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => {
          return (
            <Button key={image.id}>
              <img src={`http://localhost:5027/api/ImageGallery/${image.id}`} />
            </Button>
          );
        })}
      </div>
    </div>
  )
}

export default ImageSelection;