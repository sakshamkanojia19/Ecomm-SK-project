
import { toast } from "@/hooks/use-toast";

export const TOKEN_KEY = "auth_token";
export const USER_KEY = "user_data";

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setUser(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): any {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/login";
}

export async function handleApiError(error: any): Promise<never> {
  console.error("API Error:", error);
  
  let message = "An unknown error occurred";
  
  if (error.response) {

    message = error.response.data?.message || `Error: ${error.response.status}`;
    console.log("Response error data:", error.response.data);
  } else if (error.request) {

    message = "No response from server. Please check your internet connection.";
    console.log("Request error:", error.request);
  } else {
    
    message = error.message || "Unknown error occurred";
  }
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
  
  throw new Error(message);
}
