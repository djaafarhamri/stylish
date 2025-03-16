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

const notificationFormSchema = z.object({
  id: z.string(),
  orderConfirmation: z.boolean(),
  shippingConfirmation: z.boolean(),
  orderCancellation: z.boolean(),
  abandonedCart: z.boolean(),
});

export default function NotificationForm() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      id: '',
      orderConfirmation: true,
      shippingConfirmation: true,
      orderCancellation: true,
      abandonedCart: false,
    },
  });

  const handleSaveSettings = async (
    data: z.infer<typeof notificationFormSchema>
  ) => {
    setIsSubmitting(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/settings/notification`,
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
    form.setValue("orderConfirmation", newData.orderConfirmation);
    form.setValue("shippingConfirmation", newData.shippingConfirmation);
    form.setValue("orderCancellation", newData.orderCancellation);
    form.setValue("abandonedCart", newData.abandonedCart);

    setIsSubmitting(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/notification`,
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
        form.setValue("orderConfirmation", data.orderConfirmation);
        form.setValue("shippingConfirmation", data.shippingConfirmation);
        form.setValue("orderCancellation", data.orderCancellation);
        form.setValue("abandonedCart", data.abandonedCart);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsSubmitting(false);
      }
    };
    fetchNotificationSettings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Configure your store's email notification settings.
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
              name="orderConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Confirmation</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Send email when an order is placed
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
              name="shippingConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Confirmation</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Send email when an order is shipped
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
              name="orderCancellation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Cancellation</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Send email when an order is cancelled
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
              name="abandonedCart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abandoned Cart</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Send email for abandoned carts
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
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Notification Settings"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
