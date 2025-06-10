import { Calendar } from "@/components/ui/calendar"
// Bundle analysis utilities
export const analyzeBundleSize = () => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Log bundle information in development
    console.group("📦 Bundle Analysis")
    console.log("Client-side bundle loaded")
    console.log("Firebase client initialized:", !!window.firebase)
    console.log("Date utilities loaded:", !!Date)
    console.groupEnd()
  }
}

// Lazy loading utilities
export const lazyImport = <T>(importFn: () => Promise<T>): Promise<T> => {
  return importFn()
}

// Dynamic imports for heavy components
export const dynamicImports = {
  // Calendar components (heavy due to date calculations)
  Calendar: () => import('@/components/ui/calendar'),
  
  // Chart components (heavy due to visualization libraries)
  Chart: () => import('@/components/ui/chart'),
  
  // Rich text editor (heavy due to editor libraries)
  RichTextEditor: () => import('@/components/ui/rich-text-editor'),
  
  // PDF viewer (heavy due to PDF.js)
  PDFViewer: () => import('@/components/ui/pdf-viewer'),
  
  // Image editor (heavy due to canvas operations)
  ImageEditor: () => import('@/components/ui/image-editor'),
  
  // Video player (heavy due to video libraries)
  VideoPlayer: () => import('@/components/ui/video-player'),
  
  // Map components (heavy due to mapping libraries)
  Map: () => import('@/components/ui/map'),
  
  // Data table with advanced features (heavy due to virtualization)
  DataTable: () => import('@/components/ui/data-table-advanced'),
}

// Code splitting for routes
export const routeImports = {
  Dashboard: () => import('@/app/dashboard/page'),
  Appointments: () => import('@/app/dashboard/appointments/page'),
  Patients: () => import('@/app/dashboard/patients/page'),
  Staff: () => import('@/app/dashboard/staff/page'),
  Settings: () => import('@/app/dashboard/settings/page'),
  Reports: () => import('@/app/dashboard/reports/page'),
  Billing: () => import('@/app/dashboard/billing/page'),
}
