import { useEffect, useState } from "react";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { AuthService } from "../services/auth-service";
import { Address } from "../types/api";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const getAdresses = async () => {
      try {
        const data = await AuthService.getMyAddresses();
        setAddresses(data.addresses)
      } catch (error) {
        console.log(error);
      }
    };
    getAdresses()
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm addresses={addresses} />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
