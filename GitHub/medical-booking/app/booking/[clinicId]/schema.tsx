import type { Clinic } from "@/types/clinic"

export function generateClinicSchema(clinic: Clinic) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `https://thebookinglink.com/booking/${clinic.id}`,
    name: clinic.name,
    description: clinic.description,
    url: `https://thebookinglink.com/booking/${clinic.id}`,
    telephone: clinic.phone,
    email: clinic.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.state,
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: clinic.location?.latitude,
      longitude: clinic.location?.longitude,
    },
    openingHoursSpecification: clinic.hours.map((hour) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hour.day,
      opens: hour.open,
      closes: hour.close,
    })),
    medicalSpecialty: clinic.specialties,
  }
}
