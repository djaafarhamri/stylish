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

const storeFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: "Store name is required" }),
  email: z.string().email().min(2, { message: "Email is required" }),
  phone: z.string().min(2, { message: "Phone is required" }),
  currency: z.string().min(2, { message: "Currency is required" }),
  address: z.string().min(2, { message: "Address is required" }),
  description: z.string().min(2, { message: "Description is required" }),
});

export default function StoreForm() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {},
  });

  const handleSaveSettings = async (data: z.infer<typeof storeFormSchema>) => {
    setIsSubmitting(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/settings/store`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const newData = await res.json();
    form.setValue("id", newData.id);
    form.setValue("name", newData.name);
    form.setValue("email", newData.email);
    form.setValue("phone", newData.phone);
    form.setValue("currency", newData.currency);
    form.setValue("address", newData.address);
    form.setValue("description", newData.description);

    setIsSubmitting(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/store`,
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
        form.setValue("name", data.name);
        form.setValue("email", data.email);
        form.setValue("phone", data.phone);
        form.setValue("currency", data.currency);
        form.setValue("address", data.address);
        form.setValue("description", data.description);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsSubmitting(false);
      }
    };
    fetchStoreSettings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Information</CardTitle>
        <CardDescription>
          Update your store details and contact information.
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input placeholder="name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input placeholder="email" type="email" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input placeholder="phone" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input placeholder="currency" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Textarea placeholder="address" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Description</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Textarea placeholder="description" {...field} />
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
