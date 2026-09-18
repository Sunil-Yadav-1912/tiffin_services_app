# Matka Tiffin Service - Frontend App

This is a premium, static-first React/Vite application for a Tiffin Service. It acts as a complete frontend foundation that allows customers to browse tiffins and place orders directly through WhatsApp.

## Key Features

- **Static-First**: Runs perfectly without a backend server.
- **Mobile-First Design**: Exceptional UX on mobile devices, including a sticky bottom action bar.
- **WhatsApp Integration**: Generates deep links to WhatsApp with pre-filled order details.
- **Optional API Storage**: Can submit enquiries to a serverless endpoint (e.g., Google Apps Script/Sheets) if configured.
- **PWA-Ready**: Contains `manifest.json` and meta tags for Progressive Web App installation.

## Project Setup

Make sure you have Node.js installed.

1. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
   *The built files will be in the `.output/public` or `dist` directory, ready to be hosted on Netlify, Vercel, or any static hosting provider.*

## How to Customize

### Business Information (WhatsApp Number, Address, etc.)
Edit `src/config/business.ts`. All WhatsApp buttons and QR codes will automatically use the number provided here.

```typescript
export const businessInfo = {
  name: "Matka Tiffin Service",
  whatsapp: "919876543210", // No '+', just country code + number
  phone: "+91 98765 43210",
  email: "hello@matkatiffins.com",
  address: "Shivaji Nagar, Pune, Maharashtra",
  workingHours: "Mon - Sat: 8:00 AM - 9:00 PM",
};
```

### Tiffins and Prices
Edit `src/data/tiffins.ts`. Add, remove, or modify the tiffins here. The `/tiffins` catalog and `/tiffins/$id` detail pages render dynamically based on this array.

### Images
Store new images in `src/assets/` and import them in `src/data/tiffins.ts`.

## Optional Backend Integration (Google Sheets / Apps Script)

The application can optionally save order enquiries to a serverless endpoint before redirecting to WhatsApp.

1. Create a `.env` file in the root of the project.
2. Add your endpoint URL:
   ```env
   VITE_ORDER_ENDPOINT=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

If this variable is present, `src/services/apiService.ts` will `POST` the form data to it. If it fails, or if the variable is not set, the app gracefully skips this step and proceeds directly to WhatsApp, ensuring the customer is never blocked.

## Future Migration (APK / Full Backend)

- **APK/Capacitor**: The UI is built to be touch-friendly with no hover-only dependencies. You can easily wrap this React app in Capacitor to generate an Android APK.
- **Full Backend**: If you ever want to add a shopping cart, payments, or user authentication, you can replace `apiService.ts` with your actual Laravel/FastAPI logic. The frontend components (OrderEnquiryForm) are already decoupled from the submission logic.
