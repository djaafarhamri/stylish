import { Toaster, toast } from "sonner";

const Test = () => {
  return (
    <div>
      <button
        onClick={() =>
          toast("Hello!", {
            description: "This is a test notification.",
          })
        }
      >
        Show Toast
      </button>
      <Toaster position="top-right" />
    </div>
  );
};

export default Test;
