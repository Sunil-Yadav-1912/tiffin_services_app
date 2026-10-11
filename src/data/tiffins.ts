export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Both" | "All";
export type DietType = "Veg" | "Non-Veg" | "Jain";
export type Category = "Monthly" | "Daily" | "Premium" | "Diet" | "Special";

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
    id: "1",
    name: "Breakfast (Monthly Plan)",
    price: 1200,
    description: "Hostel monthly breakfast plan (8:30 AM – 9:30 AM)",
    longDescription: "Fresh hot nutritious breakfast served daily between 8:30 AM to 9:30 AM. Rotating menu includes Poha, Upma, Idli Sambhar, Aloo Parathas, and hot tea.",
    image: "/images/veg_breakfast.jpg",
    mealType: "Breakfast",
    dietType: "Veg",
    category: "Monthly",
    itemsIncluded: ["Poha / Upma / Idli / Paratha", "Chutney & Sambhar", "Hot Tea"],
    isAvailable: true,
    featured: true,
  },
  {
    id: "2",
    name: "Lunch (Monthly Plan)",
    price: 1800,
    description: "Hostel monthly lunch plan (12:00 PM – 2:00 PM)",
    longDescription: "Fresh homemade lunch delivered between 12:00 PM to 2:00 PM. Includes 4 fresh phulkas, seasonal vegetable curry, dal tadka, steamed basmati rice, salad, and pickle.",
    image: "/images/veg_lunch.jpg",
    mealType: "Lunch",
    dietType: "Veg",
    category: "Monthly",
    itemsIncluded: ["4 Fresh Phulkas", "Seasonal Sabzi", "Dal Tadka", "Steamed Rice", "Salad & Pickle"],
    isAvailable: true,
    featured: true,
  },
  {
    id: "3",
    name: "Dinner (Monthly Plan)",
    price: 2100,
    description: "Hostel monthly dinner plan (8:00 PM – 9:30 PM)",
    longDescription: "Satisfying dinner served warm between 8:00 PM to 9:30 PM. Includes 4 hot rotis, special evening curry (Paneer / Kofta / Dal Makhani rotations), rice, and salad.",
    image: "/images/veg_dinner.jpg",
    mealType: "Dinner",
    dietType: "Veg",
    category: "Monthly",
    itemsIncluded: ["4 Hot Rotis", "Special Evening Curry", "Dal / Gravy", "Steamed Rice", "Salad"],
    isAvailable: true,
    featured: true,
  },
  {
    id: "4",
    name: "Breakfast + Lunch Combo (Monthly)",
    price: 2800,
    description: "Hostel monthly combo for morning & afternoon meals",
    longDescription: "Complete morning and afternoon nourishment for hostel students. Breakfast (8:30 AM – 9:30 AM) + Full Lunch (12:00 PM – 2:00 PM) everyday.",
    image: "/images/veg_lunch.jpg",
    mealType: "Both",
    dietType: "Veg",
    category: "Monthly",
    itemsIncluded: ["Morning Breakfast + Tea", "Full Afternoon Lunch Thali", "4 Phulkas + Rice + Dal + Sabzi"],
    isAvailable: true,
    featured: true,
  },
  {
    id: "5",
    name: "Breakfast + Dinner Combo (Monthly)",
    price: 2800,
    description: "Hostel monthly combo for breakfast & evening dinner",
    longDescription: "Ideal for college students: Breakfast (8:30 AM – 9:30 AM) + Dinner (8:00 PM – 9:30 PM) daily.",
    image: "/images/veg_dinner.jpg",
    mealType: "Both",
    dietType: "Veg",
    category: "Monthly",
    itemsIncluded: ["Hot Breakfast + Beverage", "Full Evening Dinner Thali (4 Rotis, Special Sabzi, Dal, Rice)"],
    isAvailable: true,
    featured: false,
  },
  {
    id: "6",
    name: "Lunch + Dinner Combo (Monthly)",
    price: 3300,
    description: "Hostel two-meal power combo for Lunch & Dinner",
    longDescription: "Most popular hostel package! Full Lunch (12:00 PM – 2:00 PM) and Dinner (8:00 PM – 9:30 PM) delivered fresh to your hostel room.",
    image: "/images/veg_lunch.jpg",
    mealType: "Both",
    dietType: "Veg",
    category: "Monthly",
    itemsIncluded: ["Full Lunch Thali (Phulkas, Sabzi, Dal, Rice)", "Full Dinner Thali (Rotis, Paneer/Curry, Dal, Rice)"],
    isAvailable: true,
    featured: true,
  },
  {
    id: "7",
    name: "Full Mess Plan (Breakfast + Lunch + Dinner)",
    price: 3800,
    description: "All-inclusive 3 meals daily monthly mess subscription",
    longDescription: "Total hostel meal coverage! Breakfast (8:30–9:30 AM), Lunch (12:00–2:00 PM), and Dinner (8:00–9:30 PM) everyday. Complete peace of mind.",
    image: "/images/veg_dinner.jpg",
    mealType: "Both",
    dietType: "Veg",
    category: "Monthly",
    itemsIncluded: ["Daily Breakfast + Tea (8:30-9:30 AM)", "Afternoon Lunch Thali (12:00-2:00 PM)", "Evening Dinner Thali (8:00-9:30 PM)", "Weekend Special Sweets"],
    isAvailable: true,
    featured: true,
  },
];
