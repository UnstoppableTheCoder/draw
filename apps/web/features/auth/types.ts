export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

export interface AuthResponse {
  user: User;
}
