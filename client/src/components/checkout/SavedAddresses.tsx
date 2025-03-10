import { Check, Home, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Address } from "../../types/api"



export type AddressOption = "saved" | "new"

interface SavedAddressesProps {
  selectedOption: AddressOption
  onOptionChange: (option: AddressOption) => void
  selectedAddressId: string
  onAddressSelect: (addressId: string) => void
  addresses: Address[]
}

export default function SavedAddresses({
  selectedOption,
  onOptionChange,
  selectedAddressId,
  onAddressSelect,
  addresses
}: SavedAddressesProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedOption}
        onValueChange={(value) => onOptionChange(value as AddressOption)}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="saved" id="saved-address" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="saved-address" className="font-medium">
              Use a saved address
            </Label>
            {selectedOption === "saved" && (
              <div className="mt-3 grid gap-3">
                {addresses.map((address) => (
                  <Card
                    key={address.id}
                    className={`cursor-pointer transition-colors ${
                      selectedAddressId === address.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                    }`}
                    onClick={() => onAddressSelect(address.id || "")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Home className="mt-0.5 h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{address.name}</p>
                              {address.isDefault && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{address.street}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.country}</p>
                          </div>
                        </div>
                        {selectedAddressId === address.id && (
                          <div className="rounded-full bg-primary p-1 text-primary-foreground">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <RadioGroupItem value="new" id="new-address" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="new-address" className="font-medium">
              Add a new address
            </Label>
            <p className="text-sm text-muted-foreground">Enter a new shipping address for this order</p>
          </div>
        </div>
      </RadioGroup>

      {selectedOption === "saved" && (
        <Button variant="outline" className="mt-2" onClick={() => onOptionChange("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      )}
    </div>
  )
}

