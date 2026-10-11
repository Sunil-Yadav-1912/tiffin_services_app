export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("matka_token");
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    }
  });

  if (res.status === 401) {
    window.dispatchEvent(new Event("unauthorized_api"));
  }

  return res;
};

const mapTiffin = (item: any) => {
  const t = item.tiffin ? item.tiffin : item;
  let items = [];
  if (Array.isArray(t.items_included)) {
    items = t.items_included;
  } else if (typeof t.items_included === 'string') {
    try { items = JSON.parse(t.items_included); } catch (e) { items = [t.items_included]; }
  } else if (Array.isArray(t.itemsIncluded)) {
    items = t.itemsIncluded;
  }

  return {
    id: String(t.id),
    name: t.name || "",
    description: t.description || "",
    longDescription: t.long_description || t.longDescription || t.description || "",
    price: Number(t.price || 0),
    image: t.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2926&auto=format&fit=crop",
    dietType: t.diet_type || t.dietType || "Veg",
    mealType: t.meal_type || t.mealType || "Lunch",
    category: t.category || "Daily",
    itemsIncluded: items,
    isAvailable: t.is_available ?? t.isAvailable ?? true
  };
};

export const api = {
  // Auth
  login: async (credentials: any) => {
    const res = await fetchWithAuth(`${BASE_URL}/login`, {
      method: "POST",

      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },
  logout: async () => {
    const res = await fetchWithAuth(`${BASE_URL}/logout`, {
      method: "POST",
      headers: getHeaders()
    });
    return res.json();
  },

  // Customer
  getCustomerProfile: async () => {
    const res = await fetchWithAuth(`${BASE_URL}/customer/profile`);
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },
  updateCustomerProfile: async (data: any) => {
    const res = await fetchWithAuth(`${BASE_URL}/customer/profile`, {
      method: "PUT",

      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },
  getCustomerLeaves: async () => {
    const res = await fetchWithAuth(`${BASE_URL}/customer/leaves`);
    if (!res.ok) return [];
    return res.json();
  },
  scheduleLeave: async (data: { from_date: string; to_date: string }) => {
    const res = await fetchWithAuth(`${BASE_URL}/customer/leaves`, {
      method: "POST",

      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to schedule leave");
    return res.json();
  },
  cancelLeave: async (id: string | number) => {
    const res = await fetchWithAuth(`${BASE_URL}/customer/leaves/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.json();
  },
  getCustomerLogs: async () => {
    const res = await fetchWithAuth(`${BASE_URL}/customer/logs`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  },
  getCustomerBills: async () => {
    const res = await fetchWithAuth(`${BASE_URL}/customer/bills`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  },

  // Admin
  getCustomers: async () => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/customers`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  },
  createCustomer: async (data: any) => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/customers`, {
      method: "POST",

      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create customer");
    return res.json();
  },
  getCustomerDetails: async (id: string | number) => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/customers/${id}`);
    if (!res.ok) throw new Error("Failed to fetch customer");
    return res.json();
  },
  updateCustomer: async (id: string | number, data: any) => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/customers/${id}`, {
      method: "PUT",

      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update customer");
    return res.json();
  },
  deleteCustomer: async (id: string | number) => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/customers/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return res.json();
  },
  getTiffins: async () => {
    try {
      const res = await fetch(`${BASE_URL}/tiffins`);
      if (!res.ok) return [];
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      return arr.map(mapTiffin).filter((t: any) => t.name !== "");
    } catch (e) {
      return [];
    }
  },
  getTiffin: async (id: string | number) => {
    try {
      const res = await fetch(`${BASE_URL}/tiffins/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return mapTiffin(data.data ? data.data : data);
    } catch (e) {
      return null;
    }
  },
  createTiffin: async (data: any) => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/tiffins`, {
      method: "POST",

      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create tiffin");
    return res.json();
  },
  getDailyLogs: async (date: string) => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/daily-logs?date=${date}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  },
  bulkUpdateLogs: async (data: { user_id: string | number; tiffin_id: string | number; date: string; status: string }) => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/daily-logs/bulk-update`, {
      method: "POST",

      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update logs");
    return res.json();
  },
  getAdminBills: async (monthYear?: string) => {
    const url = monthYear ? `${BASE_URL}/admin/billing?month_year=${monthYear}` : `${BASE_URL}/admin/billing`;
    const res = await fetchWithAuth(url, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  },
  updateBillStatus: async (billId: string | number, status: "Paid" | "Unpaid") => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/billing/${billId}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update bill status");
    return res.json();
  },
  generateBilling: async (monthYear?: string) => {
    const res = await fetchWithAuth(`${BASE_URL}/admin/billing/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(monthYear ? { month_year: monthYear } : {})
    });
    return res.json();
  }
};
