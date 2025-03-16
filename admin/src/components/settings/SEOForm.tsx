import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const seoFormSchema = z.object({
  id: z.string(),
  title: z.string().min(2, { message: "Title name is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  keywords: z.string().min(2, { message: "Keywords is required" }),
});

export default function SEOForm() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof seoFormSchema>>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      keywords: "",
    },
  });

  const handleSaveSettings = async (data: z.infer<typeof seoFormSchema>) => {
    setIsSubmitting(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/settings/seo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const newData = await res.json();
    form.setValue("id", newData.id);
    form.setValue("title", newData.title);
    form.setValue("description", newData.description);
    form.setValue("keywords", newData.keywords);

    setIsSubmitting(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  useEffect(() => {
    const fetchSeoSettings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/seo`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        form.setValue("id", data.id);
        form.setValue("title", data.title);
        form.setValue("description", data.description);
        form.setValue("keywords", data.keywords);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsSubmitting(false);
      }
    };
    fetchSeoSettings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>
          Optimize your store for search engines.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSaveSettings)}
          onError={(errors) => {
            console.error("Validation errors:", errors); // Log validation errors
          }}
          className="space-y-8"
        >
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input placeholder="meta title" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Textarea placeholder="meta description" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Keywords</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input placeholder="meta keywords" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save SEO Settings"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
