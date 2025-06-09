"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, Loader2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddressDetails {
  street: string
  unit: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface EnhancedAddressInputProps {
  value: AddressDetails
  onChange: (value: AddressDetails) => void
  className?: string
  required?: boolean
  disabled?: boolean
}

export function EnhancedAddressInput({
  value,
  onChange,
  className,
  required = false,
  disabled = false,
}: EnhancedAddressInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle changes to individual address fields
  const handleFieldChange = (field: keyof AddressDetails, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    })
  }

  // Fetch address suggestions from our secure endpoint
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/maps/secure-autocomplete?query=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.predictions) {
        setSuggestions(data.predictions)
      } else {
        setSuggestions([])
      }
    } catch (err) {
      console.error("Failed to fetch address suggestions:", err)
      setError("Failed to load address suggestions. Please enter manually.")
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  // Handle input change in the autocomplete field
  const handleInputChange = (query: string) => {
    setInputValue(query)
    fetchSuggestions(query)
  }

  // Get address details from place_id
  const getAddressDetails = async (placeId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/maps/details?placeId=${placeId}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error || !data.result) {
        throw new Error(data.error || "Failed to get address details")
      }

      // Parse the address components
      const addressComponents = data.result.address_components || []
      const formattedAddress = data.result.formatted_address || ""

      // Initialize address details
      const addressDetails: AddressDetails = {
        street: "",
        unit: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      }

      // Extract street number and route (street name)
      const streetNumber = addressComponents.find((c) => c.types.includes("street_number"))?.long_name || ""
      const route = addressComponents.find((c) => c.types.includes("route"))?.long_name || ""
      addressDetails.street = streetNumber ? `${streetNumber} ${route}` : route

      // Extract other components
      addressComponents.forEach((component) => {
        if (component.types.includes("subpremise")) {
          addressDetails.unit = component.long_name
        } else if (component.types.includes("locality") || component.types.includes("sublocality")) {
          addressDetails.city = component.long_name
        } else if (component.types.includes("administrative_area_level_1")) {
          addressDetails.state = component.short_name
        } else if (component.types.includes("postal_code")) {
          addressDetails.postalCode = component.long_name
        } else if (component.types.includes("country")) {
          addressDetails.country = component.long_name
        }
      })

      // Update the form with the parsed address
      onChange(addressDetails)

      // Update the input field with the formatted address
      setInputValue(formattedAddress)
    } catch (err) {
      console.error("Failed to get address details:", err)
      setError("Failed to get address details. Please enter manually.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  // Handle selection of an address from the suggestions
  const handleSelectAddress = (suggestion: { description: string; place_id: string }) => {
    getAddressDetails(suggestion.place_id)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label className="text-base font-medium">Address {required && <span className="text-red-500">*</span>}</Label>

        {/* Autocomplete field */}
        <div className="relative">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Search for your address"
                  disabled={disabled}
                  className="pr-10"
                  onFocus={() => inputValue.length >= 3 && setOpen(true)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setOpen(!open)}
                  type="button"
                  disabled={disabled}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
              <Command>
                <CommandList>
                  {error ? (
                    <CommandEmpty className="py-6 text-center text-sm">
                      <div className="text-red-500 mb-2">{error}</div>
                      <div>Please enter your address manually below</div>
                    </CommandEmpty>
                  ) : loading ? (
                    <CommandEmpty className="py-6 text-center text-sm">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                      Loading suggestions...
                    </CommandEmpty>
                  ) : (
                    <>
                      <CommandEmpty className="py-6 text-center text-sm">
                        No address found. Please continue typing...
                      </CommandEmpty>
                      <CommandGroup>
                        {suggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion.place_id}
                            value={suggestion.description}
                            onSelect={() => handleSelectAddress(suggestion)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                inputValue === suggestion.description ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {suggestion.description}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <p className="text-sm text-muted-foreground">Search for your address above or enter details manually below</p>
      </div>

      {/* Individual address fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={value.street}
            onChange={(e) => handleFieldChange("street", e.target.value)}
            placeholder="123 Main St"
            disabled={disabled}
            required={required}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Apartment/Suite/Unit</Label>
          <Input
            id="unit"
            value={value.unit}
            onChange={(e) => handleFieldChange("unit", e.target.value)}
            placeholder="Apt 4B"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={value.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            placeholder="New York"
            disabled={disabled}
            required={required}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            value={value.state}
            onChange={(e) => handleFieldChange("state", e.target.value)}
            placeholder="NY"
            disabled={disabled}
            required={required}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">ZIP/Postal Code</Label>
          <Input
            id="postalCode"
            value={value.postalCode}
            onChange={(e) => handleFieldChange("postalCode", e.target.value)}
            placeholder="10001"
            disabled={disabled}
            required={required}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={value.country}
            onChange={(e) => handleFieldChange("country", e.target.value)}
            placeholder="United States"
            disabled={disabled}
            required={required}
          />
        </div>
      </div>
    </div>
  )
}
