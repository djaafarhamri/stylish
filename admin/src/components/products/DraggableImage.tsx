import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useDrag, useDrop } from "react-dnd";
import { Image } from "@/types/api";

const ItemType = "IMAGE";

export default function DraggableImage({
  image,
  index,
  moveImage,
  removeImage,
  isEditing,
}: {
  image: Image | File;
  index: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
  removeImage: (index: number) => void;
  isEditing: boolean;
}) {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) ref(drop(node));
      }}
      className="relative border rounded-lg overflow-hidden cursor-move"
    >
      <img
        src={
          image instanceof File
            ? URL.createObjectURL(image)
            : image.url || "/placeholder.svg"
        }
        alt={`Product ${index + 1}`}
        className="w-full h-64 object-cover"
      />
      {isEditing && (
        <Button
          variant="destructive"
          type="button"
          size="icon"
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => removeImage(index)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};