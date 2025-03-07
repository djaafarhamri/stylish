import type React from "react";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { showToast } from "../ui/showToast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      showToast({
        title: "Subscribed!",
        description: "You've successfully subscribed to our newsletter.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="bg-muted py-12 md:py-16">
      <div className="container">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Subscribe to Our Newsletter
          </h2>
          <p className="mt-4 text-muted-foreground">
            Stay updated with our latest collections, exclusive offers, and
            style tips.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
