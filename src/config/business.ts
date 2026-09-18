export const businessInfo = {
  name: "Matka Tiffin Service",
  whatsapp: "919028027397",
  phone: "+91 9028027397",
  email: "yadavsunilkumar998@gmail.com",
  address: "Shivaji Nagar, Pune, Maharashtra",
  workingHours: "Mon - Sat: 8:00 AM - 9:00 PM",
};

export const getWhatsAppLink = (message?: string) =>
  `https://wa.me/${businessInfo.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
