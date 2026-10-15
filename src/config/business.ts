export const businessInfo = {
  name: "Crownora Group",
  whatsapp: "918299321731",
  phone: "+91 8299321731",
  email: "Khushaldodeja60@gmail.com",
  address: "Lucknow chinhat, Uttarpradesh - 226028",
  workingHours: "Mon - Sat: 8:00 AM - 9:00 PM",
};

export const getWhatsAppLink = (message?: string) =>
  `https://wa.me/${businessInfo.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
