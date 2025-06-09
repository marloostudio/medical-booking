"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TitleMD, BodySM, BodyMD } from "@/components/ui/typography"
import type { AppointmentType, AppointmentCategory } from "@/services/appointment-type-service"

interface AppointmentTypeSelectorProps {
  clinicId: string
  appointmentTypes: AppointmentType[]
  categories: AppointmentCategory[]
  onSelect: (appointmentTypeId: string) => void
  selectedAppointmentTypeId?: string
}

export function AppointmentTypeSelector({
  clinicId,
  appointmentTypes,
  categories,
  onSelect,
  selectedAppointmentTypeId,
}: AppointmentTypeSelectorProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Set initial category if available
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id)
    }
  }, [categories, selectedCategoryId])

  // Filter appointment types by selected category
  const filteredAppointmentTypes = selectedCategoryId
    ? appointmentTypes.filter((type) => type.categoryId === selectedCategoryId)
    : appointmentTypes

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategoryId(category.id)}
            className="mb-2"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointmentTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedAppointmentTypeId === type.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelect(type.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{type.name}</CardTitle>
                <CardDescription>{type.duration} minutes</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <BodySM className="text-gray-600">{type.description}</BodySM>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full">
                  {type.price ? (
                    <TitleMD className="font-semibold">${type.price.toFixed(2)}</TitleMD>
                  ) : (
                    <TitleMD>Price varies</TitleMD>
                  )}
                  <Button
                    variant={selectedAppointmentTypeId === type.id ? "default" : "outline"}
                    onClick={() => onSelect(type.id)}
                  >
                    {selectedAppointmentTypeId === type.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {filteredAppointmentTypes.length === 0 && (
            <div className="col-span-full text-center py-8">
              <BodyMD className="text-gray-500">No appointment types available for this category.</BodyMD>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
