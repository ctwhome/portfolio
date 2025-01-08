export interface AuthResult {
  ok?: boolean;
  error?: string;
  url?: string;
  status?: number;
}

export interface RegisterResponse {
  error?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface AuthError {
  message: string;
  code?: string;
}

export type AuthProvider = 'credentials' | 'google' | 'magic-link';
