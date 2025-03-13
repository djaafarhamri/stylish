import { DndProvider } from "react-dnd";
import DraggableImage from "./DraggableImage";
import { useCallback } from "react";
import { HTML5Backend } from "react-dnd-html5-backend"
import { ImageIcon } from "lucide-react";
import { Image } from "@/types/api";

export default function ImageGallery({
    images,
    setImages,
    isEditing,
    removeImage,
    handleFileUpload,
  }: {
    images: (Image | File)[];
    setImages: (newImages: (Image | File)[]) => void;
    isEditing: boolean;
    removeImage: (index: number) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }) {
    const moveImage = useCallback(
      (fromIndex: number, toIndex: number) => {
        const updatedImages = [...images];
        const [movedImage] = updatedImages.splice(fromIndex, 1);
        updatedImages.splice(toIndex, 0, movedImage);
        setImages(updatedImages);
      },
      [images, setImages]
    );
  
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images?.map((image, index) => (
            <DraggableImage
              key={index}
              index={index}
              image={image}
              moveImage={moveImage}
              removeImage={removeImage}
              isEditing={isEditing}
            />
          ))}
          {isEditing && (
            <div className="relative border rounded-lg flex items-center justify-center h-64 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                multiple
              />
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mb-2" />
                <span>Add Image</span>
              </div>
            </div>
          )}
        </div>
      </DndProvider>
    );
  }
  