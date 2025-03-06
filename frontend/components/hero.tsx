import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative bg-muted/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-12 md:flex-row md:py-24">
        <div className="flex flex-col items-start gap-4 md:max-w-md">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Discover Your Style This Season
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Explore our new collection of trendy and comfortable clothing for every occasion.
          </p>
          <div className="flex gap-4">
            <Link href="/products">
              <Button>
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/categories/new-arrivals">
              <Button variant="outline">New Arrivals</Button>
            </Link>
          </div>
        </div>
        <div className="relative h-[300px] w-full md:h-[400px] md:w-1/2 rounded-lg overflow-hidden">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="Fashion model wearing the latest collection"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

