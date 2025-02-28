
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { AuthService } from "@/services/api";
import { getToken, getUser, isAuthenticated as checkAuth, logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Initializing auth...");
        if (checkAuth()) {
          console.log("User is authenticated, setting user from storage");
          const storedUser = getUser();
          setUser(storedUser);
          
        
          try {
            console.log("Fetching updated profile");
            const profile = await AuthService.getProfile();
            setUser(profile);
          } catch (error) {
            console.error("Error fetching profile during init:", error);
     
            if (error.response?.status === 401) {
              console.log("Token invalid, logging out");
              logout();
            }
          }
        } else {
          console.log("No authentication found");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login attempt with email:", email);
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      console.log("Login successful:", response);
      setUser(response.user);
      toast({
        title: "Success",
        description: "You have successfully logged in!",
      });
    } catch (error) {
      console.error("Login error in context:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log("Registration attempt with email:", email);
    setLoading(true);
    try {
      const response = await AuthService.register(name, email, password);
      console.log("Registration successful:", response);
      setUser(response.user);
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });
    } catch (error) {
      console.error("Registration error in context:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
