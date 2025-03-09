
import { ShoppingBag, CircleUserRound } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link } from "react-router";

export default function Navbar() {

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          STYLISH
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Shop
          </Link>
          <Link
            to="/categories/men"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Men
          </Link>
          <Link
            to="/categories/women"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Women
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                0
              </span>
            </Button>
          </Link>
          <Link to="/account" className="block">
            <Button variant="outline" size="icon">
              <CircleUserRound className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link to="/products" className="text-lg font-medium">
                  Shop
                </Link>
                <Link to="/categories/men" className="text-lg font-medium">
                  Men
                </Link>
                <Link to="/categories/women" className="text-lg font-medium">
                  Women
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
