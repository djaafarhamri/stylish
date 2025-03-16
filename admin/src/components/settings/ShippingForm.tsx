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
import { Switch } from "../ui/switch";

const shippingFormSchema = z
  .object({
    id: z.string(),
    free: z.boolean(),
    threshold: z.number().optional(), // Initially optional, required based on `free`
    express: z.boolean(),
    fee: z.number().optional(), // Initially optional, required based on `express`
  })
  .refine((data) => !(data.free && data.threshold === undefined), {
    message: "Threshold is required when free shipping is enabled",
    path: ["threshold"],
  })
  .refine((data) => !(data.express && data.fee === undefined), {
    message: "Fee is required when express shipping is enabled",
    path: ["fee"],
  });

export default function ShippingForm() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      id: "",
      threshold: 0,
      express: false,
      free: false,
      fee: 0,
    },
  });

  const handleSaveSettings = async (
    data: z.infer<typeof shippingFormSchema>
  ) => {
    setIsSubmitting(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/settings/shipping`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    const newData = await res.json();
    form.setValue("id", newData.id);
    form.setValue("free", newData.free);
    form.setValue("threshold", newData.threshold);
    form.setValue("express", newData.express);
    form.setValue("fee", newData.fee);

    setIsSubmitting(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/shipping`,
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
        form.setValue("free", data.free);
        form.setValue("threshold", data.threshold);
        form.setValue("express", data.express);
        form.setValue("fee", data.fee);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsSubmitting(false);
      }
    };
    fetchShippingSettings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Methods</CardTitle>
        <CardDescription>
          Configure your store's shipping options.
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
            <FormField
              control={form.control}
              name="free"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Shipping</FormLabel>
                  <FormControl>
                    <div>
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Offer free shipping for orders above a certain amount
                        </p>
                      </div>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free Shipping Threshold ($)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="50"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="express"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Express Shipping</FormLabel>
                  <FormControl>
                    <div>
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Offer express shipping option to customers
                        </p>
                      </div>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Express Shipping Fee ($)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="10"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Shipping Settings"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
