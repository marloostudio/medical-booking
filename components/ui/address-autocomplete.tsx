"use client"

import { useState, useEffect, useRef } from "react"
import { Label } from "./label"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"

export interface AddressDetails {
  fullAddress: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export function AddressAutocomplete({
  onAddressSelect,
  label = "Address",
  placeholder = "Enter an address",
  defaultValue = "",
  required = false,
  className,
}: AddressAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const fetchPredictions = async (input: string) => {
    if (!input || input.length < 3) {
      setPredictions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/maps?query=${encodeURIComponent(input)}`)
      const data = await response.json()

      if (data.predictions) {
        setPredictions(data.predictions)
      } else {
        setPredictions([])
      }
    } catch (error) {
      console.error("Error fetching address predictions:", error)
      setPredictions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (input: string) => {
    setValue(input)

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchPredictions(input)
    }, 300)
  }

  const handleSelectAddress = async (prediction: Prediction) => {
    setValue(prediction.description)

    try {
      const response = await fetch(`/api/maps/details?placeId=${prediction.place_id}`)
      const data = await response.json()

      if (data.result && data.result.address_components) {
        const addressComponents = data.result.address_components
        const streetNumber =
          addressComponents.find((component) => component.types.includes("street_number"))?.long_name || ""
        const route = addressComponents.find((component) => component.types.includes("route"))?.long_name || ""
        const street = `${streetNumber} ${route}`.trim()
        const city = addressComponents.find((component) => component.types.includes("locality"))?.long_name || ""
        const state =
          addressComponents.find((component) => component.types.includes("administrative_area_level_1"))?.short_name ||
          ""
        const postalCode =
          addressComponents.find((component) => component.types.includes("postal_code"))?.long_name || ""
        const country = addressComponents.find((component) => component.types.includes("country"))?.long_name || ""

        const addressDetails: AddressDetails = {
          fullAddress: prediction.description,
          street: street,
          city: city,
          state: state,
          postalCode: postalCode,
          country: country,
        }
        onAddressSelect(addressDetails)
      } else {
        onAddressSelect({
          fullAddress: prediction.description,
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        })
      }
    } catch (error) {
      console.error("Error fetching address details:", error)
      onAddressSelect({
        fullAddress: prediction.description,
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      })
    }
    setOpen(false)
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div className={cn("grid w-full items-center gap-1.5", className)}>
      {label && (
        <Label htmlFor="address">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {value ? value : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search address..." value={value} onValueChange={handleInputChange} />
            <CommandList>
              <CommandEmpty>{loading ? "Loading..." : "No address found."}</CommandEmpty>
              <CommandGroup>
                {predictions.map((prediction) => (
                  <CommandItem
                    key={prediction.place_id}
                    value={prediction.description}
                    onSelect={() => handleSelectAddress(prediction)}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value === prediction.description ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex flex-col">
                      <span>{prediction.structured_formatting.main_text}</span>
                      <span className="text-sm text-muted-foreground">
                        {prediction.structured_formatting.secondary_text}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: AddressDetails) => void
  label?: string
  placeholder?: string
  defaultValue?: string
  required?: boolean
  className?: string
}

interface Prediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}
