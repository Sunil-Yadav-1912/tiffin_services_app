import { useEffect, useMemo, useState } from "react";
import { X, MessageCircle, Smartphone, CheckCircle2, Copy } from "lucide-react";
import { businessInfo } from "@/config/business";

const UPI_NAME = "Crownora Group";

// Each QR is paired with its own UPI ID
const QR_UPI_PAIRS = [
  { qr: "/qr1 (1).jpeg", upiId: "q021641645@ybl" },
  { qr: "/qr1 (2).jpeg", upiId: "q022278460@ybl" },
];

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  amount: number;
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function UPIPaymentModal({
  isOpen,
  onClose,
  customerName,
  amount,
}: UPIPaymentModalProps) {
  const [copied, setCopied] = useState(false);

  // Pick a random QR+UPI pair once when modal opens
  const pair = useMemo(() => {
    return QR_UPI_PAIRS[Math.floor(Math.random() * QR_UPI_PAIRS.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const { qr: qrImage, upiId: UPI_ID } = pair;

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const upiNote = encodeURIComponent(`Tiffin payment - ${customerName}`);
  const upiAmount = amount > 0 ? `&am=${amount}` : "";

  // UPI deep link (works on mobile for most UPI apps)
  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&tn=${upiNote}${upiAmount}&cu=INR`;

  // App-specific intent links (Android)
  const gpayLink = `intent://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&tn=${upiNote}${upiAmount}&cu=INR#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
  const phonepeLink = `intent://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&tn=${upiNote}${upiAmount}&cu=INR#Intent;scheme=upi;package=com.phonepe.app;end`;
  const paytmLink = `intent://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&tn=${upiNote}${upiAmount}&cu=INR#Intent;scheme=upi;package=net.one97.paytm;end`;

  const mobile = isMobileDevice();

  const whatsappMessage = `Hi! I have paid my tiffin bill.%0A%0A*Name:* ${encodeURIComponent(customerName)}%0A*Amount:* ₹${amount}%0A%0APlease confirm my payment. 🙏`;
  const whatsappLink = `https://wa.me/${businessInfo.whatsapp}?text=${whatsappMessage}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="UPI Payment"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl border border-border/40 overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 max-h-[92dvh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Pay via UPI
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Scan QR or tap to open a UPI app
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl bg-foreground/5 hover:bg-foreground/10 transition text-foreground/70"
            aria-label="Close payment modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Amount */}
          {amount > 0 && (
            <div className="text-center bg-brand/5 rounded-2xl py-3 px-4 border border-brand/20">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                Amount Due
              </p>
              <p className="font-display text-4xl font-bold text-brand-deep">
                ₹{amount}
              </p>
            </div>
          )}

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
              Scan with any UPI app
            </p>
            <div className="relative">
              <div className="size-52 rounded-2xl bg-white p-3 ring-2 ring-brand/30 shadow-lg shadow-brand/10 mx-auto">
                <img
                  src={qrImage}
                  alt="UPI Payment QR Code"
                  className="size-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand-deep text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                UPI QR
              </div>
            </div>
          </div>

          {/* UPI ID copy */}
          <div className="flex items-center gap-2 bg-foreground/5 rounded-xl px-4 py-2.5 border border-border/50 mt-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                UPI ID
              </p>
              <p className="text-sm font-mono font-semibold text-foreground truncate">
                {UPI_ID}
              </p>
            </div>
            <button
              onClick={handleCopyUPI}
              className="flex items-center gap-1 text-xs font-bold text-brand-deep hover:text-brand transition"
            >
              {copied ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Copy size={15} />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Mobile UPI App buttons */}
          {mobile && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider text-center">
                Or open directly in your UPI app
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={gpayLink}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 px-3 py-2.5 text-sm font-bold transition hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  <Smartphone size={15} />
                  GPay
                </a>
                <a
                  href={phonepeLink}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400 px-3 py-2.5 text-sm font-bold transition hover:bg-purple-100 dark:hover:bg-purple-900/50"
                >
                  <Smartphone size={15} />
                  PhonePe
                </a>
                <a
                  href={paytmLink}
                  className="flex items-center justify-center gap-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 text-sky-700 dark:text-sky-400 px-3 py-2.5 text-sm font-bold transition hover:bg-sky-100 dark:hover:bg-sky-900/50"
                >
                  <Smartphone size={15} />
                  Paytm
                </a>
                <a
                  href={upiDeepLink}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-3 py-2.5 text-sm font-bold transition hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                >
                  <Smartphone size={15} />
                  Any UPI App
                </a>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-xs font-semibold text-muted-foreground">
              After paying
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          {/* WhatsApp Confirmation */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            id="payment-whatsapp-confirm"
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#18a854] transition px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-500/20"
          >
            <MessageCircle size={18} />
            Confirm Payment on WhatsApp
          </a>

          <p className="text-center text-[11px] text-muted-foreground leading-relaxed pb-1">
            After completing the UPI payment, tap the button above to send a
            WhatsApp confirmation to us. This helps us process your payment
            faster. 🙏
          </p>
        </div>
      </div>
    </div>
  );
}
