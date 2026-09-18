export async function submitEnquiry(data: Record<string, any>): Promise<boolean> {
  const endpoint = import.meta.env.VITE_ORDER_ENDPOINT;

  // If no endpoint is configured, just return success immediately.
  // This ensures the app works perfectly as a static site without a backend.
  if (!endpoint) {
    console.log("No VITE_ORDER_ENDPOINT configured. Skipping API submission.");
    return true;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, source: "website" }),
    });

    if (!response.ok) {
      console.warn("API submission returned a non-ok status:", response.status);
      // We return true anyway so the user can still proceed to WhatsApp
      return true;
    }

    return true;
  } catch (error) {
    console.error("Failed to submit enquiry to endpoint:", error);
    // Return true even on failure so the WhatsApp flow isn't broken for the customer
    return true;
  }
}
