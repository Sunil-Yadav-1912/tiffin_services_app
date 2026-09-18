import { businessInfo } from "@/config/business";

export interface OrderDetails {
  customerName: string;
  phone: string;
  tiffinName: string;
  tiffinPrice: number;
  quantity: number;
  meal: string;
  address: string;
  message?: string;
}

export function createWhatsAppOrderLink(order: OrderDetails): string {
  const text = `Hello, I would like to place an order.

*Customer:* ${order.customerName}
*Phone:* ${order.phone}
*Tiffin:* ${order.tiffinName}
*Price:* ₹${order.tiffinPrice}
*Quantity:* ${order.quantity}
*Meal:* ${order.meal}
*Delivery Area:* ${order.address}
${order.message ? `*Message:* ${order.message}\n` : ""}
Please confirm today's availability and share the next steps.`;

  return `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function createWhatsAppContactLink(name: string, message: string): string {
  const text = `Hello, this is ${name}.
  
${message}`;
  return `https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(text)}`;
}
