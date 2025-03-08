import type React from "react";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { AuthService } from "../../services/auth-service";
import { Address } from "../../types/api";

interface AddressFormProps {
  address?: Address;
  onCancel: () => void;
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  length: number;
}

export default function AddressForm({
  address,
  onCancel,
  setAddresses,
  length
}: AddressFormProps) {
  const [formData, setFormData] = useState<Omit<Address, "id" | "userId">>({
    name: address?.name || "",
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    postalCode: address?.postalCode || "",
    country: address?.country || "Algeria",
    isDefault: address?.isDefault || length === 0 ? true : false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isDefault: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (address) {
        const data = await AuthService.updateAddress(formData, address.id);
        if (data.status) {
          setAddresses((prevAddresses) => {
            const updatedAddresses = prevAddresses.map((addr) =>
              addr.id === address.id ? { ...addr, ...data.address } : addr
            );

            if (data.address.isDefault) {
              return updatedAddresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === address.id,
              }));
            }

            return updatedAddresses;
          });
        }
      } else {
        const data = await AuthService.addAddress(formData);
        if (data.status) {
          setAddresses((prevAddresses) => {
            const updatedAddresses = data.address.isDefault
              ? prevAddresses.map((addr) => ({ ...addr, isDefault: false }))
              : prevAddresses;

            return [...updatedAddresses, { ...data.address }];
          });
        }
      }
      onCancel();
    } catch (error) {
      console.log(error);
    }
    
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{address ? "Edit Address" : "Add New Address"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Address nickname</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Home, Work, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street address</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="isDefault"
              disabled={(address && length === 1) || length === 0}
              checked={(address && length === 1) || length === 0 ? true : formData.isDefault}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default shipping address
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save address"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
