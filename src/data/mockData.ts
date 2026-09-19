export type UserRole = "Admin" | "Customer";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for safety in client, though mock will have it
  role: UserRole;
  phone?: string;
  address?: string;
  selectedTiffinId?: string; // Maps to a Tiffin ID from tiffins.ts
  leaves?: { id: string; from: string; to: string }[];
}

export type TiffinStatus = "Delivered" | "Cancelled" | "Pending";

export interface DailyLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  status: TiffinStatus;
}

// Initial Mock Users
export const initialUsers: User[] = [
  {
    id: "admin-1",
    name: "System Admin",
    email: "admin@matka.com",
    password: "password123",
    role: "Admin",
  },
  {
    id: "cust-1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "password123",
    role: "Customer",
    phone: "9876543210",
    address: "Room 402, Boys Hostel A, Pune",
    selectedTiffinId: "t1", // Basic Veg Tiffin
    leaves: [],
  },
  {
    id: "cust-2",
    name: "Priya Patel",
    email: "priya@example.com",
    password: "password123",
    role: "Customer",
    phone: "9876543211",
    address: "Apt 12, Sunrise Residency, Kothrud",
    selectedTiffinId: "t3", // Light Diet Plate
    leaves: [],
  },
  {
    id: "cust-3",
    name: "Ananya Singh",
    email: "ananya@example.com",
    password: "password123",
    role: "Customer",
    phone: "9876543212",
    address: "Room 105, Girls Hostel B, Shivaji Nagar",
    selectedTiffinId: "t2", // Authentic Jain Tiffin
    leaves: [],
  },
  {
    id: "cust-4",
    name: "Vikram Malhotra",
    email: "vikram@example.com",
    password: "password123",
    role: "Customer",
    phone: "9876543213",
    address: "Flat 302, Elite Apartments, Baner",
    selectedTiffinId: "t1", // Basic Veg Tiffin
    leaves: [],
  },
];

// Generate mock daily logs for the last 5 days for all customers
const getPastDateString = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

const customers = initialUsers.filter(u => u.role === "Customer");
const statuses: TiffinStatus[] = ["Delivered", "Delivered", "Delivered", "Cancelled", "Pending"]; 

export const initialLogs: DailyLog[] = [];
let logIdCounter = 1;

customers.forEach(customer => {
  // Generate logs for the last 5 days
  for (let i = 0; i < 5; i++) {
    initialLogs.push({
      id: `log-${logIdCounter++}`,
      userId: customer.id,
      date: getPastDateString(i),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }
});
