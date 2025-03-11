"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle } from "lucide-react";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SavedAddresses, { type AddressOption } from "./SavedAddresses";
import useAuth from "../../context/auth/useAuth";
import { useNavigate } from "react-router";
import { Address, Order, variant } from "../../types/api";
import { OrderService } from "../../services/order-service";
import useCart from "../../context/cart/useCart";
import { showToast } from "../ui/showToast";

// Create two different schemas based on authentication status
const guestFormSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Valid phone number is required" }),
    address: z.string().min(5, { message: "Address is required" }),
    addressName: z.string().optional(),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    zipCode: z.string().min(5, { message: "Valid zip code is required" }),
    country: z.string().min(2, { message: "Country is required" }),
    paymentMethod: z.enum(["CREDIT", "PAYPAL"]),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "CREDIT") {
      if (!data.cardNumber?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["cardNumber"],
          message: "Card number is required",
        });
      }
      if (!data.cardName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["cardName"],
          message: "Cardholder name is required",
        });
      }
      if (!data.expiryDate?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["expiryDate"],
          message: "Expiry date is required",
        });
      }
      if (!data.cvv?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["cvv"],
          message: "CVV is required",
        });
      }
    }
  });

const userFormSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    addressName: z
      .string()
      .min(1, { message: "Address Name is required" })
      .optional(),
    address: z.string().min(5, { message: "Address is required" }).optional(),
    city: z.string().min(2, { message: "City is required" }).optional(),
    state: z.string().min(2, { message: "State is required" }).optional(),
    zipCode: z
      .string()
      .min(5, { message: "Valid zip code is required" })
      .optional(),
    country: z.string().min(2, { message: "Country is required" }).optional(),
    paymentMethod: z.enum(["CREDIT", "PAYPAL"]),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "CREDIT") {
      if (!data.cardNumber?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["cardNumber"],
          message: "Card number is required",
        });
      }
      if (!data.cardName?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["cardName"],
          message: "Cardholder name is required",
        });
      }
      if (!data.expiryDate?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["expiryDate"],
          message: "Expiry date is required",
        });
      }
      if (!data.cvv?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["cvv"],
          message: "CVV is required",
        });
      }
    }
  });

export default function CheckoutForm({ addresses }: { addresses: Address[] }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addressOption, setAddressOption] = useState<AddressOption>(
    user && addresses?.length ? "saved" : "new"
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses?.length ? (addresses[0]?.id ? addresses[0]?.id : "") : ""
  );
  const formSchema = user ? userFormSchema : guestFormSchema;

  // Choose the appropriate schema based on authentication status
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      ...(user
        ? {}
        : {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
          }),
      address: "",
      addressName: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      paymentMethod: "CREDIT",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      notes: "",
    },
  });

  useEffect(() => {
    setSelectedAddressId(
      addresses?.length ? (addresses[0]?.id ? addresses[0]?.id : "") : ""
    );
  }, [addresses]);

  useEffect(() => {
    if (user && addressOption === "saved") {
      form.setValue("address", addresses?.length ? addresses[0].street : "");
      form.setValue("city", addresses?.length ? addresses[0].city : "");
      form.setValue("state", addresses?.length ? addresses[0].state : "");
      form.setValue(
        "zipCode",
        addresses?.length ? addresses[0].postalCode : ""
      );
      form.setValue("country", addresses?.length ? addresses[0].country : "");
      form.setValue("addressName", addresses?.length ? addresses[0].name : "");
    }
  }, [addressOption, user, form, addresses]);

  // If user logs in/out, reset the form
  useEffect(() => {
    form.reset();
    setAddressOption(user ? "saved" : "new");
  }, [user, form]);

  const { cart, reset } = useCart();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // If user is logged in, add user information to the values
    if (user) {
      values = {
        ...values,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      };
    }

    const subtotal = cart?.items.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.variant?.product?.salePrice)
          ? parseFloat(item.variant?.product?.salePrice) * item.quantity
          : parseFloat(item.variant?.product?.price)) *
          item.quantity,
      0
    );

    const isGuest = !user;
    const orderData: Order = {
      userId: isGuest ? undefined : user.id,
      guestFirstName: isGuest ? values.firstName : undefined,
      guestLastName: isGuest ? values.lastName : undefined,
      guestPhone: isGuest ? values.phone : undefined,
      guestEmail: isGuest ? values.email : undefined,
      addressId: addressOption === "new" ? undefined : selectedAddressId,
      shippingAddress:
        addressOption === "new"
          ? {
              city: values.city || "",
              street: values.address || "",
              postalCode: values.zipCode || "",
              state: values.state || "",
              country: values.country || "",
              name: isGuest ? "Guest" : values.addressName || "",
              isDefault: true,
              userId: isGuest ? undefined : user.id,
            }
          : undefined,
      items:
        cart?.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          variantId: "",
          variant: {} as variant,
        })) || [],
      isGuest,
      total: subtotal?.toString() || "0",
      paymentMethod: values.paymentMethod,
      cardName: values.cardName,
      cardNumber: values.cardNumber,
      expiryDate: values.expiryDate,
      cvv: values.cvv,
      notes: values.notes,
    };

    // Simulate API call
    const data = user
      ? await OrderService.createOrder(orderData)
      : await OrderService.createGuestOrder(orderData);
    if (data.status) {
      reset();
      const orderNumber = "ORD-" + String(data.order.id).padStart(5, "0");
      // Redirect to confirmation page after successful checkout
      setTimeout(() => {
        navigate(`/checkout/confirmation?orderId=${orderNumber}`);
      }, 2000);
    } else {
      console.log(data);
      showToast({
        title: data.message,
        type: "error",
      });
    }
    setIsSubmitting(false);
    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. You will be redirected to the
              confirmation page.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Validation errors:", errors); // Log validation errors
        })}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Only show SavedAddresses component if user is logged in */}
            {user && (
              <SavedAddresses
                selectedOption={addressOption}
                onOptionChange={setAddressOption}
                selectedAddressId={selectedAddressId}
                onAddressSelect={setSelectedAddressId}
                addresses={addresses}
              />
            )}

            {/* Show personal information fields only for guests */}
            {!user && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                          />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Show address fields only if adding a new address or user is not logged in */}
            {(!user || addressOption === "new") && (
              <>
                {user && (
                  <FormField
                    control={form.control}
                    name="addressName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Home, Work..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <Tabs
                        defaultValue="CREDIT"
                        className="w-full"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="CREDIT">Credit Card</TabsTrigger>
                          <TabsTrigger value="PAYPAL">Paypal</TabsTrigger>
                        </TabsList>
                        <TabsContent value="CREDIT" className="pt-4">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="cardNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Card Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="4242 4242 4242 4242"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="cardName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name on Card</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="cvv"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                      <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="PAYPAL" className="pt-4">
                          <div className="flex items-center justify-center p-6 border rounded-md">
                            <p className="text-center text-muted-foreground">
                              You will be redirected to Paypal to complete your
                              payment after reviewing your order.
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Special delivery instructions or other information"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </Form>
  );
}
