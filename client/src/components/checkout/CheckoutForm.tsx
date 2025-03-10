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
import { Address } from "../../types/api";

// Create two different schemas based on authentication status
const guestFormSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Valid phone number is required" }),
    address: z.string().min(5, { message: "Address is required" }),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    zipCode: z.string().min(5, { message: "Valid zip code is required" }),
    country: z.string().min(2, { message: "Country is required" }),
    paymentMethod: z.enum(["credit", "paypal"]),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "credit") {
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
    address: z.string().min(5, { message: "Address is required" }).optional(),
    city: z.string().min(2, { message: "City is required" }).optional(),
    state: z.string().min(2, { message: "State is required" }).optional(),
    zipCode: z
      .string()
      .min(5, { message: "Valid zip code is required" })
      .optional(),
    country: z.string().min(2, { message: "Country is required" }).optional(),
    paymentMethod: z.enum(["credit", "paypal"]),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "credit") {
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
  const [selectedAddressId, setSelectedAddressId] = useState(addresses?.length ? addresses[0]?.id:"");
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
      city: "",
      state: "",
      zipCode: "",
      country: "",
      paymentMethod: "credit",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      notes: "",
    },
  });

  useEffect(() => {
    setSelectedAddressId(addresses?.length ? addresses[0]?.id:"")
  }, [addresses]);

  useEffect(() => {
    console.log("option : ", addressOption);
    if (user && addressOption === "saved") {
        form.setValue("address", addresses?.length ? addresses[0].street: "");
        form.setValue("city", addresses?.length ? addresses[0].city: "");
        form.setValue("state", addresses?.length ? addresses[0].state: "");
        form.setValue("zipCode", addresses?.length ? addresses[0].postalCode: "");
        form.setValue("country", addresses?.length ? addresses[0].country: "");
    }
    console.log("form : ", form.getValues());
  }, [addressOption, user, form, addresses]);

  // If user logs in/out, reset the form
  useEffect(() => {
    form.reset();
    setAddressOption(user ? "saved" : "new");
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("submit");
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(values);
    setIsSubmitting(false);
    setIsSuccess(true);

    // Redirect to confirmation page after successful checkout
    setTimeout(() => {
      navigate("/checkout/confirmation");
    }, 2000);
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
        onSubmit={form.handleSubmit(onSubmit)}
        onError={(error) => {
          console.log(error);
        }}
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
                        defaultValue="credit"
                        className="w-full"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="credit">Credit Card</TabsTrigger>
                          <TabsTrigger value="paypal">PayPal</TabsTrigger>
                        </TabsList>
                        <TabsContent value="credit" className="pt-4">
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
                        <TabsContent value="paypal" className="pt-4">
                          <div className="flex items-center justify-center p-6 border rounded-md">
                            <p className="text-center text-muted-foreground">
                              You will be redirected to PayPal to complete your
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
