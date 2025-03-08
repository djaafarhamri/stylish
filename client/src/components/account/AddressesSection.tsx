import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import AddressForm from "./AddressForm"
import { AuthService } from "../../services/auth-service"
import { Address } from "../../types/api"

export default function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([])

  const getAddresses = async() => {
    try {
      const data = await AuthService.getMyAddresses()
      setAddresses(data.addresses)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAddresses()
  }, [])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const handleDelete = async (id: string) => {
    try {
      const data = await AuthService.deleteAddress(id);
      if (data.status) {
        setAddresses((prevAddresses) => 
          prevAddresses
            .filter((address) => address.id !== id)
            .map((address) => ({
              ...address,
              isDefault: data.default ? address.id === data.default : address.isDefault,
            }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleSetDefault = async(id: string) => {
    try {
      const data = await AuthService.setDefaultAddress(id)
      if (data.status) {
        setAddresses(
          addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
          })),
        )
      }
    } catch (error) {
      console.log(error)
    }
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
          setAddresses={setAddresses}
          address={editingAddressId ? addresses.find((a) => a.id === editingAddressId) : undefined}
          length={addresses.length}
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

