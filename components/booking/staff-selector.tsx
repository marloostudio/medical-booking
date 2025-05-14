"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface StaffMember {
  id: string
  name: string
  role: string
  specialties?: string[]
  imageUrl?: string
}

interface StaffSelectorProps {
  staffMembers: StaffMember[]
  onSelect: (staffId: string) => void
  selectedStaffId?: string
  appointmentTypeId?: string
}

export function StaffSelector({ staffMembers, onSelect, selectedStaffId, appointmentTypeId }: StaffSelectorProps) {
  const [loading, setLoading] = useState(false)

  // Filter staff members based on appointment type if needed
  // This would be expanded with actual filtering logic based on staff capabilities
  const filteredStaffMembers = staffMembers

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select a Provider</h3>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
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
          {filteredStaffMembers.map((staff) => (
            <Card
              key={staff.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedStaffId === staff.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelect(staff.id)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={staff.imageUrl || "/placeholder.svg"} alt={staff.name} />
                  <AvatarFallback>
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                  <CardDescription>{staff.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {staff.specialties && staff.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {staff.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={selectedStaffId === staff.id ? "default" : "outline"}
                  onClick={() => onSelect(staff.id)}
                >
                  {selectedStaffId === staff.id ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredStaffMembers.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No providers available for this appointment type.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
