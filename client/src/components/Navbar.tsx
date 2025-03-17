import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link } from "react-router";

import NavIcons from "./NavIcons";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            to="/products?category=Dresses&page=1"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Dresses
          </Link>
          <Link
            to="/products?category=Sportswear&page=1"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Sportswear
          </Link>
          <Link
            to="/products?category=Accessories&page=1"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Accessories
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <NavIcons setIsOpen={setIsOpen} />
          </div>
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="icon"
                className="md:hidden"
              >
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
              <SheetHeader>
                <SheetTitle>
                  <Link
                    onClick={() => setIsOpen(false)}
                    to="/"
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    STYLISH
                  </Link>
                </SheetTitle>
                <SheetDescription>Elevate Your Elegance.</SheetDescription>
              </SheetHeader>
              <div className="flex items-center gap-4 mt-10">
                <NavIcons setIsOpen={setIsOpen} />
              </div>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/"
                  className="text-lg font-medium"
                >
                  Home
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/products"
                  className="text-lg font-medium"
                >
                  Shop
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/products?category=Dresses&page=1"
                  className="text-lg font-medium"
                >
                  Dresses
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/products?category=Sportswear&page=1"
                  className="text-lg font-medium"
                >
                  Sportswear
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/products?category=Accessories&page=1"
                  className="text-lg font-medium"
                >
                  Accessories
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
