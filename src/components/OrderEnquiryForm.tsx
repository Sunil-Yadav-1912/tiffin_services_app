import { useState, useEffect } from "react";
import { submitEnquiry } from "@/services/apiService";
import { createWhatsAppOrderLink, OrderDetails } from "@/utils/whatsapp";

interface OrderEnquiryFormProps {
  tiffinId: string;
  tiffinName: string;
  tiffinPrice: number;
  availableMeals: string; // "Lunch", "Dinner", or "Both"
}

export function OrderEnquiryForm({ tiffinId, tiffinName, tiffinPrice, availableMeals }: OrderEnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [meal, setMeal] = useState(availableMeals === "Both" ? "Lunch" : availableMeals);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load saved details on mount
  useEffect(() => {
    const savedName = localStorage.getItem("matka_customer_name");
    const savedPhone = localStorage.getItem("matka_customer_phone");
    const savedAddress = localStorage.getItem("matka_customer_address");
    
    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
    if (savedAddress) setAddress(savedAddress);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic Validation
    if (!name.trim()) return setError("Please enter your name.");
    if (!phone.trim() || phone.length < 10) return setError("Please enter a valid phone number.");
    if (quantity < 1) return setError("Quantity must be at least 1.");
    if (!address.trim()) return setError("Please enter your delivery area or address.");

    setIsSubmitting(true);

    // Save to local storage for convenience next time
    localStorage.setItem("matka_customer_name", name.trim());
    localStorage.setItem("matka_customer_phone", phone.trim());
    localStorage.setItem("matka_customer_address", address.trim());

    const orderDetails: OrderDetails = {
      customerName: name.trim(),
      phone: phone.trim(),
      tiffinName,
      tiffinPrice,
      quantity,
      meal,
      address: address.trim(),
      message: message.trim(),
    };

    // 1. Submit to optional endpoint (does not block on failure)
    await submitEnquiry({
      tiffinId,
      ...orderDetails
    });

    setSuccess(true);
    setIsSubmitting(false);

    // 2. Open WhatsApp
    const waLink = createWhatsAppOrderLink(orderDetails);
    window.open(waLink, "_blank");
    
    // Reset success state after a few seconds
    setTimeout(() => setSuccess(false), 5000);
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-[#25D366]/10 p-6 text-center text-[#128C7E] ring-1 ring-[#25D366]/30">
        <h3 className="font-display text-xl font-bold mb-2">Redirecting to WhatsApp...</h3>
        <p className="text-sm">If WhatsApp doesn't open automatically, please ensure you don't have popups blocked.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs font-semibold underline underline-offset-2"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-500/10 p-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1.5">Name *</label>
          <input 
            required type="text" id="name" value={name} onChange={e => setName(e.target.value)}
            className="block w-full rounded-xl border-0 bg-background/50 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" 
            placeholder="Your name" 
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground/80 mb-1.5">Mobile Number *</label>
          <input 
            required type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)}
            className="block w-full rounded-xl border-0 bg-background/50 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" 
            placeholder="+91" 
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-foreground/80 mb-1.5">Quantity *</label>
          <input 
            required type="number" min="1" id="quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)}
            className="block w-full rounded-xl border-0 bg-background/50 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" 
          />
        </div>
        <div>
          <label htmlFor="meal" className="block text-sm font-medium text-foreground/80 mb-1.5">Preferred Meal *</label>
          <select 
            id="meal" value={meal} onChange={e => setMeal(e.target.value)}
            className="block w-full rounded-xl border-0 bg-background/50 py-3 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand"
          >
            {availableMeals === "Both" ? (
              <>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </>
            ) : (
              <option value={availableMeals}>{availableMeals}</option>
            )}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-foreground/80 mb-1.5">Delivery Area / Address *</label>
        <input 
          required type="text" id="address" value={address} onChange={e => setAddress(e.target.value)}
          className="block w-full rounded-xl border-0 bg-background/50 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" 
          placeholder="e.g. Shivaji Nagar" 
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-1.5">Additional Message (Optional)</label>
        <textarea 
          id="message" rows={2} value={message} onChange={e => setMessage(e.target.value)}
          className="block w-full rounded-xl border-0 bg-background/50 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" 
          placeholder="Less spicy, allergy info, etc."
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-deep py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-brand disabled:opacity-70"
      >
        {isSubmitting ? "Processing..." : "Continue to WhatsApp"}
      </button>
      <p className="mt-2 text-center text-[11px] text-foreground/50">
        You won't be charged yet. You will confirm your order with us on WhatsApp.
      </p>
    </form>
  );
}
