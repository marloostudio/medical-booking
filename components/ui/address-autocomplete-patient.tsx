"use client"

import { useState, useEffect, useRef } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddressAutocompletePatientProps {
  onAddressSelect: (address: string, placeId?: string) => void
  defaultValue?: string
  className?: string
  placeholder?: string
  label?: string
  required?: boolean
  error?: string
}

export function AddressAutocompletePatient({
  onAddressSelect,
  defaultValue = "",
  className,
  placeholder = "Search for an address...",
  label = "Address",
  required = false,
  error,
}: AddressAutocompletePatientProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [apiError, setApiError] = useState<string | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setApiError(null)

    try {
      // Use our server API route instead of directly calling Google's API
      const response = await fetch(`/api/maps?query=${encodeURIComponent(query)}`)

      if (!response.ok) {
        // Get more details from the error response
        const errorData = await response.text()
        console.error("Maps API error response:", errorData)

        setApiError(`Error ${response.status}: Failed to fetch address suggestions`)
        setSuggestions([])
        return
      }

      const data = await response.json()

      // Check if the API returned an error status
      if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        console.error("Google Maps API error:", data.status, data.error_message)
        setApiError(`Google API error: ${data.status}`)
        setSuggestions([])
        return
      }

      setSuggestions(data.predictions || [])
    } catch (error) {
      console.error("Error fetching address suggestions:", error)
      setApiError("Failed to connect to address service")
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (query: string) => {
    setInputValue(query)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query)
    }, 300)
  }

  const handleSelect = (selectedAddress: string, placeId?: string) => {
    setValue(selectedAddress)
    setOpen(false)
    onAddressSelect(selectedAddress, placeId)
  }

  // Allow manual entry if API fails
  const handleManualEntry = () => {
    if (inputValue) {
      setValue(inputValue)
      setOpen(false)
      onAddressSelect(inputValue, undefined)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", error ? "border-red-500 focus:ring-red-500" : "", className)}
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={placeholder} value={inputValue} onValueChange={handleInputChange} />
            <CommandList>
              {loading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              )}

              {!loading && apiError && (
                <div className="p-2">
                  <div className="rounded-md bg-red-50 p-2 mb-2">
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-sm"
                    onClick={handleManualEntry}
                    disabled={!inputValue}
                  >
                    Use as manual entry
                  </Button>
                </div>
              )}

              {!loading && !apiError && suggestions.length === 0 && <CommandEmpty>No addresses found.</CommandEmpty>}

              {!loading && !apiError && suggestions.length > 0 && (
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.place_id}
                      value={suggestion.description}
                      onSelect={() => handleSelect(suggestion.description, suggestion.place_id)}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", value === suggestion.description ? "opacity-100" : "opacity-0")}
                      />
                      {suggestion.description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
