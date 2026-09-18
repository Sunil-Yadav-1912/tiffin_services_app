import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import { businessInfo } from "@/config/business";
import { WhatsAppQR } from "@/components/WhatsAppQR";
import { submitEnquiry } from "@/services/apiService";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("matka_customer_name");
    const savedPhone = localStorage.getItem("matka_customer_phone");
    const savedEmail = localStorage.getItem("matka_customer_email");
    
    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (!phone.trim() || phone.length < 10) return setError("Please enter a valid phone number.");
    if (!message.trim()) return setError("Please enter a message.");

    setIsSubmitting(true);

    localStorage.setItem("matka_customer_name", name.trim());
    localStorage.setItem("matka_customer_phone", phone.trim());
    localStorage.setItem("matka_customer_email", email.trim());

    await submitEnquiry({
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      type: "contact_form"
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    setMessage(""); // clear message after sending

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <main className="pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-foreground/70 text-lg">Have a question or want to place a bulk order? Reach out to us and we'll get back to you promptly.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          
          {/* Left Column: Form & Info */}
          <div className="space-y-8">
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold mb-6">Send an Enquiry</h2>
              
              {isSubmitted ? (
                <div className="rounded-2xl bg-brand/10 p-6 text-center text-brand-deep">
                  <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                  <p className="text-sm">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-500/10 p-3 text-sm font-semibold text-red-600">
                      {error}
                    </div>
                  )}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1.5">Full Name *</label>
                    <input required type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="block w-full rounded-xl border-0 bg-foreground/5 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" placeholder="John Doe" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground/80 mb-1.5">Phone Number *</label>
                      <input required type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full rounded-xl border-0 bg-foreground/5 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1.5">Email (Optional)</label>
                      <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full rounded-xl border-0 bg-foreground/5 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-1.5">Message *</label>
                    <textarea required id="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} className="block w-full rounded-xl border-0 bg-foreground/5 py-2.5 px-4 text-sm text-foreground ring-1 ring-inset ring-foreground/10 focus:ring-2 focus:ring-inset focus:ring-brand" placeholder="How can we help you?"></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="mt-2 w-full rounded-xl bg-brand-deep py-3 text-sm font-bold text-primary-foreground shadow-lg transition hover:bg-brand disabled:opacity-70">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 text-brand shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-sm">Address</p>
                    <p className="text-sm text-foreground/70">{businessInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 text-brand shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-sm text-foreground/70">{businessInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 text-brand shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <p className="text-sm text-foreground/70">{businessInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 text-brand shrink-0" size={18} />
                  <div>
                    <p className="font-semibold text-sm">Working Hours</p>
                    <p className="text-sm text-foreground/70">{businessInfo.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: WhatsApp QR */}
          <div className="lg:sticky lg:top-24">
            <WhatsAppQR />
          </div>

        </div>
      </div>
    </main>
  );
}
