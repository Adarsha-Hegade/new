export interface SignupData {
  email: string;
  password: string;
  username: string;
  name: string;
  phoneNumber: string;
}

export interface AuthResponse {
  user: any;
  session: any;
}

export interface AuthError extends Error {
  statusCode?: number;
  originalError?: any;
}