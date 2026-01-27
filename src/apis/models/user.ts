import type { UserLike, UserPlay } from "./user_activity";

export interface ResAuth {
  data: {
    token: string;
    user: User;
    message: string;
    status: string;
  };
}
export interface ResAuthMe {
  data: User; // Untuk /auth/me, data langsung berisi User
  message: string;
  status: string;
}
// models/User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Usually omitted in responses
  created_at: string | Date;
  updated_at: string | Date;
  deleted_at?: string | Date;

  // Relationships
  likes?: UserLike[];
  plays?: UserPlay[];
}

// models/UserRegister.ts
export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

// models/UserLogin.ts
export interface UserLogin {
  email: string;
  password: string;
}

// models/AuthResponse.ts
export interface AuthResponse {
  token: string;
  user: User;
}
