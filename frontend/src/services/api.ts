
import axios from "axios";
import { AuthResponse, Category, User } from "@/types";
import { getToken, handleApiError, setToken, setUser } from "@/lib/auth";

const API_URL =  "https://ecomm-sk-backend.vercel.app/api";
// "http://localhost:5000/api";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10000,
});


api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error intercepted:", error);
    
 
    if (error.code === 'Refuse to connect' || !error.response) {
      console.error("Network error or timeout");
      return Promise.reject({
        response: {
          data: {
            message: "Network error. Please check your connection or the server might be down."
          }
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log("Attempting login with:", { email });
      const { data } = await api.post('/users/login', { email, password });
      
      console.log("Login response:", data);
      

      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return handleApiError(error);
    }
  },
  
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log("Attempting registration with:", { name, email });
      const { data } = await api.post('/users', { name, email, password });
      
      console.log("Registration response:", data);
      
   
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return handleApiError(error);
    }
  },
  
  getProfile: async (): Promise<User> => {
    try {
      const { data } = await api.get('/users/profile');
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export const CategoryService = {
  getCategories: async (page: number = 1, limit: number = 6): Promise<{ categories: Category[], total: number }> => {
    try {
      console.log(`Fetching categories - page: ${page}, limit: ${limit}`);
      const { data } = await api.get('/categories', { 
        params: { page, limit } 
      });
      
      console.log('Categories data received:', data);
      return {
        categories: data.categories,
        total: data.total
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return handleApiError(error);
    }
  },
  
  getUserPreferences: async (): Promise<string[]> => {
    try {
      console.log('Fetching user preferences');
      const { data } = await api.get('/interests');
      console.log('User preferences received:', data);
      return data.categoryIds || [];
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return handleApiError(error);
    }
  },
  
  updateUserPreferences: async (categoryIds: string[]): Promise<string[]> => {
    try {
      console.log('Updating user preferences with:', categoryIds);
      const { data } = await api.put('/interests', { categoryIds });
      console.log('Updated preferences response:', data);
      return data.categoryIds;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return handleApiError(error);
      // api
    }
  },
};

export default api;
