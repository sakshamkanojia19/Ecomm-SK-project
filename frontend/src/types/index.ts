
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface UserPreference {
  userId: string;
  categoryIds: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
