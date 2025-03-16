
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import StoreForm from "@/components/settings/StoreForm";



// const seoFormSchema = z.object({
//   title: z.string().min(2, { message: "Title is required" }),
//   description: z.string().min(2, { message: "Description is required" }),
//   keywords: z.string().min(2, { message: "Keywords is required" }),
// });

// const shippingFormSchema = z
//   .object({
//     free: z.boolean(),
//     threshold: z.number().optional(), // Initially optional, required based on `free`
//     express: z.boolean(),
//     fee: z.number().optional(), // Initially optional, required based on `express`
//   })
//   .refine((data) => !(data.free && data.threshold === undefined), {
//     message: "Threshold is required when free shipping is enabled",
//     path: ["threshold"],
//   })
//   .refine((data) => !(data.express && data.fee === undefined), {
//     message: "Fee is required when express shipping is enabled",
//     path: ["fee"],
//   });

// const paymentFormSchema = z.object({
//   credit: z.boolean(),
//   paypal: z.boolean(),
//   applepay: z.boolean(),
//   googlepay: z.boolean(),
// });

// const notificationFormSchema = z.object({
//   orderConfirmation: z.boolean(),
//   shippingConfirmation: z.boolean(),
//   orderCancellation: z.boolean(),
//   abandonedCart: z.boolean(),
// });

export default function SettingsPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your store settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <StoreForm />
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your store for search engines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  defaultValue="Fashion Store | Trendy Clothing & Accessories"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  defaultValue="Discover the latest fashion trends at Fashion Store. Shop our collection of clothing, shoes, and accessories for men and women."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input
                  id="meta-keywords"
                  defaultValue="fashion, clothing, apparel, accessories, shoes"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Save SEO Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Methods</CardTitle>
              <CardDescription>
                Configure your store's shipping options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Free Shipping</Label>
                  <p className="text-sm text-muted-foreground">
                    Offer free shipping for orders above a certain amount
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free-shipping-threshold">
                  Free Shipping Threshold ($)
                </Label>
                <Input
                  id="free-shipping-threshold"
                  type="number"
                  defaultValue="50"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Express Shipping</Label>
                  <p className="text-sm text-muted-foreground">
                    Offer express shipping option to customers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="express-shipping-fee">
                  Express Shipping Fee ($)
                </Label>
                <Input
                  id="express-shipping-fee"
                  type="number"
                  defaultValue="15"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Shipping Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure your store's payment options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Credit Card</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept credit card payments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">PayPal</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept PayPal payments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Apple Pay</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept Apple Pay payments
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Google Pay</Label>
                  <p className="text-sm text-muted-foreground">
                    Accept Google Pay payments
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Payment Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure your store's email notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Order Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email when an order is placed
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Shipping Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email when an order is shipped
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Order Cancellation</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email when an order is cancelled
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Abandoned Cart</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email for abandoned carts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
