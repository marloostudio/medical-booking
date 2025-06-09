# BookingLink - Medical Appointment Platform

BookingLink is a multi-tenant clinic appointment management platform built with Next.js, Firebase, and Stripe. It supports Super Admins, Clinic Owners, and clinic staff (Admins, Medical Staff, Receptionists).

## Features

- Multi-tenant architecture for managing multiple clinics
- Role-based access control
- Appointment scheduling and management
- Patient records management
- SMS and email notifications
- Secure authentication with Google and email/password
- Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: TailwindCSS + ShadCN UI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Notifications**: Twilio (SMS), SendGrid (email)
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account
- Twilio account (for SMS)
- Stripe account (for payments)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/bookinglink.git
   cd bookinglink
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn
   \`\`\`

3. Create a `.env.local` file based on `.env.example` and fill in your environment variables.

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version

Current version: V4
