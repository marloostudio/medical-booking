# BookingLink - Medical Appointment Platform

BookingLink is a multi-tenant clinic appointment management platform built with Next.js, Firebase, and Stripe. It supports Super Admins, Clinic Owners, and clinic staff (Admins, Medical Staff, Receptionists).

## Features

- Multi-tenant architecture for managing multiple clinics
- Role-based access control (Super Admin, Clinic Owner, Admin, Medical Staff, Receptionist)
- Appointment scheduling and management
- Patient records management
- SMS and email notifications via Twilio and SendGrid
- Stripe integration for subscription management
- Responsive design for all devices

## Tech Stack

- **Framework**: Next.js with App Router
- **Styling**: TailwindCSS + ShadCN UI
- **Database**: Firebase Firestore (multi-tenant)
- **Auth**: Firebase Authentication
- **Notifications**: Twilio (SMS), SendGrid (email)
- **Payments**: Stripe (subscriptions, usage-based billing)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Firebase account
- Twilio account (for SMS)
- SendGrid account (for email)
- Stripe account (for payments)

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/bookinglink.git
   cd bookinglink
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   # or
   yarn
   \`\`\`

3. Set up environment variables
   Copy the `.env.example` file to `.env.local` and fill in your values:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Run the development server
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
