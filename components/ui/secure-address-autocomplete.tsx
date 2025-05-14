"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function SecureAddressAutocomplete({
  value,
  onChange,
  label = "Address",
  placeholder = "Enter your address",
  required = false,
  disabled = false,
  className,
}: AddressAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || "")
  const [suggestions, setSuggestions] = useState<{ description: string; place_id: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Update input value when value prop changes
    if (value !== inputValue) {
      setInputValue(value || "")
    }
  }, [value])

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Use our secure server endpoint instead of calling Google directly
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setInputValue(query)
    onChange(query) // Update the form value

    // Debounce API calls
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query)
    }, 300)
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    onChange(suggestion)
    setOpen(false)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="address" className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id="address"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              className="w-full"
              onFocus={() => inputValue.length >= 3 && setOpen(true)}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setOpen(!open)}
              type="button"
              disabled={disabled}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronsUpDown className="h-4 w-4" />}
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" sideOffset={5}>
          <Command>
            <CommandList>
              {error ? (
                <CommandEmpty className="py-6 text-center text-sm">
                  <div className="text-red-500 mb-2">{error}</div>
                  <div>Please type your address manually</div>
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
                        onSelect={handleSelectSuggestion}
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
  )
}
