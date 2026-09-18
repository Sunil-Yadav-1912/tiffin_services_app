import { QrCode, MessageCircle } from "lucide-react";
import { businessInfo, getWhatsAppLink } from "@/config/business";

export function WhatsAppQR() {
  return (
    <div className="glass-panel flex flex-col items-center justify-center rounded-3xl p-8 text-center shadow-[0_20px_50px_-25px_oklch(0.255_0.045_155_/_20%)]">
      <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand-deep">
        <QrCode size={32} />
      </div>
      <h3 className="font-display text-xl font-bold">Scan to chat on WhatsApp</h3>
      <p className="mt-2 max-w-xs text-sm text-foreground/70">
        Scan this code with your phone's camera, or tap the button below to start an order.
      </p>
      
      {/* Real QR code image using a public generator */}
      <div className="mt-6 flex size-48 items-center justify-center rounded-2xl bg-white p-4 ring-1 ring-foreground/10">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getWhatsAppLink("Hello! I would like to know more about your tiffin services."))}`} 
          alt="WhatsApp QR Code" 
          className="size-full object-contain"
        />
      </div>
      
      <a
        href={getWhatsAppLink("Hello! I would like to know more about your tiffin services.")}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex min-h-12 w-full max-w-[200px] items-center justify-center gap-2 rounded-xl bg-brand-deep px-4 py-3 text-sm font-bold text-primary-foreground transition hover:bg-brand"
      >
        <MessageCircle size={18} />
        <span>Chat Now</span>
      </a>
      
      <div className="mt-6 text-sm font-medium">
        <p className="text-foreground/80">{businessInfo.whatsapp}</p>
        <p className="text-foreground/50">{businessInfo.email}</p>
      </div>
    </div>
  );
}
