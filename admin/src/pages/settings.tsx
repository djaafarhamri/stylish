import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import StoreForm from "@/components/settings/StoreForm";
import SEOForm from "@/components/settings/SEOForm";
import ShippingForm from "@/components/settings/ShippingForm";
import NotificationForm from "@/components/settings/Notification";
import PaymentForm from "@/components/settings/PaymentForm";

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
          <SEOForm />
        </TabsContent>

        <TabsContent value="shipping" className="mt-6 space-y-6">
          <ShippingForm />
        </TabsContent>

        <TabsContent value="payment" className="mt-6 space-y-6">
          <PaymentForm />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <NotificationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
