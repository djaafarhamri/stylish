import { CircleUserRound, Moon, ShoppingBag, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useTheme } from "./theme-provider";

export default function NavIcons({ setIsOpen }: {setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <Button
        onClick={() => {
          theme === "dark" ? setTheme("light") : setTheme("dark");
        }}
        variant="outline"
        size="icon"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      <Link onClick={() => setIsOpen(false)} to="/cart">
        <Button variant="outline" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            0
          </span>
        </Button>
      </Link>
      <Link onClick={() => setIsOpen(false)} to="/account" className="block">
        <Button variant="outline" size="icon">
          <CircleUserRound className="h-5 w-5" />
        </Button>
      </Link>
    </>
  );
}
