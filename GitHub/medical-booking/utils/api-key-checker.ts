/**
 * Utility to check if required API keys are present
 * This file should only be imported in server components or API routes
 */

export const checkGoogleMapsApiKey = () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error("Google Maps API key is missing. Maps functionality will not work.")
    return false
  }

  return true
}

export const checkTwilioApiKeys = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !phoneNumber) {
    console.error("Twilio API keys are missing. SMS functionality will not work.")
    return false
  }

  return true
}

export const checkStripeApiKeys = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !publishableKey || !webhookSecret) {
    console.error("Stripe API keys are missing. Payment functionality will not work.")
    return false
  }

  return true
}

export const checkSendGridApiKey = () => {
  const apiKey = process.env.SENDGRID_API_KEY

  if (!apiKey) {
    console.error("SendGrid API key is missing. Email functionality will not work.")
    return false
  }

  return true
}

export const checkAllApiKeys = () => {
  const googleMapsApiKeyPresent = checkGoogleMapsApiKey()
  const twilioApiKeysPresent = checkTwilioApiKeys()
  const stripeApiKeysPresent = checkStripeApiKeys()
  const sendGridApiKeyPresent = checkSendGridApiKey()

  return {
    googleMapsApiKeyPresent,
    twilioApiKeysPresent,
    stripeApiKeysPresent,
    sendGridApiKeyPresent,
    allKeysPresent: googleMapsApiKeyPresent && twilioApiKeysPresent && stripeApiKeysPresent && sendGridApiKeyPresent,
  }
}
