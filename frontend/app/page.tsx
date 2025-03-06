import Link from "next/link"
import { Button } from "@/components/ui/button"
import FeaturedProducts from "@/components/featured-products"
import Hero from "@/components/hero"
import Categories from "@/components/categories"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />

      <div className="container py-8 md:py-12">
        <Categories />
      </div>

      <div className="container py-8 md:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
          <Link href="/products">
            <Button variant="link">View all</Button>
          </Link>
        </div>
        <FeaturedProducts />
      </div>

      <Newsletter />

      <footer className="border-t bg-muted/40">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories/men" className="text-sm text-muted-foreground hover:text-foreground">
                    Men
                  </Link>
                </li>
                <li>
                  <Link href="/categories/women" className="text-sm text-muted-foreground hover:text-foreground">
                    Women
                  </Link>
                </li>
                <li>
                  <Link href="/categories/accessories" className="text-sm text-muted-foreground hover:text-foreground">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-sm text-muted-foreground hover:text-foreground">
                    Returns & Exchanges
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} STYLISH. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}

