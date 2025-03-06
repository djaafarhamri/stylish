"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import AddressForm from "./address-form"

type Address = {
  id: string
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      name: "Work",
      street: "456 Park Ave",
      city: "New York",
      state: "NY",
      postalCode: "10022",
      country: "United States",
      isDefault: false,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((address) => address.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    )
  }

  return (
    <div className="space-y-6">
      {addresses.map((address) => (
        <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{address.name}</span>
              {address.isDefault && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Default</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p>{address.street}</p>
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.country}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setEditingAddressId(address.id)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(address.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            {!address.isDefault && (
              <Button variant="ghost" size="sm" onClick={() => handleSetDefault(address.id)}>
                Set as default
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      {(showAddForm || editingAddressId) && (
        <AddressForm
          onCancel={() => {
            setShowAddForm(false)
            setEditingAddressId(null)
          }}
          address={editingAddressId ? addresses.find((a) => a.id === editingAddressId) : undefined}
        />
      )}

      {!showAddForm && !editingAddressId && (
        <Button variant="outline" onClick={() => setShowAddForm(true)} className="w-full">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add new address
        </Button>
      )}
    </div>
  )
}

