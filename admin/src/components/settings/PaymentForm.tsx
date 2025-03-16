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

const paymentFormSchema = z.object({
  id: z.string(),
  credit: z.boolean(),
  paypal: z.boolean(),
  applepay: z.boolean(),
  googlepay: z.boolean(),
});

export default function PaymentForm() {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {},
  });

  const handleSaveSettings = async (
    data: z.infer<typeof paymentFormSchema>
  ) => {
    setIsSubmitting(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/settings/payment`,
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
    form.setValue("credit", newData.credit);
    form.setValue("paypal", newData.paypal);
    form.setValue("googlepay", newData.googlepay);
    form.setValue("applepay", newData.applepay);

    setIsSubmitting(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/settings/payment`,
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
        form.setValue("credit", data.credit);
        form.setValue("paypal", data.paypal);
        form.setValue("googlepay", data.googlepay);
        form.setValue("applepay", data.applepay);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsSubmitting(false);
      }
    };
    fetchPaymentSettings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Configure your store's payment options.
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
              name="credit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Card</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Accept credit card payments
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
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
              name="paypal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PayPal</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Accept PayPal payments
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
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
              name="googlepay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Pay</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Accept Google Pay Payments
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="applepay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apple Pay</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          Accept Apple Pay Payments
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Payment Settings"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
