import bharoshaImage from "@/assets/bharosha-plan.jpg";
import gharKaSwadImage from "@/assets/ghar-ka-swad.jpg";
import lightPlateImage from "@/assets/light-plate.jpg";

export type MealType = "Lunch" | "Dinner" | "Both";
export type DietType = "Veg" | "Non-Veg" | "Jain";
export type Category = "Daily" | "Premium" | "Diet" | "Special";

export interface Tiffin {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  mealType: MealType;
  dietType: DietType;
  category: Category;
  itemsIncluded: string[];
  isAvailable: boolean;
  featured?: boolean;
}

export const tiffins: Tiffin[] = [
  {
    id: "classic-veg",
    name: "Classic Veg Tiffin",
    price: 180,
    description: "Balanced veg thali — dal, sabzi, rice or roti, salad and a sweet.",
    longDescription: "Our Classic Veg Tiffin is perfect for your daily lunch needs. It features a rotating menu of seasonal vegetables, perfectly cooked dal, and your choice of phulkas or rice. Prepared with minimal oil and authentic spices to give you that comforting home-cooked feeling.",
    image: bharoshaImage,
    mealType: "Lunch",
    dietType: "Veg",
    category: "Daily",
    itemsIncluded: ["1 Dry Sabzi", "1 Gravy/Dal", "4 Phulkas or Rice", "Salad", "1 Sweet"],
    isAvailable: true,
    featured: false,
  },
  {
    id: "deluxe-veg",
    name: "Deluxe Veg Tiffin",
    price: 240,
    description: "Full course with a premium paneer sabzi, dal, rice, roti and sweet.",
    longDescription: "Treat yourself to our Deluxe Veg Tiffin. Featuring premium ingredients like Paneer or Mushroom, this meal is designed for those who want a heavier, richer lunch experience without compromising on the homemade taste and hygiene.",
    image: gharKaSwadImage,
    mealType: "Both",
    dietType: "Veg",
    category: "Premium",
    itemsIncluded: ["1 Premium Paneer Sabzi", "1 Seasonal Veg", "Dal Tadka", "3 Butter Rotis & Jeera Rice", "Papad & Pickle", "Special Sweet"],
    isAvailable: true,
    featured: true,
  },
  {
    id: "jain-special",
    name: "Jain Special Tiffin",
    price: 200,
    description: "Strictly prepared Jain meals without onion, garlic, or root vegetables.",
    longDescription: "Our Jain Special Tiffin is prepared with strict adherence to Jain dietary guidelines in a separate, sanitized kitchen section. Absolutely no root vegetables, onion, or garlic are used. We use pure ghee and fresh spices to ensure maximum flavor.",
    image: bharoshaImage, // Reusing image for now, can be updated later
    mealType: "Both",
    dietType: "Jain",
    category: "Daily",
    itemsIncluded: ["1 Jain Sabzi", "Jain Dal", "4 Phulkas", "Rice", "Roasted Papad"],
    isAvailable: true,
  },
  {
    id: "light-diet",
    name: "Light Diet Plate",
    price: 150,
    description: "Gentle, light meals — khichdi, soups, and single sabzi for lighter days.",
    longDescription: "Designed for health-conscious individuals or those recovering from illness. The Light Diet Plate is extremely low in oil and spices, focusing on easily digestible items like moong dal khichdi, clear soups, and steamed vegetables.",
    image: lightPlateImage,
    mealType: "Dinner",
    dietType: "Veg",
    category: "Diet",
    itemsIncluded: ["Moong Dal Khichdi", "Clear Soup / Kadhi", "Steamed Veggies", "Cucumber Salad"],
    isAvailable: true,
  },
  {
    id: "punjabi-feast",
    name: "Punjabi Feast",
    price: 260,
    description: "Authentic Punjabi flavors featuring Chole, Rajma, and rich gravies.",
    longDescription: "Experience the robust flavors of Punjab with our special feast. Featuring classics like Chole Masala, Rajma Chawal, or Dal Makhani, paired with soft kulchas or parathas. Perfect for when you're craving a satisfying, spicy meal.",
    image: gharKaSwadImage, // Reusing image
    mealType: "Lunch",
    dietType: "Veg",
    category: "Special",
    itemsIncluded: ["Special Punjabi Gravy (Chole/Rajma)", "Dal Makhani", "2 Parathas / Kulchas", "Jeera Rice", "Onion Salad & Pickle"],
    isAvailable: true,
  },
  {
    id: "mini-tiffin",
    name: "Mini Student Tiffin",
    price: 120,
    description: "Compact and affordable meal perfect for students or small appetites.",
    longDescription: "A pocket-friendly option designed specifically for students or those with a smaller appetite. It provides just the right amount of nutrition and homemade goodness to keep you going through your study or work day without feeling heavy.",
    image: lightPlateImage, // Reusing image
    mealType: "Lunch",
    dietType: "Veg",
    category: "Daily",
    itemsIncluded: ["1 Sabzi", "3 Phulkas", "Small Portion Rice", "Pickle"],
    isAvailable: true,
  }
];
